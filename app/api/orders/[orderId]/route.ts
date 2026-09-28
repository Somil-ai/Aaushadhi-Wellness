import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/**
 * GET /api/orders/[orderId]
 *
 * Fetches order details from Strapi using the customer-facing orderId.
 * Used by the order confirmation page. Supports page refreshes.
 *
 * Requires login, and only returns the order if it belongs to the logged-in
 * customer (matched by email) — orderId alone (AAU-YYMMDD-XXXX, a 4-digit
 * random suffix) is guessable, so it must never be treated as a secret
 * capable of authorizing access on its own.
 *
 * Returns: Order summary, items, address, courier/tracking details, payment status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Please log in to view this order." },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Query Strapi for the order by orderId (UID field)
    const strapiRes = await fetch(
      `${STRAPI_URL}/api/orders?filters[orderId][$eq]=${encodeURIComponent(orderId)}&populate[shippingAddress]=true&populate[orderItem][populate][product][fields][0]=id`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!strapiRes.ok) {
      console.error("Strapi order fetch failed:", strapiRes.status);
      return NextResponse.json(
        { success: false, error: "Failed to fetch order details" },
        { status: 500 }
      );
    }

    const strapiData = await strapiRes.json();

    if (!strapiData.data || strapiData.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = strapiData.data[0];

    // Ownership check — return the same "not found" a guessed/unrelated
    // orderId would get, rather than a distinguishable 403, so this
    // endpoint can't be used to enumerate which order IDs are real.
    if (order.customerEmail !== session.email) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // NOTE: Strapi's Order content-type has no top-level customerName /
    // customerPhone / trackingId fields — they live as shippingAddress.name,
    // shippingAddress.mobile, and trackingAwb respectively. Mapping them
    // here keeps the API response shape convenient for the frontend
    // (StrapiOrder in lib/checkout-types.ts) without the frontend needing
    // to know Strapi's internal component structure. There's no `labelUrl`
    // field in Strapi at all, so it's always null for now.
    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        documentId: order.documentId,
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        customerName: order.shippingAddress?.name ?? null,
        customerPhone: order.shippingAddress?.mobile ?? null,
        customerEmail: order.customerEmail,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discountAmount: order.discountAmount ?? 0,
        couponCode: order.couponCode ?? null,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        orderItem: order.orderItem,
        courierName: order.courierName,
        courierEstimate: order.courierEstimate,
        icarryShipmentId: order.icarryShipmentId,
        trackingId: order.trackingAwb ?? null,
        trackingUrl: order.trackingUrl,
        labelUrl: null,
        paymentGatewayOrderId: order.paymentGatewayOrderId,
        paymentGatewayPaymentId: order.paymentGatewayPaymentId,
        notes: order.notes,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
