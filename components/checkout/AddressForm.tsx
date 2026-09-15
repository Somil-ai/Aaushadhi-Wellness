"use client";

import { useState, useEffect, useCallback } from "react";
import type { DeliveryEstimate, PaymentMethod } from "@/lib/checkout-types";

type Props = {
  cartItems: { quantity: number }[];
  onComplete: (data: {
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
  }) => void;
};

export default function AddressForm({ cartItems, onComplete }: Props) {
  const [pincode, setPincode] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [checking, setChecking] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] =
    useState<DeliveryEstimate | null>(null);
  const [serviceError, setServiceError] = useState("");
  const [formError, setFormError] = useState("");

  // Check serviceability when pincode is 6 digits
  const checkServiceability = useCallback(
    async (pin: string) => {
      setChecking(true);
      setServiceError("");
      setDeliveryEstimate(null);

      try {
        const res = await fetch("/api/checkout/serviceability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pincode: pin,
            paymentMethod: "cod" as PaymentMethod, // Default check with COD
            items: cartItems,
          }),
        });

        const data = await res.json();

        if (data.success && data.data) {
          setDeliveryEstimate(data.data);
          setCity(data.data.city);
          setState(data.data.state);
          setCountry(data.data.country);
        } else {
          setServiceError(
            data.error || "Delivery not available to this pincode"
          );
        }
      } catch {
        setServiceError("Failed to check delivery. Please try again.");
      } finally {
        setChecking(false);
      }
    },
    [cartItems]
  );

  useEffect(() => {
    if (pincode.length === 6) {
      checkServiceability(pincode);
    } else {
      setDeliveryEstimate(null);
      setServiceError("");
      setCity("");
      setState("");
      setCountry("");
    }
  }, [pincode, checkServiceability]);

  const handleContinue = () => {
    if (!fullName.trim()) {
      setFormError("Please enter your full name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setFormError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!addressLine1.trim()) {
      setFormError("Please enter your address");
      return;
    }
    if (!deliveryEstimate) {
      setFormError("Please enter a valid serviceable pincode");
      return;
    }

    setFormError("");
    onComplete({
      pincode,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city,
      state,
      country,
      deliveryEstimate,
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Location icon */}
      <div className="flex justify-center mb-6">
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      </div>

      <h2
        className="text-xl md:text-2xl font-bold text-text-dark text-center mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Delivery Address
      </h2>
      <p className="text-text-muted text-sm text-center mb-8">
        Enter your pincode to check delivery availability
      </p>

      <div className="space-y-4">
        {/* Pincode */}
        <div>
          <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
            Pin Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter 6-digit pincode"
            className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all placeholder:text-text-muted/60"
            autoFocus
          />

          {/* Serviceability checking indicator */}
          {checking && (
            <div className="flex items-center gap-2 mt-2 text-olive text-xs">
              <svg
                className="animate-spin w-3.5 h-3.5"
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
              Checking delivery availability...
            </div>
          )}

          {/* Service error */}
          {serviceError && (
            <p className="text-red-500 text-xs mt-2">{serviceError}</p>
          )}

          {/* Delivery info card */}
          {deliveryEstimate && (
            <div
              className="mt-3 p-3.5 rounded-xl bg-olive/5 border border-olive/15 animate-fade-slide-up"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-olive/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    width="16"
                    height="16"
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
                <div>
                  <p className="text-olive font-semibold text-sm">
                    Delivery Available
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    Estimated delivery:{" "}
                    <span className="font-medium text-text-dark">
                      {deliveryEstimate.estimatedDays}
                    </span>
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    Shipping charge:{" "}
                    <span className="font-medium text-text-dark">
                      ₹{deliveryEstimate.shippingCost}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show remaining form fields only after serviceability check passes */}
        {deliveryEstimate && (
          <div
            className="space-y-4 animate-fade-slide-up-delay"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFormError("");
                }}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark
                  outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                  placeholder:text-text-muted/60"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setFormError("");
                }}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark
                  outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                  placeholder:text-text-muted/60"
              />
              <p className="text-text-muted text-[11px] mt-1">
                Needed by the courier partner to contact you for delivery.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                Email{" "}
                <span className="text-text-muted font-normal normal-case">
                  (optional)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark
                  outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                  placeholder:text-text-muted/60"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                  setFormError("");
                }}
                placeholder="House/Flat No., Street, Area"
                className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark
                  outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                  placeholder:text-text-muted/60"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Landmark, Building (optional)"
                className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/60 text-sm text-text-dark
                  outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                  placeholder:text-text-muted/60"
              />
            </div>

            {/* City + State (read-only, auto-filled) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-parchment/40 text-sm text-text-dark cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-parchment/40 text-sm text-text-dark cursor-not-allowed"
                />
              </div>
            </div>

            {/* Country (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-parchment/40 text-sm text-text-dark cursor-not-allowed"
              />
            </div>

            {formError && (
              <p className="text-red-500 text-xs text-center">{formError}</p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-olive text-white hover:bg-olive-light active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md"
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
