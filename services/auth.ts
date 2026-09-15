import { AuthResponse, StrapiCustomer } from "@/lib/auth-types";

/**
 * Service to encapsulate Next.js BFF authentication interactions.
 */
export const authService = {
  /**
   * Send an OTP to the user's email.
   */
  async sendOtp(email: string): Promise<void> {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to send OTP");
    }
  },

  /**
   * Verify the OTP and receive the Strapi Customer.
   */
  async verifyOtp(email: string, otp: string, name: string): Promise<StrapiCustomer> {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, name }),
    });

    const data: AuthResponse = await res.json();
    if (!res.ok || !data.success || !data.customer) {
      throw new Error(data.error || "Invalid OTP");
    }

    return data.customer;
  },

  /**
   * Fetch the currently logged-in user from the session cookie.
   */
  async me(): Promise<StrapiCustomer | null> {
    try {
      const res = await fetch("/api/auth/me", { method: "GET" });
      if (!res.ok) return null;
      const data: AuthResponse = await res.json();
      return data.success && data.customer ? data.customer : null;
    } catch {
      return null;
    }
  },

  /**
   * Sign out and clear the session.
   */
  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },
};
