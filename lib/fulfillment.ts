/**
 * Shared order-fulfillment helpers.
 *
 * Centralizes the "book an iCarry shipment + sync tracking data to Strapi"
 * logic so it isn't duplicated between the COD flow (place-order) and the
 * online-payment flow (payment-verify / Razorpay webhook). Also holds the
 * Strapi lookup/update helpers the webhook receivers need.
 *
 * NOTE: Strapi v5 identifies entries by `documentId` (a string), not the
 * numeric `id` and NOT our custom human-readable `orderId` (e.g. "AAU-260628-0482").
 * Always resolve documentId via a filtered GET before calling PUT/DELETE.
 */

import { bookShipment, calculateTotalWeight } from "./icarry";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export type FulfillmentShippingAddress = {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

export type FulfillmentOrderItem = {
  productName: string;
  quantity: number;
};

export type FulfillmentOrder = {
  orderId: string;
  documentId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  courierId: string | number;
  shippingAddress: FulfillmentShippingAddress;
  orderItem: FulfillmentOrderItem[];
};

/**
 * Shape of an order as returned by Strapi's REST API (populate=*).
 * Loosely typed on purpose — we only rely on the fields fulfillment/webhook
 * code actually reads/writes; Strapi may return more.
 */
export type StrapiOrderRecord = {
  id: number;
  documentId: string;
  orderId: string;
  orderStatus: string;
  paymentMethod: "cod" | "online";
  paymentStatus: string;
  customerEmail: string | null;
  totalAmount: number;
  courierId: string;
  paymentGatewayOrderId: string | null;
  paymentGatewayPaymentId: string | null;
  icarryShipmentId: string | null;
  icarryStatusCode: number | null;
  trackingAwb: string | null;
  needsManualReview: boolean;
  statusHistory: Array<{ status: string; timestamp: string; source: string; remarks?: string }>;
  // customerName/customerPhone live here as `name`/`mobile` — there is no
  // top-level customerName/customerPhone field on the Order content-type.
  shippingAddress: FulfillmentShippingAddress;
  orderItem: FulfillmentOrderItem[];
  [key: string]: unknown;
};

// ─── Book Shipment + Sync Tracking ───────────────────────────

/**
 * Book the iCarry shipment for a confirmed order and persist tracking fields
 * on Strapi. Callers should check `icarryShipmentId` is not already set
 * before calling this — it does not itself guard against double-booking.
 */
export async function bookAndAttachShipment(
  order: FulfillmentOrder
): Promise<{ success: boolean; error?: string }> {
  // TEMPORARY: see the same flag in the serviceability route. Skips the
  // real iCarry booking call while KYC/credentials aren't active yet, so
  // the rest of the order flow (payment, confirmation) can still be tested.
  if (process.env.ICARRY_MOCK_MODE === "true") {
    await updateOrder(order.documentId, {
      icarryShipmentId: `MOCK-${order.orderId}`,
      trackingAwb: `MOCKAWB${Date.now()}`,
      courierName: "Mock Courier",
      orderStatus: "processing",
      lastSyncedAt: new Date().toISOString(),
      notes: "iCarry booking skipped — ICARRY_MOCK_MODE is on (KYC pending).",
    });
    return { success: true };
  }

  const ICARRY_PICKUP_ADDRESS_ID = parseInt(
    process.env.ICARRY_PICKUP_ADDRESS_ID || "0",
    10
  );

  try {
    const totalWeight = calculateTotalWeight(order.orderItem);
    const productDescription = order.orderItem
      .map((item) => `${item.productName} x${item.quantity}`)
      .join(", ");

    const bookingResult = await bookShipment({
      courierId: order.courierId,
      consigneeName: order.customerName,
      consigneePhone: order.customerPhone,
      consigneeAddress: `${order.shippingAddress.addressLine1}${
        order.shippingAddress.addressLine2
          ? ", " + order.shippingAddress.addressLine2
          : ""
      }`,
      consigneeCity: order.shippingAddress.city,
      consigneeState: order.shippingAddress.state,
      consigneePincode: order.shippingAddress.pincode,
      orderValue: order.totalAmount,
      isCod: order.paymentMethod === "cod",
      totalWeightGrams: totalWeight,
      orderId: order.orderId,
      productDescription,
      pickupAddressId: ICARRY_PICKUP_ADDRESS_ID,
    });

    if (bookingResult.error || (!bookingResult.shipment_id && !bookingResult.awb)) {
      await updateOrder(order.documentId, {
        needsManualReview: true,
        notes: `iCarry booking failed: ${bookingResult.error || "unknown error"}`,
      });
      return {
        success: false,
        error: bookingResult.error || "iCarry booking returned no shipment_id",
      };
    }

    await updateOrder(order.documentId, {
      icarryShipmentId: bookingResult.shipment_id || null,
      trackingAwb: bookingResult.awb || null,
      trackingUrl: bookingResult.tracking_url || null,
      courierId: bookingResult.courier_id
        ? String(bookingResult.courier_id)
        : String(order.courierId),
      ...(bookingResult.courier_name
        ? { courierName: bookingResult.courier_name }
        : {}),
      orderStatus: "processing",
      lastSyncedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (err) {
    await updateOrder(order.documentId, {
      needsManualReview: true,
      notes: `iCarry booking exception: ${
        err instanceof Error ? err.message : String(err)
      }`,
    }).catch(() => {});
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown booking error",
    };
  }
}

// ─── Strapi Order Helpers ─────────────────────────────────────

/** Update an order in Strapi by its documentId. */
export async function updateOrder(
  documentId: string,
  data: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/orders/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to update order ${documentId}: ${res.status} ${text}`);
  }
}

/** Find an order by our human-readable orderId (e.g. "AAU-260628-0482"). */
export async function findOrderByOrderId(orderId: string): Promise<StrapiOrderRecord | null> {
  const query = new URLSearchParams({
    "filters[orderId][$eq]": orderId,
    populate: "*",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] || null;
}

/** Find an order by iCarry's shipment_id — used by the iCarry status webhook. */
export async function findOrderByShipmentId(shipmentId: string): Promise<StrapiOrderRecord | null> {
  const query = new URLSearchParams({
    "filters[icarryShipmentId][$eq]": shipmentId,
    populate: "*",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] || null;
}

/** Find an order by the Razorpay payment ID — used by the refund/webhook flows. */
export async function findOrderByPaymentId(paymentId: string): Promise<StrapiOrderRecord | null> {
  const query = new URLSearchParams({
    "filters[paymentGatewayPaymentId][$eq]": paymentId,
    populate: "*",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] || null;
}

// ─── iCarry Webhook Log Helpers ───────────────────────────────

/** Log a raw iCarry webhook payload for audit before attempting to process it. */
export async function logIcarryWebhook(
  payload: unknown,
  callbackType: string
): Promise<string | null> {
  const res = await fetch(`${STRAPI_URL}/api/icarry-webhook-logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        callbackType,
        payload,
        receivedAt: new Date().toISOString(),
        processed: false,
      },
    }),
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.documentId || null;
}

export async function markWebhookLogProcessed(
  documentId: string,
  error?: string
): Promise<void> {
  await fetch(`${STRAPI_URL}/api/icarry-webhook-logs/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: { processed: !error, error: error || null },
    }),
  }).catch(() => {});
}
