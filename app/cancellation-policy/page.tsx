"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  RefreshCcw,
  PackageCheck,
  CreditCard,
  PhoneCall,
} from "lucide-react";

const policySections = [
  {
    icon: RefreshCcw,
    title: "Order Cancellation",
    points: [
      "Orders may be cancelled before they are processed or shipped.",
      "Once an order has been dispatched, cancellation is no longer possible.",
      "Please contact us immediately if you wish to cancel an order.",
    ],
  },
  {
    icon: PackageCheck,
    title: "Returns & Refunds",
    points: [
      "Products are not eligible for return after delivery due to hygiene and personal use.",
      "Refunds or replacements are available only for damaged, defective or incorrect products.",
      "Please report any issue within 48 hours of delivery.",
      "Photographs of the damaged product must be provided for verification.",
      "Products must remain unused with original packaging.",
    ],
  },
  {
    icon: CreditCard,
    title: "Refund Processing",
    points: [
      "Approved refunds are processed to the original payment method.",
      "Refunds generally take 5–7 business days.",
      "Shipping charges are non-refundable unless the error is ours.",
    ],
  },
];export default function CancellationPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-[#ECD7B9] min-h-screen">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-white/30 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#D9C8A7] blur-[120px]" />

          <div className="absolute left-0 top-16 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

          <div className="absolute bottom-0 right-0 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

        </div>

        <section className="relative pt-36 pb-24">

          <div className="mx-auto max-w-5xl px-6 text-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <div className="inline-flex items-center gap-2 rounded-full border border-[#556B2F]/20 bg-white/70 px-6 py-3">

                <RefreshCcw
                  size={18}
                  className="text-[#556B2F]"
                />

                <span className="font-semibold text-[#556B2F]">
                  Cancellation & Refund
                </span>

              </div>

              <h1
                className="mt-8 text-5xl md:text-7xl font-bold text-[#2F3E2D]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Cancellation Policy
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[#655D50]">

                We strive to provide the best shopping experience.
                Please read our cancellation and refund guidelines
                before placing your order.

              </p>

            </motion.div>

          </div>

        </section>
                <section className="pb-24">

          <div className="mx-auto max-w-6xl px-6 space-y-8">

            {policySections.map((section, index) => {

              const Icon = section.icon;

              return (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * .1 }}
                  className="rounded-[32px] border border-white/60 bg-white/70 p-10 shadow-xl"
                >

                  <div className="flex items-center gap-5">

                    <div className="rounded-2xl bg-[#556B2F]/10 p-4">

                      <Icon
                        size={28}
                        className="text-[#556B2F]"
                      />

                    </div>

                    <h2
                      className="text-3xl font-bold text-[#2F3E2D]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {section.title}
                    </h2>

                  </div>

                  <ul className="mt-8 space-y-4">

                    {section.points.map((item, i) => (

                      <li
                        key={i}
                        className="flex gap-3 text-[#5E574E]"
                      >

                        <span className="mt-3 h-2 w-2 rounded-full bg-[#556B2F]" />

                        <span className="leading-8">
                          {item}
                        </span>

                      </li>

                    ))}

                  </ul>

                </motion.div>

              );

            })}

          </div>

        </section>
                <section className="pb-28">

          <div className="mx-auto max-w-5xl px-6">

            <div className="rounded-[40px] bg-[#556B2F] p-12 text-center text-white shadow-2xl">

              <PhoneCall
                size={48}
                className="mx-auto mb-6"
              />

              <h2
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Need Assistance?
              </h2>

              <p className="mx-auto mt-6 max-w-3xl leading-8 text-white/90">

                If you have any questions regarding cancellation,
                replacement or refunds, our support team is here to help.

              </p>

              <div className="mt-10 space-y-2 text-lg">

                <p>AAUSHADHI WELLNESS</p>

                <p>
                  16/100, Jawahar Marg,
                  Lokendra Takij,
                  Ratlam, Madhya Pradesh
                </p>

                <p>aaushadhiwellness@gmail.com</p>

                <p>+91 8269431640</p>

                <p>Business Hours: 24 Hours</p>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}