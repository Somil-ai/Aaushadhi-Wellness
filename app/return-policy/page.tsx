"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  PhoneCall,
} from "lucide-react";

const returnSections = [
  {
    icon: Package,
    title: "Return Eligibility",
    points: [
      "Products are intended for personal use and hygiene.",
      "Returns are generally not accepted once a product has been delivered.",
      "Only damaged, defective or incorrect products are eligible for replacement or refund.",
    ],
  },
  {
    icon: CheckCircle,
    title: "Conditions for Return",
    points: [
      "Notify us within 48 hours of delivery.",
      "Provide clear photographs of the product.",
      "The item must remain unused.",
      "Original packaging and labels should be intact.",
      "Our team will verify the request before approval.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Non-Returnable Products",
    points: [
      "Opened products.",
      "Used products.",
      "Products damaged due to misuse.",
      "Returns requested after the allowed period.",
    ],
  },
];export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#ECD7B9]">

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -left-40 top-16 h-[420px] w-[420px] rounded-full bg-white/30 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#D7C6A5] blur-[120px]" />

          <div className="absolute left-0 top-12 hidden text-[180px] opacity-10 lg:block">
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

                <Package
                  className="text-[#556B2F]"
                  size={18}
                />

                <span className="font-semibold text-[#556B2F]">
                  Return Policy
                </span>

              </div>

              <h1
                className="mt-8 text-5xl font-bold text-[#2F3E2D] md:text-7xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Return Policy
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[#655D50]">
                Your satisfaction is important to us. Please review our return
                policy before requesting a replacement or refund.
              </p>

            </motion.div>

          </div>

        </section>
                <section className="pb-24">

          <div className="mx-auto max-w-6xl px-6 space-y-8">

            {returnSections.map((section, index) => {

              const Icon = section.icon;

              return (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * .08 }}
                  className="rounded-[32px] border border-white/70 bg-white/70 p-10 shadow-xl"
                >

                  <div className="flex items-center gap-5">

                    <div className="rounded-2xl bg-[#556B2F]/10 p-4">

                      <Icon
                        size={30}
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
                Contact Our Support Team
              </h2>

              <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/90">
                Need help with a return request? Contact us with your order
                details and our team will guide you through the process.
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

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}