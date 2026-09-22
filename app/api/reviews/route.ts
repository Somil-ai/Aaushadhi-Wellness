import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createReview, hasCustomerReviewed } from "@/lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export type SubmitReviewRequest = {
  productId: number;
  rating: number;
  comment: string;
};

export type SubmitReviewResponse = {
  success: boolean;
  error?: string;
};

/**
 * POST /api/reviews
 *
 * Submits a new product review. Requires the customer to be logged in —
 * their name/email come from their Strapi customer record via the session,
 * never from the request body, so a review can't be posted under someone
 * else's name. New reviews always start as "pending" and only appear on
 * the site once approved from the Strapi admin (Content Manager > Review).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "Please log in to write a review." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as SubmitReviewRequest;
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment?.trim()) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "Please provide a rating and a comment." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    if (comment.trim().length > 2000) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "Review is too long (max 2000 characters)." },
        { status: 400 }
      );
    }

    // One review per customer per product.
    const alreadyReviewed = await hasCustomerReviewed(productId, session.email);
    if (alreadyReviewed) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "You've already reviewed this product." },
        { status: 409 }
      );
    }

    // Look up the customer's display name — never trust a name from the client.
    const customerQuery = new URLSearchParams({
      "filters[email][$eq]": session.email,
      "fields[0]": "firstName",
      "fields[1]": "lastName",
    }).toString();

    const customerRes = await fetch(`${STRAPI_URL}/api/customers?${customerQuery}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    }).catch(() => null);

    const customerJson = customerRes && customerRes.ok ? await customerRes.json() : null;
    const customerRecord = customerJson?.data?.[0];
    const customerName = customerRecord
      ? `${customerRecord.firstName || ""} ${customerRecord.lastName || ""}`.trim() ||
        session.email.split("@")[0]
      : session.email.split("@")[0];

    const result = await createReview({
      productId,
      customerEmail: session.email,
      customerName,
      rating,
      comment: comment.trim(),
    });

    if (!result.success) {
      return NextResponse.json<SubmitReviewResponse>(
        { success: false, error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json<SubmitReviewResponse>({ success: true });
  } catch (error) {
    console.error("Submit review error:", error);
    return NextResponse.json<SubmitReviewResponse>(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
