/**
 * Server-side shipping quote. place-order uses this instead of trusting the
 * shippingCost / courierId / courierName the browser sends, which a modified
 * request could set to 0, negative, or another courier entirely.
 */
import { getCheapestCourier, calculateTotalWeight } from "./icarry";

export type ShippingQuote = {
  shippingCost: number;
  courierId: string | number;
  courierName: string;
};

let warnedMock = false;

export async function getVerifiedShippingQuote(input: {
  pincode: string;
  paymentMethod: "cod" | "online";
  items: { quantity: number }[];
  orderValue: number;
}): Promise<ShippingQuote | null> {
  if (process.env.ICARRY_MOCK_MODE === "true") {
    if (process.env.NODE_ENV === "production" && !warnedMock) {
      warnedMock = true;
      console.warn(
        "[SECURITY/CONFIG] ICARRY_MOCK_MODE is ON in production — orders get a fake courier and fake tracking. Disable it."
      );
    }
    return { shippingCost: 60, courierId: "mock-courier-1", courierName: "Mock Courier" };
  }

  const cheapest = await getCheapestCourier(
    input.pincode,
    calculateTotalWeight(input.items),
    input.paymentMethod === "cod",
    input.orderValue
  );
  if (!cheapest) return null;

  const cost = parseFloat(cheapest.courier_cost);
  if (!Number.isFinite(cost) || cost < 0) return null;

  return {
    shippingCost: cost,
    courierId: cheapest.courier_id,
    courierName: cheapest.courier_name,
  };
}
