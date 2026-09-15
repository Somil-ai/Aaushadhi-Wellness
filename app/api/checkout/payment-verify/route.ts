import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { verifyPaymentSignature } from "@/lib/razorpay";
import {
  bookAndAttachShipment,
  findOrderByOrderId,
  updateOrder,
} from "@/lib/fulfillment";
import type {
  OrderStatus,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from "@/lib/checkout-types";

/**
 * POST /api/checkout/payment-verify
 *
 * Called by the frontend immediately after Razorpay Checkout reports a
 * successful payment.
 *   1. Verify the payment signature server-side — the client's word alone
 *      is never trusted for something that decides whether an order is paid.
 *   2. Mark the order paid + confirmed in Strapi.
 *   3. Book the iCarry shipment now that payment is actually confirmed.
 *
 * This is also idempotent and safe to race against the Razorpay webhook
 * (/api/webhooks/razorpay), which acts as a safety net for cases where the
 * browser never calls this endpoint (tab closed mid-redirect, etc).
 *
 * Body: PaymentVerifyRequest
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<PaymentVerifyResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as PaymentVerifyRequest;
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json<PaymentVerifyResponse>(
        { success: false, error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const order = await findOrderByOrderId(orderId);
    if (!order) {
      return NextResponse.json<PaymentVerifyResponse>(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Defense in depth: the Razorpay order attached to this order must match
    // the one we're being asked to verify — stops a payment for order A being
    // replayed to mark order B as paid.
    if (order.paymentGatewayOrderId !== razorpay_order_id) {
      return NextResponse.json<PaymentVerifyResponse>(
        { success: false, error: "Order/payment mismatch" },
        { status: 400 }
      );
    }

    // Idempotency: the Razorpay webhook may have already processed this
    // (e.g. if it fired before the browser redirect completed).
    if (order.paymentStatus === "paid") {
      return NextResponse.json<PaymentVerifyResponse>({
        success: true,
        data: {
          orderId,
          paymentStatus: "paid",
          orderStatus: order.orderStatus as OrderStatus,
          shipmentBooked: !!order.icarryShipmentId,
          alreadyProcessed: true,
        },
      });
    }

    const validSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!validSignature) {
      await updateOrder(order.documentId, { paymentStatus: "failed" }).catch(() => {});
      return NextResponse.json<PaymentVerifyResponse>(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    await updateOrder(order.documentId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paymentGatewayPaymentId: razorpay_payment_id,
      paymentGatewaySignature: razorpay_signature,
    });

    // Book the iCarry shipment now that payment is confirmed.
    // customerName/customerPhone live inside the shippingAddress component
    // in Strapi (fields: name, mobile) — there's no top-level field for them.
    const fulfillment = await bookAndAttachShipment({
      orderId: order.orderId,
      documentId: order.documentId,
      customerName: order.shippingAddress.name,
      customerPhone: order.shippingAddress.mobile,
      totalAmount: order.totalAmount,
      paymentMethod: "online",
      courierId: order.courierId,
      shippingAddress: order.shippingAddress,
      orderItem: order.orderItem,
    });

    return NextResponse.json<PaymentVerifyResponse>({
      success: true,
      data: {
        orderId,
        paymentStatus: "paid",
        orderStatus: "confirmed",
        shipmentBooked: fulfillment.success,
      },
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json<PaymentVerifyResponse>(
      { success: false, error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
