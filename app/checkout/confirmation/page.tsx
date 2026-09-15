"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { StrapiOrder } from "@/lib/checkout-types";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<StrapiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.error || "Order not found");
        }
      } catch {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="animate-spin w-8 h-8 text-olive mb-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-text-muted text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-text-dark text-lg font-medium mb-2">
          {error || "Order not found"}
        </p>
        <Link
          href="/products"
          className="text-olive text-sm font-semibold hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-8">
        <div
          className="mx-auto w-20 h-20 rounded-full bg-olive/10 flex items-center justify-center mb-5 animate-scale-in"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5C6B2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold text-olive mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Order Placed Successfully!
        </h1>
        <p className="text-text-muted text-sm">
          Thank you for your order,{" "}
          <span className="font-medium text-text-dark">
            {order.customerName}
          </span>
        </p>
      </div>

      {/* Order ID card */}
      <div
        className="rounded-2xl p-5 md:p-6 bg-white/80 mb-6"
        style={{
          border: "1px solid rgba(92,107,46,0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Order ID
            </p>
            <p className="text-olive font-bold text-lg">{order.orderId}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`
                px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${
                  order.orderStatus === "confirmed" ||
                  order.orderStatus === "processing"
                    ? "bg-olive/10 text-olive"
                    : order.orderStatus === "shipped"
                      ? "bg-blue-50 text-blue-600"
                      : order.orderStatus === "delivered"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                }
              `}
            >
              {order.orderStatus}
            </span>
            <span
              className={`
                px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${
                  order.paymentMethod === "cod"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-olive/10 text-olive"
                }
              `}
            >
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="border-t border-olive/10 pt-4">
          <p className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-3">
            Items Ordered
          </p>
          <div className="space-y-3">
            {order.orderItem?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-parchment/40 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-dark text-sm font-medium truncate">
                    {item.productName}
                  </p>
                  <p className="text-text-muted text-xs">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <span className="text-text-dark font-semibold text-sm flex-shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-olive/10 mt-4 pt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Subtotal</span>
            <span className="text-text-dark">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Shipping</span>
            <span className="text-text-dark">₹{order.shippingCost}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1">
            <span className="text-text-dark">Total</span>
            <span className="text-olive">
              ₹{order.totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Shipping address */}
        <div
          className="rounded-2xl p-5 bg-white/80"
          style={{
            border: "1px solid rgba(92,107,46,0.08)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
          }}
        >
          <p className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
            Shipping Address
          </p>
          <p className="text-sm text-text-dark font-medium">
            {order.customerName}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {order.shippingAddress?.addressLine1}
          </p>
          {order.shippingAddress?.addressLine2 && (
            <p className="text-xs text-text-muted">
              {order.shippingAddress.addressLine2}
            </p>
          )}
          <p className="text-xs text-text-muted">
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
            — {order.shippingAddress?.pincode}
          </p>
          <p className="text-xs text-text-muted mt-1.5">
            📞 {order.customerPhone}
          </p>
        </div>

        {/* Courier details */}
        <div
          className="rounded-2xl p-5 bg-white/80"
          style={{
            border: "1px solid rgba(92,107,46,0.08)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
          }}
        >
          <p className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
            Delivery Details
          </p>
          <p className="text-sm text-text-dark font-medium">
            {order.courierName}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Estimated: {order.courierEstimate}
          </p>
          {order.trackingId && (
            <div className="mt-2">
              <p className="text-xs text-text-muted">
                Tracking ID:{" "}
                <span className="font-medium text-text-dark">
                  {order.trackingId}
                </span>
              </p>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-olive text-xs font-semibold hover:underline mt-1 inline-block"
                >
                  Track Shipment →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Continue shopping */}
      <div className="text-center">
        <Link
          href="/products"
          className="inline-block px-8 py-3 rounded-full bg-olive text-white text-sm font-semibold uppercase tracking-wider hover:bg-olive-light transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-6 md:pt-8 pb-20">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <svg
                className="animate-spin w-8 h-8 text-olive"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
