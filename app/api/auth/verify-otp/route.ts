import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSession } from "@/lib/session";
import type { AuthResponse, StrapiCustomer } from "@/lib/auth-types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "default_super_secret_for_dev_only";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name } = await request.json();

    if (!email || !otp) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Fetch active OTP session
    const query = new URLSearchParams({
      "filters[email][$eq]": emailLower,
    }).toString();

    const fetchRes = await fetch(`${STRAPI_URL}/api/otp-sessions?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!fetchRes.ok) {
      return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
    }

    const fetchJson = await fetchRes.json();
    const existingSessions = fetchJson.data;

    if (!existingSessions || existingSessions.length === 0) {
      return NextResponse.json<AuthResponse>({ success: false, error: "No active login session found. Please request a new code." }, { status: 400 });
    }

    // Use the most recent session if there are multiples
    const activeSession = existingSessions.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const { documentId, otpHash, expiresAt, attempts } = activeSession;

    // 2. Check Expiry
    if (new Date() > new Date(expiresAt)) {
      // Delete expired session
      await fetch(`${STRAPI_URL}/api/otp-sessions/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      }).catch(() => {});
      return NextResponse.json<AuthResponse>({ success: false, error: "OTP has expired. Please request a new code." }, { status: 400 });
    }

    // 3. Check Attempts
    if (attempts >= MAX_ATTEMPTS) {
      await fetch(`${STRAPI_URL}/api/otp-sessions/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      }).catch(() => {});
      return NextResponse.json<AuthResponse>({ success: false, error: "Too many failed attempts. Please request a new code." }, { status: 429 });
    }

    // 4. Verify Hash
    const incomingHash = crypto.createHmac("sha256", SESSION_SECRET).update(otp).digest("hex");

    if (incomingHash !== otpHash) {
      // Increment attempts
      await fetch(`${STRAPI_URL}/api/otp-sessions/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: { attempts: attempts + 1 },
        }),
      }).catch(() => {});
      return NextResponse.json<AuthResponse>({ success: false, error: "Invalid OTP code." }, { status: 401 });
    }

    // 5. Success! Delete the OTP session
    await fetch(`${STRAPI_URL}/api/otp-sessions/${documentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    }).catch(() => {});

    // 6. Fetch or Create Customer
    const customerQuery = new URLSearchParams({
      "filters[email][$eq]": emailLower,
      "populate": "*",
    }).toString();

    const customerRes = await fetch(`${STRAPI_URL}/api/customers?${customerQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!customerRes.ok) {
      return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
    }

    const customerJson = await customerRes.json();
    let customer: StrapiCustomer;
    
    // Parse name
    let firstName = "";
    let lastName = "";
    if (name) {
      const parts = name.trim().split(" ");
      firstName = parts[0];
      if (parts.length > 1) {
        lastName = parts.slice(1).join(" ");
      }
    }

    if (customerJson.data && customerJson.data.length > 0) {
      customer = customerJson.data[0];
      
      // Update name if provided and either first or last name is missing
      if (name && (!customer.firstName || !customer.lastName)) {
        const updatePayload = {
          data: {
            firstName: customer.firstName || firstName,
            lastName: customer.lastName || lastName,
          },
        };
        
        await fetch(`${STRAPI_URL}/api/customers/${customer.documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify(updatePayload),
        }).catch(() => {});
        
        customer.firstName = customer.firstName || firstName;
        customer.lastName = customer.lastName || lastName;
      }
      
    } else {
      // Create new customer
      const createPayload = {
        data: {
          email: emailLower,
          firstName,
          lastName,
        },
      };

      const createRes = await fetch(`${STRAPI_URL}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify(createPayload),
      });

      if (!createRes.ok) {
        console.error("Failed to create customer:", await createRes.text().catch(() => ""));
        return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
      }

      const createData = await createRes.json();
      customer = createData.data;
    }

    // 7. Create encrypted session cookie
    await createSession({ customerId: customer.id, email: customer.email! });

    return NextResponse.json<AuthResponse>({
      success: true,
      customer,
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json<AuthResponse>({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
  }
}
