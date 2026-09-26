import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createRazorpayOrder, getPublicKeyId } from "@/lib/razorpay";
import { bookAndAttachShipment, updateOrder } from "@/lib/fulfillment";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupon";
import type {
  PlaceOrderRequest,
  PlaceOrderResponse,
  OrderItemData,
} from "@/lib/checkout-types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/**
 * Generate a unique customer-facing order ID.
 * Format: AAU-YYMMDD-XXXX (e.g., AAU-260628-0482)
 */
function generateOrderId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit random
  return `AAU-${yy}${mm}${dd}-${rand}`;
}

/**
 * POST /api/checkout/place-order
 *
 * Creates an order in Strapi.
 *   - COD orders: books the iCarry shipment immediately and returns confirmation.
 *   - Online orders: creates a Razorpay order and returns the details the
 *     frontend needs to open Razorpay Checkout. The iCarry shipment is booked
 *     later, in /api/checkout/payment-verify, once payment is confirmed —
 *     we never want to book (and pay courier commitment on) a shipment for
 *     an order that hasn't actually been paid for.
 *
 * Body: PlaceOrderRequest
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderData = body as PlaceOrderRequest;

    const session = await getSession();
    if (!session) {
      return NextResponse.json<PlaceOrderResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // ─── Validate required fields ───
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod,
      courierName,
      courierId,
      shippingCost,
      notes,
      couponCode,
    } = orderData;

    if (!customerName || !customerPhone || !shippingAddress || !items?.length) {
      return NextResponse.json<PlaceOrderResponse>(
        { success: false, error: "Missing required order information" },
        { status: 400 }
      );
    }

    // ─── Calculate totals server-side (prevent client manipulation) ───
    const subtotal = items.reduce(
      (sum: number, item: OrderItemData) => sum + item.price * item.quantity,
      0
    );

    // ─── Re-validate the coupon from scratch — never trust a client-sent
    // discount amount. If the code has gone invalid between the checkout
    // preview and this request (expired, used up, etc.), the order still
    // goes through, just without the discount, rather than failing outright.
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    let couponDocumentId: string | null = null;
    let couponUsedCount = 0;

    if (couponCode?.trim()) {
      const couponResult = await validateCoupon(couponCode, subtotal, session.email);
      if (couponResult.valid) {
        discountAmount = couponResult.discountAmount;
        appliedCouponCode = couponResult.coupon.code;
        couponDocumentId = couponResult.coupon.documentId;
        couponUsedCount = couponResult.coupon.usedCount;
      }
      // If invalid, silently proceed without a discount — the checkout page
      // already surfaced the error at the "Apply" step, so by the time
      // place-order runs the customer has already seen (and accepted) that.
    }

    const totalAmount = subtotal + shippingCost - discountAmount;

    // ─── Generate order ID ───
    const orderId = generateOrderId();

    // ─── Determine initial statuses ───
    // NOTE: Strapi's orderStatus enum has no "pending" value — unpaid vs paid
    // is tracked separately via paymentStatus. orderStatus starts at
    // "confirmed" for both COD and online orders.
    const orderStatus = "confirmed";
    const paymentStatus = "pending";

    // ─── Create order in Strapi ───
    const strapiPayload = {
      data: {
        orderId,
        orderStatus,
        paymentMethod,
        paymentStatus,
        customerEmail: customerEmail || null,
        subtotal,
        shippingCost,
        discountAmount,
        couponCode: appliedCouponCode,
        totalAmount,
        shippingAddress: {
          name: customerName,
          mobile: customerPhone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country || "India",
        },
        orderItem: items.map((item: OrderItemData) => ({
          product: item.product, // Strapi relation ID
          productName: item.productName,
          slug: item.slug,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        courierName,
        // Store the selected courier so payment-verify can book the same one
        // later for online orders (COD books it right away, below).
        courierId: String(courierId),
        notes: notes || null,
      },
    };

    const strapiRes = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text().catch(() => "");
      console.error("Strapi order creation failed:", errorText);
      return NextResponse.json<PlaceOrderResponse>(
        { success: false, error: "System is currently in maintenance mode." },
        { status: 503 }
      );
    }

    const strapiJson = await strapiRes.json();
    // IMPORTANT: Strapi v5 identifies entries by documentId for subsequent
    // PUT/DELETE calls — NOT our custom `orderId` field and not the numeric id.
    const documentId: string = strapiJson.data.documentId;

    // Coupon was applied and the order was created successfully — count it
    // as used. Best-effort: if this fails, the order still stands; a coupon
    // usage count being slightly stale is a much smaller problem than
    // losing an otherwise-valid order over a bookkeeping call.
    if (couponDocumentId) {
      incrementCouponUsage(couponDocumentId, couponUsedCount).catch((err) =>
        console.error("Failed to record coupon usage:", err)
      );
    }

    // ─── COD: book the shipment right away ───
    if (paymentMethod === "cod") {
      bookAndAttachShipment({
        orderId,
        documentId,
        customerName,
        customerPhone,
        totalAmount,
        paymentMethod: "cod",
        courierId,
        shippingAddress,
        orderItem: items.map((item: OrderItemData) => ({
          productName: item.productName,
          quantity: item.quantity,
        })),
      }).catch((bookingError) => {
        // Log but don't fail the order — shipment can be booked manually.
        console.error("iCarry booking failed (order still created):", bookingError);
      });

      return NextResponse.json<PlaceOrderResponse>({
        success: true,
        data: {
          orderId,
          orderStatus: "confirmed",
          paymentMethod: "cod",
          totalAmount,
          discountAmount,
        },
      });
    }

    // ─── Online: create a Razorpay order, do NOT book shipment yet ───
    try {
      const razorpayOrder = await createRazorpayOrder(totalAmount, orderId, {
        orderId,
        customerName,
      });

      await updateOrder(documentId, {
        paymentGatewayOrderId: razorpayOrder.id,
      });

      return NextResponse.json<PlaceOrderResponse>({
        success: true,
        data: {
          orderId,
          orderStatus: "confirmed",
          paymentMethod: "online",
          totalAmount,
          discountAmount,
        },
        razorpay: {
          keyId: getPublicKeyId(),
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      });
    } catch (err) {
      console.error("Razorpay order creation failed:", err);
      await updateOrder(documentId, { paymentStatus: "failed" }).catch(() => {});
      return NextResponse.json<PlaceOrderResponse>(
        {
          success: false,
          error: "Unable to initiate online payment right now. Please try Cash on Delivery.",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Place order error:", error);
    return NextResponse.json<PlaceOrderResponse>(
      { success: false, error: "System is currently in maintenance mode." },
      { status: 503 }
    );
  }
}
