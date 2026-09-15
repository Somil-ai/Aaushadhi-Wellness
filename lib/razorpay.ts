/**
 * Razorpay Payment Gateway Client
 *
 * Talks to Razorpay's REST API directly via fetch (same pattern as lib/icarry.ts,
 * so no extra npm dependency is needed).
 *
 * Docs:
 *   Orders  — https://razorpay.com/docs/api/orders/
 *   Payments — https://razorpay.com/docs/api/payments/
 *   Refunds — https://razorpay.com/docs/api/refunds/
 *   Webhooks — https://razorpay.com/docs/webhooks/
 */

import crypto from "crypto";

const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

function authHeader(): string {
  const token = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString(
    "base64"
  );
  return `Basic ${token}`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ─── Types ───────────────────────────────────────────────────

export type RazorpayOrder = {
  id: string;
  amount: number; // paise
  currency: string;
  receipt: string;
  status: string;
};

export type RazorpayRefund = {
  id: string;
  payment_id: string;
  amount: number;
  status: string;
};

// ─── Create Order ────────────────────────────────────────────

/**
 * Create a Razorpay Order. This is what the frontend Checkout widget needs
 * (order_id) to open the payment sheet. Amount is passed in rupees and
 * converted to paise internally (Razorpay's smallest currency unit).
 *
 * Endpoint: POST /v1/orders
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receipt: string,
  notes?: Record<string, string>
): Promise<RazorpayOrder> {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  const res = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt,
      notes: notes || {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order creation failed: ${res.status} ${text}`);
  }

  return res.json();
}

// ─── Verify Payment Signature (called from payment-verify route) ───

/**
 * Verify the payment signature Razorpay Checkout returns to the browser after
 * a successful payment. NEVER trust the client — this must be checked
 * server-side before marking an order paid.
 *
 * signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!RAZORPAY_KEY_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return timingSafeEqualHex(expected, razorpaySignature);
}

// ─── Verify Webhook Signature ────────────────────────────────

/**
 * Verify a Razorpay webhook payload signature (X-Razorpay-Signature header).
 * IMPORTANT: rawBody must be the exact raw request body string — do not
 * JSON.parse() and re-stringify before verifying, the byte-for-byte body is
 * what Razorpay signed.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET || !signature) return false;

  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return timingSafeEqualHex(expected, signature);
}

// ─── Refunds ─────────────────────────────────────────────────

/**
 * Issue a refund for a captured payment. Omit amountInRupees for a full refund.
 *
 * Endpoint: POST /v1/payments/:id/refund
 */
export async function createRefund(
  paymentId: string,
  amountInRupees?: number,
  notes?: Record<string, string>
): Promise<RazorpayRefund> {
  const body: Record<string, unknown> = { notes: notes || {} };
  if (amountInRupees !== undefined) {
    body.amount = Math.round(amountInRupees * 100);
  }

  const res = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay refund failed: ${res.status} ${text}`);
  }

  return res.json();
}

// ─── Utility ─────────────────────────────────────────────────

/** The publishable key ID the frontend needs to open Razorpay Checkout. */
export function getPublicKeyId(): string {
  return RAZORPAY_KEY_ID;
}
