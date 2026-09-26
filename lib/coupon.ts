/**
 * Coupon validation + redemption helpers.
 *
 * IMPORTANT: the discount amount a coupon produces is always computed
 * server-side here — never trust a discountAmount sent by the client.
 * The checkout-page "Apply" button calls /api/checkout/apply-coupon (which
 * uses this same validateCoupon function) purely for a live preview;
 * place-order re-validates from scratch before actually creating the order,
 * so a stale/tampered client value can never change what gets charged.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export type StrapiCoupon = {
  id: number;
  documentId: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderValue: number;
  usageLimit: number | null;
  usageLimitPerCustomer: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
};

export type CouponValidationResult =
  | { valid: true; coupon: StrapiCoupon; discountAmount: number }
  | { valid: false; error: string };

/** Fetch a coupon by its code (case-insensitive). */
async function findCouponByCode(code: string): Promise<StrapiCoupon | null> {
  const query = new URLSearchParams({
    "filters[code][$eqi]": code.trim(),
    "pagination[pageSize]": "1",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/coupons?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] || null;
}

/** How many times has this customer already used this coupon code? */
async function countCustomerUsage(
  couponCode: string,
  customerEmail: string
): Promise<number> {
  const query = new URLSearchParams({
    "filters[couponCode][$eqi]": couponCode,
    "filters[customerEmail][$eq]": customerEmail,
    "pagination[pageSize]": "1",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return 0;
  const json = await res.json();
  return json.meta?.pagination?.total ?? json.data?.length ?? 0;
}

/**
 * Validate a coupon code against a cart subtotal + customer, and compute
 * the discount amount (capped, rounded, never exceeding the subtotal).
 */
export async function validateCoupon(
  code: string,
  subtotal: number,
  customerEmail: string
): Promise<CouponValidationResult> {
  if (!code?.trim()) {
    return { valid: false, error: "Please enter a coupon code" };
  }

  const coupon = await findCouponByCode(code);
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { valid: false, error: "This coupon is no longer active" };
  }

  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return { valid: false, error: "This coupon is not active yet" };
  }
  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return { valid: false, error: "This coupon has expired" };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`,
    };
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  if (coupon.usageLimitPerCustomer) {
    const usedByCustomer = await countCustomerUsage(coupon.code, customerEmail);
    if (usedByCustomer >= coupon.usageLimitPerCustomer) {
      return { valid: false, error: "You've already used this coupon" };
    }
  }

  let discountAmount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  }

  // Never let the discount exceed the order subtotal itself.
  discountAmount = Math.min(discountAmount, subtotal);
  discountAmount = Math.round(discountAmount * 100) / 100;

  return { valid: true, coupon, discountAmount };
}

/** Increment a coupon's usedCount after a successful order (best-effort). */
export async function incrementCouponUsage(
  couponDocumentId: string,
  currentUsedCount: number
): Promise<void> {
  await fetch(`${STRAPI_URL}/api/coupons/${couponDocumentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: { usedCount: currentUsedCount + 1 } }),
  }).catch((err) => console.error("Failed to increment coupon usage:", err));
}
