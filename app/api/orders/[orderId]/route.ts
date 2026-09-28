import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/**
 * GET /api/orders
 *
 * Lists every order placed by the logged-in customer, newest first.
 * Always scoped to session.email server-side — never accepts an email
 * from the client — so one customer can never see another's order list.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Please log in to view your orders." },
        { status: 401 }
      );
    }

    const query = new URLSearchParams({
      "filters[customerEmail][$eq]": session.email,
      "sort": "createdAt:desc",
      "populate[orderItem]": "true",
      "pagination[pageSize]": "50",
    }).toString();

    const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });

    if (!res.ok) {
      console.error("Strapi orders list failed:", await res.text().catch(() => ""));
      return NextResponse.json(
        { success: false, error: "Unable to load orders right now." },
        { status: 502 }
      );
    }

    const json = await res.json();

    const orders = (json.data || []).map((order: Record<string, unknown>) => ({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount ?? 0,
      createdAt: order.createdAt,
      orderItem: order.orderItem,
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("List orders error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load orders right now." },
      { status: 500 }
    );
  }
}
