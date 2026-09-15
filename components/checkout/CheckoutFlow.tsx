"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StepIndicator from "./StepIndicator";
import EmailVerification from "../auth/EmailVerification";
import AddressForm from "./AddressForm";
import PaymentSelector from "./PaymentSelector";
import OrderSummary from "./OrderSummary";
import type {
  CheckoutStep,
  PaymentMethod,
  DeliveryEstimate,
  OrderItemData,
} from "@/lib/checkout-types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

/** Lazily loads the Razorpay Checkout script (only once per page load). */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutFlow() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer, isLoading } = useAuth();

  // Step state
  const [step, setStep] = useState<CheckoutStep>(1);

  // Auto-skip step 1 if user is logged in
  useEffect(() => {
    if (!isLoading && customer && step === 1) {
      setStep(2);
    }
  }, [isLoading, customer, step]);

  // Step 2 data
  const [addressData, setAddressData] = useState<{
    pincode: string;
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    deliveryEstimate: DeliveryEstimate;
  } | null>(null);

  // Step 3 data
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // ─── Step 1: Email verified ───
  const handleEmailVerified = useCallback(
    () => {
      setStep(2);
    },
    []
  );

  // ─── Step 2: Address complete ───
  const handleAddressComplete = useCallback(
    (data: NonNullable<typeof addressData>) => {
      setAddressData(data);
      setStep(3);
    },
    []
  );

  // ─── Step 3: Place order ───
  const handlePlaceOrder = async () => {
    if (!addressData) return;

    setPlacing(true);
    setOrderError("");

    try {
      // Build order items with product snapshots
      const items: OrderItemData[] = cartItems.map((item) => ({
        product: item.product.id,
        productName: item.product.productName,
        slug: item.product.slug,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.mainImageUrl,
      }));

      const res = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: addressData.fullName,
          customerPhone: addressData.phone,
          customerEmail: addressData.email || customer?.email || undefined,
          shippingAddress: {
            name: addressData.fullName,
            mobile: addressData.phone,
            addressLine1: addressData.addressLine1,
            addressLine2: addressData.addressLine2 || undefined,
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            country: addressData.country,
          },
          items,
          paymentMethod,
          courierName: addressData.deliveryEstimate.courierName,
          courierId: addressData.deliveryEstimate.courierId,
          shippingCost: addressData.deliveryEstimate.shippingCost,
          courierEstimate: addressData.deliveryEstimate.estimatedDays,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.data) {
        setOrderError(data.error || "Failed to place order. Please try again.");
        setPlacing(false);
        return;
      }

      // ─── COD: order is already confirmed, go straight to confirmation ───
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/checkout/confirmation?orderId=${data.data.orderId}`);
        return;
      }

      // ─── Online: open Razorpay Checkout ───
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !data.razorpay) {
        setOrderError(
          "Unable to load the payment gateway. Please try Cash on Delivery."
        );
        setPlacing(false);
        return;
      }

      const { keyId, razorpayOrderId, amount, currency } = data.razorpay;
      const placedOrderId = data.data.orderId as string;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Aaushadhi Wellness",
        description: `Order ${placedOrderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: addressData.fullName,
          email: addressData.email || customer?.email || "",
          contact: addressData.phone,
        },
        theme: { color: "#5C6B2E" },
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          try {
            const verifyRes = await fetch("/api/checkout/payment-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: placedOrderId,
                razorpay_order_id: r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature: r.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/confirmation?orderId=${placedOrderId}`);
            } else {
              setOrderError(
                `Payment succeeded but verification failed. Please contact support with order ID: ${placedOrderId}`
              );
              setPlacing(false);
            }
          } catch {
            setOrderError(
              `Payment succeeded but we couldn't confirm it. Please contact support with order ID: ${placedOrderId}`
            );
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            setOrderError("Payment was cancelled.");
          },
        },
      });

      rzp.on("payment.failed", () => {
        setPlacing(false);
        setOrderError("Payment failed. Please try again or use Cash on Delivery.");
      });

      rzp.open();
    } catch {
      setOrderError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  // ─── Empty cart guard ───
  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 rounded-full bg-parchment flex items-center justify-center mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7A8C3A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-text-muted text-lg mb-2">Your cart is empty</p>
        <p className="text-text-muted text-sm mb-6">
          Add products to your cart before checking out.
        </p>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="inline-block px-8 py-3 rounded-full bg-olive text-white text-sm font-semibold uppercase tracking-wider hover:bg-olive-light transition-all duration-200 cursor-pointer"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const shippingCost = addressData?.deliveryEstimate?.shippingCost ?? null;

  return (
    <div className="w-full">
      <StepIndicator currentStep={step} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-2xl p-6 md:p-8 bg-white/80"
            style={{
              border: "1px solid rgba(92,107,46,0.08)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            {/* Step 1: Email Verification */}
            {step === 1 && !isLoading && !customer && (
              <EmailVerification onVerified={handleEmailVerified} />
            )}
            
            {step === 1 && isLoading && (
              <div className="py-12 flex justify-center">
                <span className="text-olive flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Checking session...
                </span>
              </div>
            )}

            {/* Step 2: Address Form */}
            {step === 2 && (
              <AddressForm
                cartItems={cartItems.map((item) => ({
                  quantity: item.quantity,
                }))}
                onComplete={handleAddressComplete}
              />
            )}

            {/* Step 3: Payment & Place Order */}
            {step === 3 && addressData && (
              <div className="max-w-lg mx-auto space-y-6">
                {/* Checkout icon */}
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5C6B2E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="1"
                        y="4"
                        width="22"
                        height="16"
                        rx="2"
                        ry="2"
                      />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                </div>

                <h2
                  className="text-xl md:text-2xl font-bold text-text-dark text-center mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Payment & Checkout
                </h2>
                <p className="text-text-muted text-sm text-center mb-4">
                  Choose your preferred payment method
                </p>

                {/* Delivery address summary */}
                <div className="p-4 rounded-xl bg-parchment/30 border border-olive/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-1">
                        Delivering to
                      </p>
                      <p className="text-sm text-text-dark font-medium">
                        {addressData.fullName}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {addressData.addressLine1}
                        {addressData.addressLine2 &&
                          `, ${addressData.addressLine2}`}
                      </p>
                      <p className="text-xs text-text-muted">
                        {addressData.city}, {addressData.state} —{" "}
                        {addressData.pincode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-olive text-xs font-semibold hover:underline cursor-pointer flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Payment method selector */}
                <PaymentSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                {/* Error */}
                {orderError && (
                  <p className="text-red-500 text-xs text-center">
                    {orderError}
                  </p>
                )}

                {/* Place Order button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className={`
                    w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider
                    transition-all duration-200 cursor-pointer
                    ${
                      placing
                        ? "bg-olive/40 text-white/60 cursor-not-allowed"
                        : "bg-olive text-white hover:bg-olive-light active:scale-[0.98] shadow-lg"
                    }
                  `}
                >
                  {placing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
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
                      {paymentMethod === "online" ? "Opening Payment..." : "Placing Order..."}
                    </span>
                  ) : paymentMethod === "online" ? (
                    `Pay ₹${(cartTotal + (shippingCost || 0)).toLocaleString("en-IN")} Online`
                  ) : (
                    `Place Order — ₹${(cartTotal + (shippingCost || 0)).toLocaleString("en-IN")}`
                  )}
                </button>

                {paymentMethod === "cod" && (
                  <p className="text-text-muted text-[11px] text-center">
                    You will pay ₹
                    {(cartTotal + (shippingCost || 0)).toLocaleString("en-IN")}{" "}
                    to the delivery partner when your order arrives.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              cartItems={cartItems}
              subtotal={cartTotal}
              shippingCost={shippingCost}
              courierEstimate={
                addressData?.deliveryEstimate?.estimatedDays
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
