"use client";

import { useState, useRef, useEffect } from "react";
import { authService } from "@/services/auth";
import type { StrapiCustomer } from "@/lib/auth-types";

interface EmailVerificationProps {
  onVerified: (customer: StrapiCustomer) => void;
  title?: string;
  subtitle?: string;
}

export default function EmailVerification({
  onVerified,
  title = "Verify your email",
  subtitle = "We'll send you a secure one-time password.",
}: EmailVerificationProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (cooldown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      await authService.sendOtp(email);
      setIsOtpSent(true);
      setCooldown(60);
      // Focus first OTP input after short delay to allow DOM to render
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const customer = await authService.verifyOtp(email, code, name);
      onVerified(customer);
    } catch (err: any) {
      setError(err.message || "Invalid or expired code.");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit if complete
    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      // Small delay to allow state to update before verify
      setTimeout(() => {
        const event = new Event('submit') as unknown as React.FormEvent;
        handleVerifyOtp(event);
      }, 50);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs[nextIndex].current?.focus();

    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOtp(), 50);
    }
  };

  return (
    <div className="max-w-sm mx-auto w-full">
      <div className="text-center mb-6">
        <h2
          className="text-2xl font-bold text-text-dark mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h2>
        <p className="text-sm text-text-muted">
          {isOtpSent
            ? `Enter the 6-digit code sent to ${email}`
            : subtitle}
        </p>
      </div>

      {!isOtpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-olive/20 focus:border-olive focus:ring-1 focus:ring-olive outline-none transition-all duration-200 bg-white/50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-olive/20 focus:border-olive focus:ring-1 focus:ring-olive outline-none transition-all duration-200 bg-white/50"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !email || !name}
            className="w-full py-3.5 rounded-xl bg-olive text-white text-sm font-bold uppercase tracking-wider hover:bg-olive-light transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-olive/30 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all duration-200 bg-white"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || otp.some((d) => d === "")}
            className="w-full py-3.5 rounded-xl bg-olive text-white text-sm font-bold uppercase tracking-wider hover:bg-olive-light transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center text-sm">
            <span className="text-text-muted">Didn't receive the code? </span>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={cooldown > 0 || isLoading}
              className="text-olive font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
            </button>
          </div>
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="text-text-muted text-xs underline"
            >
              Change email address
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
