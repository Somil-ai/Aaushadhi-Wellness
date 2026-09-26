"use client";

import { useState } from "react";
import type { ApplyCouponResponse } from "@/lib/checkout-types";

type AppliedCoupon = {
  code: string;
  discountAmount: number;
};

type Props = {
  subtotal: number;
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
};

export default function CouponInput({ subtotal, applied, onApply, onRemove }: Props) {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setChecking(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const data: ApplyCouponResponse = await res.json();

      if (!data.success || !data.data) {
        setError(data.error || "Invalid coupon code");
        setChecking(false);
        return;
      }

      onApply({ code: data.data.code, discountAmount: data.data.discountAmount });
      setCode("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-olive/10 border border-olive/20">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82Z" />
            <circle cx="8" cy="8.5" r="1" fill="#5C6B2E" stroke="none" />
          </svg>
          <span className="text-sm font-semibold text-text-dark truncate">
            {applied.code}
          </span>
          <span className="text-olive text-xs font-medium flex-shrink-0">
            −₹{applied.discountAmount.toLocaleString("en-IN")} applied
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-text-muted hover:text-red-500 text-xs font-semibold flex-shrink-0 ml-2 cursor-pointer"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="Coupon code"
          className="flex-1 px-4 py-2.5 rounded-xl border border-olive/20 bg-white/80 text-sm text-text-dark
            outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
            placeholder:text-text-muted/60 uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={checking}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0
            ${
              checking
                ? "bg-olive/40 text-white/60 cursor-not-allowed"
                : "bg-olive text-white hover:bg-olive-light active:scale-[0.98]"
            }`}
        >
          {checking ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
