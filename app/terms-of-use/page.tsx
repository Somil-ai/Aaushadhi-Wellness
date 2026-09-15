"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Scale, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Binding Contract",
    content:
      "By using our website or services, you acknowledge that you have read, understood, and agreed to these Terms of Use, creating a legally binding agreement between you and Aaushadhi Wellness. If you do not agree with these Terms, please do not use the website.",
  },
  {
    title: "Eligibility of Use",
    content:
      "You must be at least 18 years of age to use this website or place an order, or use it under the supervision of a parent or legal guardian. By using the website, you confirm that you meet these requirements and are legally eligible to receive our services. Aaushadhi Wellness reserves the right to suspend or terminate your access if these requirements are not met.",
  },
  {
    title: "Account Registration & Obligations",
    content:
      "If you create an account, you agree to provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your login credentials and for all activities carried out through your account.",
  },
  {
    title: "Guest Checkout",
    content:
      "Guest Checkout may also be available. Whether you register or checkout as a guest, you are responsible for providing accurate contact and delivery information. We reserve the right to refuse service, cancel orders, or suspend accounts in cases of fraud, misuse, or violation of these Terms.",
  },
  {
    title: "Orders & Payments",
    content:
      "All orders are subject to acceptance and product availability. Aaushadhi Wellness reserves the right to refuse or cancel any order due to pricing errors, stock unavailability, suspected fraud, or any violation of these Terms.",
  },
  {
    title: "Secure Payments",
    content:
      "Payments are processed through secure third-party payment gateways. We do not store your debit card, credit card, CVV, UPI PIN, or internet banking credentials.",
  },
  {
    title: "Pricing",
    content:
      "While we strive to ensure accurate product descriptions and pricing, inadvertent errors may occur. We reserve the right to correct such errors and cancel affected orders if necessary.",
  },
  {
    title: "Accepted Payment Methods",
    content:
      "Accepted payment methods include UPI, Credit Cards, Debit Cards, Net Banking, Wallets, and Cash on Delivery (COD), subject to availability.",
  },
  {
    title: "Content, Copyright & Intellectual Property",
    content:
      "All content on this website, including text, graphics, product photographs, logos, and website design, is owned by or licensed to Aaushadhi Wellness and is protected by applicable intellectual property laws.",
  },
  {
    title: "User Conduct",
    content:
      "You agree not to use the website for unlawful purposes, upload malicious software, attempt unauthorized access, interfere with website operations, or infringe the intellectual property rights of Aaushadhi Wellness or any third party.",
  },
];
export default function TermsOfUsePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#ECD7B9] min-h-screen overflow-hidden">

        {/* Background */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/30 blur-[120px]" />

          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d8c39f] blur-[140px]" />

          <div className="absolute left-0 top-24 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

          <div className="absolute bottom-0 right-0 hidden text-[180px] opacity-10 lg:block">
            🌿
          </div>

        </div>

        {/* Hero */}

        <section className="relative pt-36 pb-24">

          <div className="mx-auto max-w-5xl px-6 text-center">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
            >

              <div className="inline-flex items-center gap-2 rounded-full border border-[#556B2F]/20 bg-white/60 px-6 py-3 backdrop-blur">

                <Scale className="text-[#556B2F]" size={18} />

                <span className="font-semibold text-[#556B2F]">
                  Legal Information
                </span>

              </div>

              <h1
                className="mt-8 text-5xl md:text-7xl font-bold text-[#2F3E2D]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Terms of Use
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[#655D50]">

                These Terms of Use govern your access to the Aaushadhi Wellness
                website and all products and services offered through it.
                By accessing our website you agree to comply with these terms.

              </p>

            </motion.div>

          </div>

        </section>
                <section className="pb-24">

          <div className="mx-auto max-w-6xl px-6">

            <motion.div
              initial={{ opacity:0,y:30 }}
              whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }}
              className="mb-12 rounded-3xl bg-white/70 border border-white/70 p-10 shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-[#556B2F]/10 p-4">

                  <FileText className="text-[#556B2F]" />

                </div>

                <div>

                  <h2
                    className="text-3xl font-bold text-[#2F3E2D]"
                    style={{ fontFamily:"var(--font-playfair)" }}
                  >
                    Agreement
                  </h2>

                  <p className="mt-2 text-[#6A645B] leading-8">

                    By accessing our website, creating an account,
                    or purchasing products, you agree to these Terms of Use,
                    our Privacy Policy and all policies published on
                    Aaushadhi Wellness.

                  </p>

                </div>

              </div>

            </motion.div>

            <div className="space-y-8">

              {sections.map((section,index)=>(

                <motion.div
                  key={index}
                  initial={{ opacity:0,y:30 }}
                  whileInView={{ opacity:1,y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:index*0.05 }}
                  className="rounded-3xl border border-white/70 bg-white/70 p-10 shadow-lg"
                >

                  <h3
                    className="text-2xl font-bold text-[#556B2F]"
                    style={{ fontFamily:"var(--font-playfair)" }}
                  >
                    {section.title}
                  </h3>

                  <p className="mt-5 leading-8 text-[#5E574E]">
                    {section.content}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </section>
                <section className="pb-28">

          <div className="mx-auto max-w-5xl px-6">

            <div className="rounded-[40px] bg-[#556B2F] p-12 text-center text-white shadow-2xl">

              <ShieldCheck
                className="mx-auto mb-6"
                size={50}
              />

              <h2
                className="text-4xl font-bold"
                style={{ fontFamily:"var(--font-playfair)" }}
              >
                Need Help?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/90">

                If you have any questions regarding these Terms of Use,
                please contact the Aaushadhi Wellness support team.
                We're always happy to help.

              </p>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}