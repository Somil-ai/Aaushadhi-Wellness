import { NextRequest, NextResponse } from "next/server";
import {
  findOrderByShipmentId,
  logIcarryWebhook,
  markWebhookLogProcessed,
  updateOrder,
} from "@/lib/fulfillment";

const ICARRY_WEBHOOK_TOKEN = process.env.ICARRY_WEBHOOK_TOKEN || "";

/**
 * POST /api/webhooks/icarry?token=<ICARRY_WEBHOOK_TOKEN>
 *
 * Register this URL as the shipment status callback URL in the iCarry
 * dashboard: https://<your-domain>/api/webhooks/icarry?token=<secret>
 * (iCarry doesn't support signed webhooks the way Razorpay does, so a
 * shared secret in the query string is the auth mechanism here — keep the
 * URL private.)
 *
 * Every payload is logged to Strapi's icarry-webhook-log collection first
 * (audit trail / manual replay if something goes wrong), then we try to
 * apply it to the matching order.
 *
 * ⚠️ iCarry's exact webhook payload shape isn't published in their public
 * REST docs. Before going live: trigger a test shipment status change from
 * the iCarry dashboard sandbox, inspect the logged raw payload in Strapi
 * (icarry-webhook-logs collection), and adjust the field names below
 * (shipment_id / awb / status / status_code) and STATUS_MAP to match exactly
 * what iCarry actually sends.
 */

const STATUS_MAP: Record<string, string> = {
  "picked up": "shipped",
  "in transit": "shipped",
  "out for delivery": "out_for_delivery",
  delivered: "delivered",
  rto: "returned",
  "rto delivered": "returned",
  cancelled: "cancelled",
  canceled: "cancelled",
};

function mapStatus(icarryStatus: string | undefined): string | null {
  if (!icarryStatus) return null;
  return STATUS_MAP[icarryStatus.trim().toLowerCase()] || null;
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!ICARRY_WEBHOOK_TOKEN || token !== ICARRY_WEBHOOK_TOKEN) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const callbackType = payload.status || payload.callback_type || "unknown";
  const logDocumentId = await logIcarryWebhook(payload, callbackType);

  try {
    const shipmentId = payload.shipment_id || payload.shipmentId;
    const awb = payload.awb;

    if (!shipmentId) {
      if (logDocumentId) await markWebhookLogProcessed(logDocumentId, "No shipment_id in payload");
      // Ack anyway — malformed/unrecognized payloads shouldn't make iCarry retry forever.
      return NextResponse.json({ success: true });
    }

    const order = await findOrderByShipmentId(shipmentId);

    if (!order) {
      if (logDocumentId) {
        await markWebhookLogProcessed(
          logDocumentId,
          `No order found for shipment_id ${shipmentId}`
        );
      }
      return NextResponse.json({ success: true });
    }

    const mappedStatus = mapStatus(payload.status);

    const updatePayload: Record<string, unknown> = {
      icarryStatusCode: payload.status_code ?? payload.statusCode ?? order.icarryStatusCode,
      trackingAwb: awb || order.trackingAwb,
      lastSyncedAt: new Date().toISOString(),
      // RTO needs a human to decide on refund / re-attempt / write-off.
      needsManualReview:
        mappedStatus === "returned" ? true : order.needsManualReview,
    };

    // statusHistory.status is a strict Strapi enum — only append an entry
    // when we recognized the iCarry status and mapped it to one of our own
    // values. An unrecognized raw status would fail Strapi's validation.
    if (mappedStatus) {
      updatePayload.orderStatus = mappedStatus;
      updatePayload.statusHistory = [
        ...(order.statusHistory || []),
        {
          status: mappedStatus,
          timestamp: new Date().toISOString(),
          source: "webhook",
          remarks: payload.remarks || payload.remark || payload.status || "",
        },
      ];
    }

    await updateOrder(order.documentId, updatePayload);

    if (logDocumentId) await markWebhookLogProcessed(logDocumentId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("iCarry webhook processing error:", err);
    if (logDocumentId) {
      await markWebhookLogProcessed(
        logDocumentId,
        err instanceof Error ? err.message : "Unknown error"
      );
    }
    // Still ack — the raw payload is safely logged and can be replayed manually.
    return NextResponse.json({ success: true });
  }
}
