"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Database,
  Cookie,
  Users,
  UserCheck,
  Mail,
} from "lucide-react";

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Full Name",
      "Email Address",
      "Mobile Number",
      "Billing Address",
      "Shipping Address",
      "Order Details",
      "Account Information (if you create an account)",
      "Technical information such as IP address, browser type, device information, cookies and website usage data.",
    ],
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: [
      "Process and deliver your orders.",
      "Verify and manage payments.",
      "Send order confirmations and shipping updates.",
      "Provide customer support.",
      "Improve our products and services.",
      "Prevent fraud and unauthorized activities.",
      "Send promotional offers and updates where permitted.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: [
      "Cookies help us remember your preferences.",
      "Maintain your shopping cart.",
      "Improve website performance.",
      "Analyse website traffic.",
      "Disabling cookies may affect certain website features.",
    ],
  },
  {
    icon: Users,
    title: "Sharing of Information",
    content: [
      "Payment Gateway Providers",
      "Courier & Logistics Partners",
      "Technology Service Providers",
      "Government Authorities when legally required",
      "We never sell or rent your personal information.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Data Security",
    content: [
      "Administrative security measures.",
      "Technical security measures.",
      "Organisational security measures.",
      "Protection against unauthorized access.",
      "No internet transmission is completely secure.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Access your information.",
      "Correct inaccurate information.",
      "Update account details.",
      "Request deletion where legally applicable.",
    ],
  },
];export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-[#ECD7B9]">

        {/* Background */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-white/30 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#D7C6A5] blur-[120px]" />

          <div className="absolute left-0 top-16 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

          <div className="absolute bottom-10 right-0 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

        </div>

        {/* Hero */}

        <section className="relative pt-36 pb-24">

          <div className="mx-auto max-w-5xl px-6 text-center">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
            >

              <div className="inline-flex items-center gap-3 rounded-full border border-[#556B2F]/20 bg-white/70 px-6 py-3 backdrop-blur">

                <ShieldCheck
                  className="text-[#556B2F]"
                  size={18}
                />

                <span className="font-semibold text-[#556B2F]">
                  Privacy & Security
                </span>

              </div>

              <h1
                className="mt-8 text-5xl font-bold text-[#2F3E2D] md:text-7xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Privacy Policy
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[#655D50]">

                Your privacy matters to us. This Privacy Policy explains how
                Aaushadhi Wellness collects, stores, processes and protects
                your personal information whenever you use our website.

              </p>

            </motion.div>

          </div>

        </section>        <section className="pb-24">

          <div className="mx-auto max-w-6xl px-6">

            <div className="space-y-8">

              {privacySections.map((section, index) => {

                const Icon = section.icon;

                return (

                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * .08 }}
                    className="rounded-[32px] border border-white/60 bg-white/70 p-10 shadow-xl backdrop-blur"
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

                      {section.content.map((item, i) => (

                        <li
                          key={i}
                          className="flex items-start gap-3 text-[#5F5B54]"
                        >

                          <span className="mt-2 h-2 w-2 rounded-full bg-[#556B2F]" />

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

          </div>

        </section>        <section className="pb-28">

          <div className="mx-auto max-w-5xl px-6">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[40px] bg-[#556B2F] p-12 text-center text-white shadow-2xl"
            >

              <Mail
                size={48}
                className="mx-auto mb-6"
              />

              <h2
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Contact Us
              </h2>

              <p className="mx-auto mt-6 max-w-3xl leading-8 text-white/90">
                If you have any questions about this Privacy Policy or how we
                handle your personal information, please contact us anytime.
              </p>

              <div className="mt-10 space-y-2 text-lg">

                <p>AAUSHADHI WELLNESS</p>

                <p>
                  16/100, Jawahar Marg, Lokendra Takij,
                  Ratlam, Madhya Pradesh
                </p>

                <p>aaushadhiwellness@gmail.com</p>

                <p>+91 8269431640</p>

              </div>

            </motion.div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}