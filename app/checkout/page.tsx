"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-6 md:pt-8 pb-20">
        {/* Page header */}
        <div className="mb-6 md:mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold text-olive"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Checkout
          </h1>
          <p className="mt-1 text-text-muted text-sm">
            Complete your order in a few simple steps
          </p>
        </div>

        <CheckoutFlow />
      </main>

      <Footer />
    </div>
  );
}
