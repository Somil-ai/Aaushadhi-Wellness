/**
 * Central place for the secret used to sign session cookies and hash OTPs.
 * Resolved lazily (at request time, not import time) so `next build` doesn't
 * fail when the variable is only provided at runtime.
 *
 * In production a missing SESSION_SECRET is a hard error — silently falling
 * back to a publicly-known string would let anyone forge session cookies.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }
  return "default_super_secret_for_dev_only"; // local development only
}
