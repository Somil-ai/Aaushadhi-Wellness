"use client";

import Image from "next/image";
import type { CartItem } from "@/context/CartContext";

type Props = {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number | null;
  courierEstimate?: string;
};

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingCost,
  courierEstimate,
}: Props) {
  const total =
    shippingCost !== null ? subtotal + shippingCost : subtotal;

  return (
    <div
      className="rounded-2xl p-5 md:p-6 bg-white/80"
      style={{
        border: "1px solid rgba(92,107,46,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <h3
        className="text-base md:text-lg font-bold text-text-dark mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Order Summary
      </h3>

      {/* Items list */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-parchment/40 flex-shrink-0">
              <Image
                src={item.product.mainImageUrl}
                alt={item.product.productName}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-dark text-xs font-medium truncate">
                {item.product.productName}
              </p>
              <p className="text-text-muted text-[11px]">
                {item.quantity} × 100g
              </p>
            </div>
            <span className="text-text-dark text-xs font-semibold flex-shrink-0">
              ₹{item.product.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-olive/10 pt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text-dark font-medium">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Shipping</span>
          {shippingCost !== null ? (
            <span className="text-text-dark font-medium">
              {shippingCost === 0 ? (
                <span className="text-olive">FREE</span>
              ) : (
                `₹${shippingCost}`
              )}
            </span>
          ) : (
            <span className="text-text-muted/60 italic">
              Enter pincode
            </span>
          )}
        </div>

        {courierEstimate && (
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Estimated Delivery</span>
            <span className="text-olive font-medium text-[11px]">
              {courierEstimate}
            </span>
          </div>
        )}

        <div className="border-t border-olive/10 pt-2 mt-1">
          <div className="flex justify-between">
            <span className="text-text-dark font-bold text-sm">Total</span>
            <span className="text-olive font-bold text-lg">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
