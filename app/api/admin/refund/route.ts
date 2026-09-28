import { NextRequest, NextResponse } from "next/server";
import { createRefund, getPayment } from "@/lib/razorpay";
import { findOrderByOrderId, updateOrder } from "@/lib/fulfillment";

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || "";

/**
 * POST /api/admin/refund
 *
 * Triggers a Razorpay refund for a paid online order. Meant to be called
 * from an internal ops tool (or a Strapi admin custom action) — NOT exposed
 * to customers. Protected by a shared secret header for now; swap for real
 * admin-session auth if/when the CMS grows staff accounts with roles.
 *
 * Body: { orderId: string, amount?: number (rupees, for a partial refund), reason?: string }
 * Header: x-admin-secret: <ADMIN_API_SECRET>
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_API_SECRET || authHeader !== ADMIN_API_SECRET) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, amount, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    const order = await findOrderByOrderId(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "online" || !order.paymentGatewayPaymentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order has no online payment to refund (COD orders are settled manually).",
        },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "refunded") {
      return NextResponse.json({ success: false, error: "Order is already refunded" }, { status: 400 });
    }

    // Validate the requested amount (rupees): finite and positive.
    if (amount !== undefined && (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0)) {
      return NextResponse.json(
        { success: false, error: "Refund amount must be a positive number" },
        { status: 400 }
      );
    }

    // Ask Razorpay what's actually still refundable, so earlier partial
    // refunds are accounted for (not just compared against the order total).
    const payment = await getPayment(order.paymentGatewayPaymentId);
    const remaining = (payment.amount - payment.amount_refunded) / 100;

    if (remaining <= 0) {
      return NextResponse.json({ success: false, error: "Payment is already fully refunded" }, { status: 400 });
    }
    if (amount !== undefined && amount > remaining + 0.001) {
      return NextResponse.json(
        { success: false, error: `Only ₹${remaining} is still refundable on this payment` },
        { status: 400 }
      );
    }

    const refundAmount = amount ?? remaining;
    const refund = await createRefund(order.paymentGatewayPaymentId, refundAmount, {
      orderId: order.orderId,
      reason: reason || "Refund initiated by admin",
    });

    const isFullRefund = Math.abs(refundAmount - remaining) < 0.005;

    await updateOrder(order.documentId, {
      ...(isFullRefund ? { paymentStatus: "refunded" } : {}),
      refundId: refund.id,
      refundedAt: new Date().toISOString(),
      ...(isFullRefund ? { orderStatus: "cancelled" } : {}),
    });

    return NextResponse.json({
      success: true,
      data: { refundId: refund.id, status: refund.status, fullRefund: isFullRefund },
    });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Refund failed" },
      { status: 500 }
    );
  }
}
