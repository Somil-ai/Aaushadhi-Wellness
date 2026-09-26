import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  checkServiceability,
  getCheapestCourier,
  getPincodeDetails,
  calculateTotalWeight,
} from "@/lib/icarry";
import type { ServiceabilityResponse } from "@/lib/checkout-types";

/**
 * POST /api/checkout/serviceability
 *
 * 1. Verify the logged-in session (email OTP, cookie-based).
 * 2. Check if the pincode is serviceable via iCarry api_check_pincode.
 * 3. Get the cheapest courier rate via iCarry api_get_estimate.
 * 4. Look up city/state from India Post API for address auto-fill.
 *
 * Body: { pincode, paymentMethod, items: { quantity, price }[], idToken }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pincode, paymentMethod, items } = body;

    // ─── Validate inputs ───
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json<ServiceabilityResponse>(
        { success: false, error: "Please enter a valid 6-digit pincode" },
        { status: 400 }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json<ServiceabilityResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json<ServiceabilityResponse>(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }


    // ─── Step 1: Check serviceability via iCarry ───
    //
    // TEMPORARY: while iCarry's business KYC is pending, set
    // ICARRY_MOCK_MODE=true in .env.local to skip the real iCarry calls and
    // return a fixed mock courier so the rest of checkout (incl. Razorpay)
    // can be tested end-to-end. Remove this env var once real iCarry
    // credentials are active.
    if (process.env.ICARRY_MOCK_MODE === "true") {
      const locationDetails = await getPincodeDetails(pincode);
      if (!locationDetails) {
        return NextResponse.json<ServiceabilityResponse>(
          { success: false, error: "Invalid pincode. Please check and try again." },
          { status: 400 }
        );
      }

      return NextResponse.json<ServiceabilityResponse>({
        success: true,
        data: {
          serviceable: true,
          city: locationDetails.city,
          state: locationDetails.state,
          country: locationDetails.country,
          shippingCost: 60,
          estimatedDays: "5-7 business days (MOCK — iCarry not yet active)",
          courierName: "Mock Courier",
          courierId: "mock-courier-1",
        },
      });
    }

    const serviceability = await checkServiceability(pincode);
    if (!serviceability.serviceable) {
      return NextResponse.json<ServiceabilityResponse>({
        success: false,
        error: "Sorry, delivery is not available to this pincode at the moment.",
      });
    }

    // ─── Step 2: Get pincode location details (India Post) ───
    const locationDetails = await getPincodeDetails(pincode);
    if (!locationDetails) {
      return NextResponse.json<ServiceabilityResponse>(
        { success: false, error: "Invalid pincode. Please check and try again." },
        { status: 400 }
      );
    }

    // ─── Step 3: Get cheapest courier from iCarry ───
    const totalWeight = calculateTotalWeight(items);
    const isCod = paymentMethod === "cod";

    // Calculate order value from items
    const orderValue = items.reduce(
      (sum: number, item: { price?: number; quantity: number }) =>
        sum + (item.price || 399) * item.quantity,
      0
    );

    const cheapest = await getCheapestCourier(pincode, totalWeight, isCod, orderValue);

    if (!cheapest) {
      return NextResponse.json<ServiceabilityResponse>({
        success: false,
        error: "Sorry, delivery is not available to this pincode at the moment.",
      });
    }

    return NextResponse.json<ServiceabilityResponse>({
      success: true,
      data: {
        serviceable: true,
        city: locationDetails.city,
        state: locationDetails.state,
        country: locationDetails.country,
        shippingCost: parseFloat(cheapest.courier_cost),
        estimatedDays: "5-7 business days",
        courierName: cheapest.courier_name,
        courierId: cheapest.courier_id,
      },
    });
  } catch (error) {
    console.error("Serviceability check error:", error);
    return NextResponse.json<ServiceabilityResponse>(
      { success: false, error: "Unable to check delivery availability. Please try again." },
      { status: 500 }
    );
  }
}
