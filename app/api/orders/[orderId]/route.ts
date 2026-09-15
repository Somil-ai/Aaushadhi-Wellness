import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/**
 * GET /api/orders/[orderId]
 *
 * Fetches order details from Strapi using the customer-facing orderId.
 * Used by the order confirmation page. Supports page refreshes.
 *
 * Returns: Order summary, items, address, courier/tracking details, payment status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
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

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        documentId: order.documentId,
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        orderItem: order.orderItem,
        courierName: order.courierName,
        courierEstimate: order.courierEstimate,
        icarryShipmentId: order.icarryShipmentId,
        trackingId: order.trackingId,
        trackingUrl: order.trackingUrl,
        labelUrl: order.labelUrl,
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
