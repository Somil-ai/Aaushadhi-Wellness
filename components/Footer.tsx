"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const quickLinks = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const policies = [
  { title: "Terms of Use", href: "/terms-of-use" },
  { title: "Return Policy", href: "/return-policy" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Cancellation Policy", href: "/cancellation-policy" },
];

const enquire = [
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
  { title: "FAQs", href: "/faq" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#ECD7B9]">

      {/* ================= Background ================= */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -left-52 top-0 h-[420px] w-[420px] rounded-full bg-[#FFF7EB] blur-[120px]"
        />

        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#FFF7EB] blur-[120px]"
        />

        {/* Decorative Leafs */}

        <div className="pointer-events-none absolute -left-24 top-12 hidden text-[220px] opacity-[0.05] blur-[1px] lg:block">
          🌿
        </div>

        <div className="pointer-events-none absolute -right-24 bottom-10 hidden text-[220px] opacity-[0.05] blur-[1px] lg:block">
          🌿
        </div>

      </div>

      {/* ================= Container ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ================= Main Footer ================= */}

        <div className="grid gap-14 border-t border-[#D7C6A5]/60 py-20 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1.2fr]">

          {/* ================= Logo ================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <div className="flex items-center gap-5">

              <Image
                src="/aaushadhi_logo.svg"
                alt="Aaushadhi Wellness"
                width={95}
                height={95}
                className="rounded-3xl shadow-xl"
              />

              <div>

                <h2
                  className="text-3xl font-bold text-[#556B2F]"
                  style={{
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Aaushadhi Wellness
                </h2>

                <p className="mt-1 text-[#7C735F]">
                  Connected To Nature & Health
                </p>

              </div>

            </div>

            <p className="mt-8 max-w-md leading-8 text-[#666055]">
              We create authentic Ayurvedic wellness products using premium herbs,
              sustainable farming practices, and centuries-old traditional
              formulations to help families live healthier lives naturally.
            </p>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              {[
                {
                  icon: FaFacebookF,
                  href: "https://www.facebook.com/share/1EL3uvziQP/?mibextid=wwXIfr",
                },
                {
                  icon: FaInstagram,
                  href: "https://www.instagram.com/aaushadhi_wellness/",
                },
                {
                  icon: FaWhatsapp,
                  href: "https://wa.me/918269431640",
                },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C8A7] bg-white/70 text-[#556B2F] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#556B2F] hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}

            </div>

          </motion.div>

          {/* ================= Quick Links ================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
            viewport={{ once: true }}
          >

            <h3
              className="mb-8 text-2xl font-bold text-[#556B2F]"
              style={{
                fontFamily: "var(--font-playfair)",
              }}
            >
              Quick Links
            </h3>

            <ul className="space-y-5">

              {quickLinks.map((item) => (

                <li key={item.title}>

                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 text-[#5F5B54] transition hover:text-[#556B2F]"
                  >

                    <ArrowRight
                      size={15}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />

                    {item.title}

                  </Link>

                </li>

              ))}

            </ul>

          </motion.div>
                    {/* ================= Policies ================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: .25 }}
            viewport={{ once: true }}
          >

            <h3
              className="mb-8 text-2xl font-bold text-[#556B2F]"
              style={{
                fontFamily: "var(--font-playfair)",
              }}
            >
              Privacy & Policies
            </h3>

            <ul className="space-y-5">

              {policies.map((item) => (

                <li key={item.title}>

                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 text-[#5F5B54] transition hover:text-[#556B2F]"
                  >

                    <ArrowRight
                      size={15}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />

                    {item.title}

                  </Link>

                </li>

              ))}

            </ul>

          </motion.div>

          
{/* ================= Enquire ================= */}

<motion.div
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  viewport={{ once: true }}
>

  <h3
    className="mb-8 text-2xl font-bold text-[#556B2F]"
    style={{
      fontFamily: "var(--font-playfair)",
    }}
  >
    Enquire
  </h3>

  <ul className="space-y-5">

    {enquire.map((item) => (

      <li key={item.title}>

        <Link
          href={item.href}
          className="group flex items-center gap-3 text-[#5F5B54] transition hover:text-[#556B2F]"
        >

          <ArrowRight
            size={15}
            className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
          />

          {item.title}

        </Link>

      </li>

    ))}

  </ul>

</motion.div>
</div>

        {/* ================= Divider ================= */}

        <div className="h-px w-full bg-[#D9C8A7]/60" />

        {/* ================= Bottom Footer ================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between"
        >

          <p className="text-center text-sm text-[#6A645B] lg:text-left">

            © {new Date().getFullYear()}{" "}

            <span className="font-semibold text-[#556B2F]">
              Aaushadhi Wellness
            </span>

            . All Rights Reserved.

          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-[#6A645B]">

            <span>Made with</span>

            <span className="text-red-500">❤️</span>

            <span>in India</span>

          </div>

          <div className="flex justify-center lg:justify-end">

            <div className="flex items-center gap-3 rounded-full border border-[#D7C6A5] bg-white/70 px-5 py-3 shadow-sm backdrop-blur-md">

              <ShieldCheck
                size={18}
                className="text-[#556B2F]"
              />

              <span className="text-sm font-medium text-[#556B2F]">
                100% Secure Payments
              </span>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ================= Bottom Glow ================= */}

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-[#FFF8ED]/60 blur-[130px]" />

    </footer>
  );
}