import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateCoupon } from "@/lib/coupon";
import type { ApplyCouponRequest, ApplyCouponResponse } from "@/lib/checkout-types";

/**
 * POST /api/checkout/apply-coupon
 *
 * Checkout-page preview only — lets the customer see the discount before
 * placing the order. place-order re-validates the coupon from scratch
 * (same validateCoupon function) before actually creating the order, so
 * this endpoint carries no authority of its own.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<ApplyCouponResponse>(
        { success: false, error: "Please log in first" },
        { status: 401 }
      );
    }

    const { code, subtotal } = (await request.json()) as ApplyCouponRequest;

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json<ApplyCouponResponse>(
        { success: false, error: "Missing coupon code or subtotal" },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal, session.email);

    if (!result.valid) {
      return NextResponse.json<ApplyCouponResponse>(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json<ApplyCouponResponse>({
      success: true,
      data: {
        code: result.coupon.code,
        discountAmount: result.discountAmount,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return NextResponse.json<ApplyCouponResponse>(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
