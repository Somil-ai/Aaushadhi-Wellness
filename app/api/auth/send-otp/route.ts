import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SESSION_SECRET = process.env.SESSION_SECRET || "default_super_secret_for_dev_only";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Check for existing active OTP session
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
      console.error("Failed to fetch OTP sessions:", await fetchRes.text().catch(() => ""));
      return NextResponse.json({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
    }

    const fetchJson = await fetchRes.json();
    const existingSessions = fetchJson.data;

    if (existingSessions && existingSessions.length > 0) {
      // Sort by createdAt descending
      const latestSession = existingSessions.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      // Check 60-second cooldown
      const timeSinceCreated = Date.now() - new Date(latestSession.createdAt).getTime();
      if (timeSinceCreated < 60 * 1000) {
        return NextResponse.json(
          { success: false, error: "Please wait 60 seconds before requesting another code." },
          { status: 429 }
        );
      }

      // Delete existing sessions for this email to prevent clutter and multiple active OTPs
      for (const session of existingSessions) {
        await fetch(`${STRAPI_URL}/api/otp-sessions/${session.documentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
        }).catch(() => {}); // Ignore errors here if backend is shaky
      }
    }

    // 2. Generate new OTP and Hash
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const otpHash = crypto.createHmac("sha256", SESSION_SECRET).update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3. Save new OTP session in Strapi
    const createPayload = {
      data: {
        email: emailLower,
        otpHash,
        expiresAt: expiresAt.toISOString(),
        attempts: 0,
      },
    };

    const createRes = await fetch(`${STRAPI_URL}/api/otp-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(createPayload),
    });

    if (!createRes.ok) {
      console.error("Failed to create OTP session:", await createRes.text().catch(() => ""));
      return NextResponse.json({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
    }

    // 4. Send Email via Resend
    const { error: emailError } = await resend.emails.send({
      from: `Aaushadhi Wellness <${fromEmail}>`,
      to: [emailLower],
      subject: "Your Login Code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #5C6B2E;">Aaushadhi Wellness</h2>
          <p>Your secure login code is:</p>
          <h1 style="font-size: 36px; letter-spacing: 4px; color: #333; margin: 20px 0;">${otp}</h1>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Failed to send email via Resend:", emailError);
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ success: false, error: "System is currently in maintenance mode." }, { status: 503 });
  }
}
