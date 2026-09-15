/**
 * iCarry.in Delivery Aggregator API Client
 *
 * Based on the official iCarry REST API PDF documentation (v16.0).
 *
 * Endpoints used:
 *   1. POST /api_login                — Authenticate and get api_token
 *   2. POST /api_check_pincode        — Check pincode serviceability
 *   3. POST /api_get_estimate          — Get shipping rate estimates
 *   4. POST /api_add_shipment_surface  — Book a surface shipment
 */

const ICARRY_BASE_URL = "https://www.icarry.in";
const ICARRY_USERNAME = process.env.ICARRY_API_USERNAME || "";
const ICARRY_API_KEY = process.env.ICARRY_API_KEY || "";
const WAREHOUSE_PINCODE = process.env.WAREHOUSE_PINCODE || "302020";

// Default package dimensions for herbal powder pouches (100g units)
const DEFAULT_PACKAGE = {
  length: 20, // cm
  breadth: 15, // cm
  height: 10, // cm
  weightPerUnit: 120, // grams (100g product + packaging)
};

// ─── Token Cache ─────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Login to iCarry and obtain an API token.
 * Tokens are cached for 55 minutes (iCarry tokens last ~60 min).
 *
 * Endpoint: POST /api_login
 * Body: { username, key }
 * Response: { success, api_token }
 */
async function getToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const url = `${ICARRY_BASE_URL}/api_login`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: ICARRY_USERNAME,
      key: ICARRY_API_KEY,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iCarry login failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (!data.api_token) {
    throw new Error(`iCarry login returned no token: ${JSON.stringify(data)}`);
  }

  cachedToken = data.api_token;
  // Cache for 55 minutes (safety margin before 60-min expiry)
  tokenExpiresAt = Date.now() + 55 * 60 * 1000;

  return cachedToken!;
}

// ─── Types ───────────────────────────────────────────────────

export type ICarryCourier = {
  courier_id: string | number;
  courier_name: string;
  courier_group_name: string;
  freight_cost: string;
  cod_cost: string;
  rto_cost: string;
  courier_cost: string; // Total cost (freight + cod)
};

export type ICarryEstimateResponse = {
  success: number;
  error?: string;
  estimate?: ICarryCourier[];
};

export type ICarryBookingResponse = {
  success?: string;
  error?: string;
  shipment_id?: string;
  pickup_id?: string;
  courier_id?: string;
  courier_name?: string;
  awb?: string;
  cost_estimate?: string;
  tracking_url?: string;
};

export type ICarryServiceabilityResponse = {
  success: number;
  msg?: Array<{
    service: string;
    prepaid: string;
    cod: string;
    pickup: string;
  }>;
};

// ─── Check Serviceability by Pincode ─────────────────────────

/**
 * Check if a pincode is serviceable by iCarry couriers.
 *
 * Endpoint: POST /api_check_pincode?api_token=<token>
 * Body: { pincode }
 * Response: { success: 1|0, msg: [{ service, prepaid, cod, pickup }] }
 */
export async function checkServiceability(
  pincode: string
): Promise<{ serviceable: boolean; codAvailable: boolean }> {
  const token = await getToken();

  const url = `${ICARRY_BASE_URL}/api_check_pincode?api_token=${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pincode }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iCarry serviceability check failed: ${res.status} ${text}`);
  }

  const data: ICarryServiceabilityResponse = await res.json();

  if (data.success !== 1 || !data.msg || data.msg.length === 0) {
    return { serviceable: false, codAvailable: false };
  }

  // Check if COD is available for any service type
  const codAvailable = data.msg.some((s) => s.cod === "Y");

  return { serviceable: true, codAvailable };
}

// ─── Get Shipping Estimate ───────────────────────────────────

/**
 * Get shipping estimates for a domestic shipment.
 * Returns available couriers with rates and ETAs.
 *
 * Endpoint: POST /api_get_estimate?api_token=<token>
 * Body: { origin_pincode, destination_pincode, weight, length, breadth, height,
 *         origin_country_code, destination_country_code, shipment_mode,
 *         shipment_type, shipment_value }
 * Response: { success, error, estimate: [...] }
 */
export async function getEstimate(
  destinationPincode: string,
  totalWeightGrams: number,
  isCod: boolean,
  orderValue: number
): Promise<ICarryCourier[]> {
  const token = await getToken();

  const url = `${ICARRY_BASE_URL}/api_get_estimate?api_token=${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origin_pincode: parseInt(WAREHOUSE_PINCODE, 10),
      destination_pincode: parseInt(destinationPincode, 10),
      weight: totalWeightGrams,
      length: DEFAULT_PACKAGE.length,
      breadth: DEFAULT_PACKAGE.breadth,
      height: DEFAULT_PACKAGE.height,
      origin_country_code: "IN",
      destination_country_code: "IN",
      shipment_mode: "S", // Surface — cheaper for powders
      shipment_type: isCod ? "C" : "P",
      shipment_value: orderValue,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iCarry estimate failed: ${res.status} ${text}`);
  }

  const data: ICarryEstimateResponse = await res.json();

  if (data.success !== 1 || !data.estimate || !Array.isArray(data.estimate)) {
    return [];
  }

  return data.estimate;
}

/**
 * Get the cheapest available courier for a destination.
 * Returns null if the pincode is not serviceable.
 */
export async function getCheapestCourier(
  destinationPincode: string,
  totalWeightGrams: number,
  isCod: boolean,
  orderValue: number
): Promise<ICarryCourier | null> {
  const couriers = await getEstimate(
    destinationPincode,
    totalWeightGrams,
    isCod,
    orderValue
  );

  if (couriers.length === 0) return null;

  // Sort by total courier_cost ascending and pick the cheapest
  couriers.sort(
    (a, b) => parseFloat(a.courier_cost) - parseFloat(b.courier_cost)
  );
  return couriers[0];
}

// ─── Book Shipment ───────────────────────────────────────────

type BookShipmentParams = {
  courierId: string | number;
  consigneeName: string;
  consigneePhone: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  orderValue: number;
  isCod: boolean;
  totalWeightGrams: number;
  orderId: string; // Our internal order ID
  productDescription: string;
  pickupAddressId: number; // Required by iCarry — set in .env
};

/**
 * Book a shipment with the selected courier.
 *
 * Endpoint: POST /api_add_shipment_surface?api_token=<token>
 * Body uses PHP-style nested keys for consignee and parcel objects.
 * Response: { success, error, shipment_id, awb, tracking_url, ... }
 */
export async function bookShipment(
  params: BookShipmentParams
): Promise<ICarryBookingResponse> {
  const token = await getToken();

  const url = `${ICARRY_BASE_URL}/api_add_shipment_surface?api_token=${token}`;

  // iCarry uses PHP-style nested keys: consignee[name], parcel[type], etc.
  const body = new URLSearchParams();

  // Pickup address (must be pre-configured in iCarry dashboard)
  body.append("pickup_address_id", String(params.pickupAddressId));
  body.append("client_order_id", params.orderId);

  // Courier selection
  body.append("courier_id", String(params.courierId));

  // Consignee details
  body.append("consignee[name]", params.consigneeName);
  body.append("consignee[mobile]", params.consigneePhone);
  body.append("consignee[address]", params.consigneeAddress);
  body.append("consignee[city]", params.consigneeCity);
  body.append("consignee[pincode]", params.consigneePincode);
  body.append("consignee[state]", params.consigneeState);
  body.append("consignee[country_code]", "IN");

  // Parcel details
  body.append("parcel[type]", params.isCod ? "COD" : "Prepaid");
  body.append("parcel[value]", String(params.orderValue));
  body.append("parcel[currency]", "INR");
  body.append("parcel[contents]", params.productDescription);
  body.append("parcel[weight][weight]", String(params.totalWeightGrams));
  body.append("parcel[weight][unit]", "gm");
  body.append("parcel[dimensions][length]", String(DEFAULT_PACKAGE.length));
  body.append("parcel[dimensions][breadth]", String(DEFAULT_PACKAGE.breadth));
  body.append("parcel[dimensions][height]", String(DEFAULT_PACKAGE.height));
  body.append("parcel[dimensions][unit]", "cm");

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iCarry booking failed: ${res.status} ${text}`);
  }

  return res.json();
}

// ─── Get Pincode Details (India Post API) ────────────────────

/**
 * Get city/state from a pincode using the India Post API.
 * This is NOT an iCarry endpoint — used for address auto-fill.
 */
export async function getPincodeDetails(
  pincode: string
): Promise<{ city: string; state: string; country: string } | null> {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await res.json();

    if (
      data &&
      data[0] &&
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      const po = data[0].PostOffice[0];
      return {
        city: po.District || po.Division || "",
        state: po.State || "",
        country: "India",
      };
    }

    return null;
  } catch {
    return null;
  }
}

// ─── Utility ─────────────────────────────────────────────────

/**
 * Helper to calculate total package weight from order items.
 * Each unit is 100g of product + packaging overhead.
 */
export function calculateTotalWeight(
  items: { quantity: number }[]
): number {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  return totalUnits * DEFAULT_PACKAGE.weightPerUnit;
}
