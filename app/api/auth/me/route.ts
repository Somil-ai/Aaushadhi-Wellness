import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/auth-types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.email) {
      return NextResponse.json<AuthResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch latest customer data from Strapi
    const query = new URLSearchParams({
      "filters[email][$eq]": session.email,
      "populate": "*", // e.g. for addresses or orders if needed
    }).toString();

    const fetchRes = await fetch(`${STRAPI_URL}/api/customers?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }).catch(() => {});

    if (!fetchRes || !fetchRes.ok) {
      return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
    }

    const fetchJson = await fetchRes.json();

    if (!fetchJson.data || fetchJson.data.length === 0) {
      return NextResponse.json<AuthResponse>({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      customer: fetchJson.data[0],
    });

  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
  }
}
