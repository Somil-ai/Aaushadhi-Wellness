import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Aaushadhi Wellness | Let's Talk Wellness",
  description:
    "Get in touch with Aaushadhi Wellness. Reach us via WhatsApp, email, or phone for product inquiries, orders, and wellness guidance.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
