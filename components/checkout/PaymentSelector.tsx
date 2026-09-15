"use client";

import type { PaymentMethod } from "@/lib/checkout-types";

type Props = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
};

export default function PaymentSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1">
        Payment Method
      </label>

      {/* COD Option */}
      <button
        type="button"
        onClick={() => onSelect("cod")}
        className={`
          w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
          ${
            selected === "cod"
              ? "border-olive bg-olive/5 shadow-sm"
              : "border-olive/15 bg-white/60 hover:border-olive/30"
          }
        `}
      >
        {/* Radio circle */}
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${selected === "cod" ? "border-olive" : "border-olive/30"}
          `}
        >
          {selected === "cod" && (
            <div className="w-2.5 h-2.5 rounded-full bg-olive" />
          )}
        </div>

        {/* COD icon */}
        <div className="w-10 h-10 rounded-lg bg-olive/10 flex items-center justify-center flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5C6B2E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M2 8h2" />
            <path d="M20 8h2" />
            <path d="M2 16h2" />
            <path d="M20 16h2" />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-text-dark font-semibold text-sm">
            Cash on Delivery
          </p>
          <p className="text-text-muted text-xs mt-0.5">
            Pay when your order arrives
          </p>
        </div>

        {selected === "cod" && (
          <span className="px-2 py-0.5 rounded-full bg-olive text-white text-[10px] font-bold uppercase tracking-wider">
            Selected
          </span>
        )}
      </button>

      {/* Online Payment Option */}
      <button
        type="button"
        onClick={() => onSelect("online")}
        className={`
          w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left relative
          ${
            selected === "online"
              ? "border-olive bg-olive/5 shadow-sm"
              : "border-olive/15 bg-white/60 hover:border-olive/30"
          }
        `}
      >
        {/* Radio circle */}
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${selected === "online" ? "border-olive" : "border-olive/30"}
          `}
        >
          {selected === "online" && (
            <div className="w-2.5 h-2.5 rounded-full bg-olive" />
          )}
        </div>

        {/* Online icon */}
        <div className="w-10 h-10 rounded-lg bg-olive/10 flex items-center justify-center flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5C6B2E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-text-dark font-semibold text-sm">
            Online Payment
          </p>
          <p className="text-text-muted text-xs mt-0.5">
            UPI, Cards, Net Banking
          </p>
        </div>

        {selected === "online" && (
          <span className="px-2 py-0.5 rounded-full bg-olive text-white text-[10px] font-bold uppercase tracking-wider">
            Selected
          </span>
        )}
      </button>
    </div>
  );
}
