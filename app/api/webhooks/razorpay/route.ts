import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  bookAndAttachShipment,
  findOrderByOrderId,
  findOrderByPaymentId,
  updateOrder,
} from "@/lib/fulfillment";

/**
 * POST /api/webhooks/razorpay
 *
 * Configure in Razorpay Dashboard -> Settings -> Webhooks:
 *   URL: https://<your-domain>/api/webhooks/razorpay
 *   Secret: same value as RAZORPAY_WEBHOOK_SECRET in .env
 *   Events: payment.captured, payment.failed, refund.processed
 *
 * This is a SAFETY NET alongside /api/checkout/payment-verify. The browser
 * calling payment-verify is the primary (fast) path; this webhook catches
 * payments that succeeded but where the browser never reported back
 * (tab closed, network drop mid-redirect, etc), plus refund events which
 * only ever arrive via webhook (a refund can be issued from the Razorpay
 * dashboard directly, outside our own /api/admin/refund flow).
 */
export async function POST(request: NextRequest) {
  // IMPORTANT: read the raw body — signature verification needs the exact
  // bytes Razorpay signed, not a re-serialized JSON.parse(...) round-trip.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
  }

  type RazorpayWebhookEvent = {
    event: string;
    payload?: {
      payment?: { entity?: { id: string; notes?: { orderId?: string } } };
      refund?: { entity?: { id: string; payment_id: string } };
    };
  };

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload?.payment?.entity;
        const notesOrderId = payment?.notes?.orderId;
        if (!notesOrderId) break;

        const order = await findOrderByOrderId(notesOrderId);
        if (!order) {
          console.warn("Razorpay webhook: order not found for", notesOrderId);
          break;
        }

        if (order.paymentStatus !== "paid") {
          await updateOrder(order.documentId, {
            paymentStatus: "paid",
            orderStatus: "confirmed",
            paymentGatewayPaymentId: payment.id,
          });
        }

        // Book the shipment only if it hasn't been booked already
        // (payment-verify may have already done this — this is the race-safety path).
        if (!order.icarryShipmentId) {
          await bookAndAttachShipment({
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
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload?.payment?.entity;
        const notesOrderId = payment?.notes?.orderId;
        if (!notesOrderId) break;

        const order = await findOrderByOrderId(notesOrderId);
        if (order && order.paymentStatus === "pending") {
          await updateOrder(order.documentId, { paymentStatus: "failed" });
        }
        break;
      }

      case "refund.processed": {
        const refund = event.payload?.refund?.entity;
        if (!refund?.payment_id) break;

        const order = await findOrderByPaymentId(refund.payment_id);
        if (order && order.paymentStatus !== "refunded") {
          await updateOrder(order.documentId, {
            paymentStatus: "refunded",
            refundId: refund.id,
            refundedAt: new Date().toISOString(),
            orderStatus: "cancelled",
          });
        }
        break;
      }

      default:
        // Unhandled event type — ack it so Razorpay doesn't retry.
        break;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Razorpay webhook processing error:", err);
    // Return 500 so Razorpay retries with backoff (up to ~24h) — safer than
    // silently swallowing an event we failed to apply.
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
