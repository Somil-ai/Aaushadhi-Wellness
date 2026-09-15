import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  ShieldCheck,
  Droplets,
  Leaf,
  Sprout,
  HandHeart,
} from "lucide-react";
import {
  Scissors,
  FlaskConical,
  PackageCheck,
} from "lucide-react";

export const metadata: Metadata = {
title: "About Us — Aaushadhi Wellness | Rooted in Nature",
description:
"Learn about Aaushadhi Wellness — we blend ancient Ayurvedic wisdom with modern science to create 100% pure herbal products. From seed to shelf, nature's goodness in its truest form.",
};

/* ── SVG Icon Components ── */

function LeafIcon({ className = "" }: { className?: string }) {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
</svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
<path d="m9 12 2 2 4-4" />
</svg>
  );
}

function DropletIcon({ className = "" }: { className?: string }) {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
</svg>
  );
}

function SproutIcon({ className = "" }: { className?: string }) {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M7 20h10" />
<path d="M10 20c5.5-2.5.8-6.4 3-10" />
<path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
<path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
</svg>
  );
}

function HeartHandshakeIcon({ className = "" }: { className?: string }) {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
<path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
<path d="m18 15-2-2" />
<path d="m15 18-2-2" />
</svg>
  );
}

function CheckCircleIcon() {
return (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<path d="m5 12 5 5L20 7" />
</svg>
  );
}

function ArrowRightIcon() {
return (
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M5 12h14" />
<path d="m12 5 7 7-7 7" />
</svg>
  );
}

/* Small inline icons for trust strip */
function TrustIcon({ children }: { children: ReactNode }) {
return (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
{children}
</svg>
  );
}

/* Reusable section divider */
function SectionDivider({ children }: { children?: ReactNode }) {
return (
<div className="flex items-center justify-center gap-4 max-w-[400px] mx-auto">
<span className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, transparent, var(--olive), transparent)", opacity: 0.3 }} />
{children}
<span className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, transparent, var(--olive), transparent)", opacity: 0.3 }} />
</div>
  );
}

/* Reusable glass card */
function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
return (
<div
className={`rounded-3xl p-5 sm:p-7 md:p-10 transition-all duration-350 hover:-translate-y-1 ${className}`}
style={{
background: "rgba(255, 255, 255, 0.5)",
backdropFilter: "blur(20px)",
WebkitBackdropFilter: "blur(20px)",
border: "1.5px solid rgba(255, 255, 255, 0.6)",
boxShadow: "0 8px 40px rgba(0, 0, 0, 0.04), inset 0 1px 3px rgba(255, 255, 255, 0.4)",
      }}
>
{children}
</div>
  );
}

/* Feature icon circle */
function FeatureIconCircle({ children }: { children: ReactNode }) {
return (
<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-olive/20 flex items-center justify-center mx-auto mb-4 bg-white/50 transition-all duration-350 hover:border-olive hover:bg-olive/5 hover:scale-108">
{children}
</div>
  );
}

/* Process step icon */
function ProcessStepIcon({ children }: { children: ReactNode }) {
return (
<div className="w-14 h-14 sm:w-[72px] sm:h-[72px] min-w-[56px] min-h-[56px] rounded-full border-2 border-olive flex items-center justify-center mb-3.5 bg-white/60 transition-all duration-350 hover:bg-olive/8 hover:scale-110">
{children}
</div>
  );
}

/* ── Page Component ── */

const values = [
  { icon: LeafIcon, title: "100% Natural", text: "Every ingredient is sourced straight from nature, with nothing synthetic added." },
  { icon: ShieldIcon, title: "Purity Tested", text: "Every batch is lab-verified for purity, safety, and potency before it reaches you." },
  { icon: DropletIcon, title: "Cold Extracted", text: "Gentle extraction methods preserve the full potency of every herb we use." },
  { icon: SproutIcon, title: "Sustainably Grown", text: "Our herbs are cultivated in partnership with farmers who share our values." },
  { icon: HeartHandshakeIcon, title: "Ethically Sourced", text: "Fair partnerships with growers, from seed to shelf, every step of the way." },
];

const process = [
  { icon: SproutIcon, title: "Cultivate", text: "Herbs grown in nutrient-rich soil, free from pesticides." },
  { icon: LeafIcon, title: "Harvest", text: "Hand-picked at peak potency by experienced growers." },
  { icon: DropletIcon, title: "Extract", text: "Cold-processed to retain every active compound." },
  { icon: ShieldIcon, title: "Test", text: "Verified in the lab for purity before packaging." },
];

export default function AboutPage() {
return (
<>
<Navbar />

<main
  className="overflow-x-hidden"
  style={{
    backgroundImage: "url('/products/bg.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor: "#ECD7B9",
    backgroundAttachment: "fixed", // Optional: creates a premium scrolling effect
  }}
>
{/* ── Hero ── */}
<section className="relative flex min-h-[50vh] items-center overflow-hidden py-8 sm:py-10 md:min-h-[70vh] md:py-14">
{/* Decorative Leaves */}
<div className="absolute left-4 top-8 text-2xl opacity-10 sm:left-8 sm:top-12 sm:text-4xl">🌿</div>
<div className="absolute right-4 top-10 text-xl opacity-10 sm:right-10 sm:top-16 sm:text-3xl">🍃</div>
<div className="absolute bottom-8 left-6 text-xl opacity-10 sm:bottom-12 sm:left-16 sm:text-3xl">☘️</div>
<div className="absolute bottom-8 right-6 text-xl opacity-10 sm:bottom-12 sm:right-16 sm:text-3xl">🌱</div>

{/* Soft Glow */}
<div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-[100px] sm:h-[260px] sm:w-[260px]" />

<div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
<div className="flex flex-col items-center text-center">

{/* Logo */}
<div className="relative">
<div className="absolute inset-0 rounded-full bg-[#556B2F]/10 blur-2xl" />
<img
src="/aaushadhi_logo_full.svg"
alt="Aaushadhi Wellness"
className="relative mx-auto h-16 w-16 object-contain sm:h-24 sm:w-24 md:h-32 md:w-32"
/>
</div>
</div>

{/* Section Badge */}

<div className="flex justify-center">
  <span
    className="
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      border-[#CDB58A]
      bg-white/70
      px-5
      py-2
      text-xs
      font-semibold
      uppercase
      tracking-[0.25em]
      text-[#5C6B2E]
      backdrop-blur-sm
      shadow-sm
    "
  >
    🌿 Aaushadhi Wellness
  </span>
</div>

{/* Heading */}

<h2
  className="mt-6 text-center text-2xl font-bold text-[#2F3E2D] sm:text-4xl md:text-5xl"
  style={{ fontFamily: "var(--font-playfair)" }}
>
  About Us
</h2>

{/* About Card */}

<div
className="mt-6 rounded-[24px] px-5 py-6 text-center sm:mt-8 sm:rounded-[28px] sm:px-8 sm:py-8 md:px-14 md:py-12"
style={{
background: "#F3E4C8",
boxShadow:
"0 20px 50px rgba(0,0,0,.06), inset 0 1px 1px rgba(255,255,255,.5)",
      }}
>
<h3 className="text-lg font-bold leading-snug text-[#5C6B2E] sm:text-2xl md:text-3xl">
        At AAUSHADHI WELLNESS, we blend ancient Ayurvedic wisdom with
        modern science to create 100% pure herbal products that support
        your journey to a healthier, balanced life.
</h3>

<p className="mt-5 text-[#2E2E2E] text-sm leading-6 sm:mt-8 sm:text-lg sm:leading-9 md:text-xl">
        Everything we make is rooted in nature, grown with care on our own farms,
        and crafted with a deep commitment to purity, transparency and
        sustainability. From seed to shelf, we ensure nature's goodness reaches
        you in its truest form.
</p>
</div>

{/* USP Heading */}

<h2
className="mt-14 text-center text-2xl font-bold text-[#2F3E2D] sm:mt-24 sm:text-4xl md:text-5xl"
style={{ fontFamily: "var(--font-playfair)" }}
>
      Our USPs
</h2>

{/* USP Grid */}

<div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-10 md:grid-cols-3 lg:grid-cols-5 md:gap-12">

{[
        {
icon: ShieldCheck,
title: "Non Preservative",
desc: "No chemicals. No compromises. Only natural goodness.",
        },
        {
icon: Droplets,
title: "No Added Artificial Colour",
desc: "Only the natural goodness of herbs.",
        },
        {
icon: Leaf,
title: "100% Pure Herbal Product",
desc: "Pure herbs. Pure care. Pure you.",
        },
        {
icon: Sprout,
title: "Sourced From Our Own Farm",
desc: "Grown with love and harvested with care.",
        },
        {
icon: HandHeart,
title: "Sustainable & Ethical",
desc: "For you. For nature. For the future.",
        },
      ].map((item)=>(
<div key={item.title} className="text-center group">

<div
className="
            mx-auto
            w-20
            h-20
            sm:w-28
            sm:h-28
            md:w-36
            md:h-36
            rounded-full
            bg-white
            border
            border-[#D8C9AB]
            shadow-lg
            flex
            items-center
            justify-center
            text-3xl
            sm:text-4xl
            md:text-5xl
            transition
            duration-500
            group-hover:-translate-y-2
            group-hover:shadow-xl
            "
>
<item.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
</div>

<h3
className="mt-4 text-sm font-bold text-[#2F3E2D] sm:mt-6 sm:text-lg md:mt-8 md:text-2xl"
style={{ fontFamily: "var(--font-playfair)" }}
>
{item.title}
</h3>

<p className="mt-2 text-[#5F5A50] leading-5 text-xs sm:mt-3 sm:text-sm md:mt-4 md:text-base md:leading-7">
{item.desc}
</p>

</div>
      ))}

</div>

</div>
</section>
{/* ================= OUR STORY ================= */}

<section
className="relative overflow-hidden py-14 sm:py-20 md:py-28"
style={{
background: "#ECD7B9",
  }}
>
{/* Decorative Leaves */}

<div className="absolute left-4 top-8 hidden text-5xl opacity-10 sm:left-10 sm:top-16 sm:block">
    🌿
</div>

<div className="absolute right-6 bottom-10 hidden text-5xl opacity-10 sm:right-12 sm:bottom-20 sm:block">
    🍃
</div>

<div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:gap-14 sm:px-6 md:gap-20 lg:grid-cols-2">

{/* Left Image */}

<div className="relative">

<div
className="overflow-hidden rounded-[20px] sm:rounded-[34px]"
style={{
boxShadow:
"0 30px 60px rgba(0,0,0,.08)",
        }}
>
<Image
src="/Images/ourstory.jpg"      // Replace with your image
alt="Our Story"
width={650}
height={750}
className="h-64 w-full object-cover transition duration-700 hover:scale-105 sm:h-96 md:h-[700px]"
/>
</div>

</div>

{/* Right Content */}

<div className="max-w-xl">

<span
className="inline-block text-3xl font-bold text-[#5C6B2E] sm:text-4xl md:text-5xl"
style={{
fontFamily: "var(--font-playfair)",
        }}
>
        Our Story
</span>

<div className="mt-6 space-y-5 sm:mt-8 sm:space-y-8">

<p className="text-base leading-7 text-[#1F1F1F] sm:text-xl sm:leading-8 md:text-[30px] md:leading-[1.8]">

<span className="font-semibold tracking-wide">
            AAUSHADHI WELLNESS
</span>{" "}
          was born from a simple belief —
          that nature has the power to heal,
          nourish and transform lives.

</p>

<p className="text-base leading-7 text-[#1F1F1F] sm:text-xl sm:leading-8 md:text-[30px] md:leading-[1.8]">

          What started as a small step
          towards living a healthier life
          has grown into a mission to
          share the purest form of nature
          with the world.

</p>

</div>

{/* Quote */}

<div
className="mt-8 rounded-2xl border border-[#DCC9A5] bg-white/50 px-5 py-4 backdrop-blur-md sm:mt-10 sm:px-7 sm:py-5"
>
<p
className="text-sm italic text-[#5C6B2E] sm:text-base"
style={{
fontFamily: "var(--font-playfair)",
          }}
>
          "From Seed to Shelf, Every Product Carries Nature's Promise."
</p>
</div>

</div>

</div>
</section>

{/* ================= OUR PROMISE ================= */}

<section
className="relative overflow-hidden py-14 sm:py-20 md:py-28"
style={{
  background: "transparent",
}}
>
{/* Decorative Leaves */}

<img
src="/images/leaf-left.png"
alt=""
className="absolute left-0 top-16 hidden w-40 opacity-20 pointer-events-none sm:block"
/>

<img
src="/images/leaf-right.png"
alt=""
className="absolute right-0 top-8 hidden w-40 opacity-20 pointer-events-none sm:block"
/>

<img
src="/images/leaf-center.png"
alt=""
className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 opacity-15 pointer-events-none sm:w-36"
/>

<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

{/* Heading */}

<h2
className="mb-8 text-center text-2xl font-bold text-[#2F3E2D] sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl"
style={{ fontFamily: "var(--font-playfair)" }}
>
      Our Promise
</h2>

<div className="grid items-center gap-8 sm:gap-12 md:gap-16 lg:grid-cols-2">

{/* Promise Card */}

<div
className="rounded-[24px] p-6 sm:rounded-[34px] sm:p-8 md:p-12"
style={{
  background: "transparent",
}}
>
<ul className="space-y-5 text-sm leading-7 text-[#2E2E2E] sm:space-y-6 sm:text-lg sm:leading-8 md:space-y-8 md:text-[21px] md:leading-9">

<li className="flex gap-3 sm:gap-4">
<span className="text-[#5C6B2E] mt-1">•</span>
<span>
              We grow our own herbs using natural &
              sustainable practices.
</span>
</li>

<li className="flex gap-3 sm:gap-4">
<span className="text-[#5C6B2E] mt-1">•</span>
<span>
              Our products are free from preservatives,
              harmful chemicals & artificial colours.
</span>
</li>

<li className="flex gap-3 sm:gap-4">
<span className="text-[#5C6B2E] mt-1">•</span>
<span>
              We maintain the highest quality standards
              at every step — from seed to shelf.
</span>
</li>

<li className="flex gap-3 sm:gap-4">
<span className="text-[#5C6B2E] mt-1">•</span>
<span>
              We are committed to your wellness and
              the well-being of our planet.
</span>
</li>

</ul>
</div>

{/* Image */}

<div className="relative">

<div className="overflow-hidden rounded-[24px] shadow-xl sm:rounded-[34px]">

<Image
src="/Images/ourpromise.jpg"
alt="Our Promise"
width={650}
height={850}
className="h-64 w-full object-cover transition duration-700 hover:scale-105 sm:h-96 md:h-[640px]"
/>

</div>

</div>

</div>

</div>
</section>
{/* ================= FARM TO FAMILY ================= */}

<section
  className="relative overflow-hidden py-28"
  style={{
  background: "transparent",
}}
>
  {/* Decorative Leaves */}

  <img
    src="/images/leaf-left.png"
    alt=""
    className="absolute left-0 bottom-0 w-40 opacity-20"
  />

  <img
    src="/images/leaf-right.png"
    alt=""
    className="absolute right-0 top-0 w-40 opacity-20"
  />

  <img
    src="/images/leaf-center.png"
    alt=""
    className="absolute left-1/2 top-10 -translate-x-1/2 w-28 opacity-15"
  />

  <div className="relative z-10 mx-auto max-w-7xl px-6">

    <h2
      className="text-center text-5xl font-bold text-[#2F3E2D]"
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      From Our Farm to Your Family
    </h2>

    <div className="relative mt-20">

      {/* Connecting Line */}

      <div className="absolute top-14 left-[10%] right-[10%] hidden h-[2px] bg-[#556B2F]/20 lg:block" />

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

        {[
  {
    icon: Sprout,
    title: "Own Farm",
    desc: "We grow our herbs with natural care",
  },
  {
    icon: Scissors,
    title: "Careful Harvest",
    desc: "Handpicked at the right time",
  },
  {
    icon: FlaskConical,
    title: "Pure Process",
    desc: "Cleaned, sorted & prepared with utmost care",
  },
  {
    icon: PackageCheck,
    title: "Pure Products",
    desc: "Delivered to you in their purest form",
  },
].map((item) => {
  const Icon = item.icon;

  return (
    <div key={item.title} className="text-center group">

      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#556B2F] bg-white text-[#556B2F] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#556B2F] group-hover:text-white">
        <Icon size={42} strokeWidth={1.6} />
      </div>

      <h3
        className="mt-8 text-2xl font-bold text-[#5C6B2E]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {item.title}
      </h3>

      <p className="mt-4 text-base leading-7 text-[#4B4B4B]">
        {item.desc}
      </p>

    </div>
  );
})}

      </div>

    </div>

  </div>

</section>
{/* ================= FINAL CTA ================= */}

<section
  className="py-24"
  style={{
  background: "transparent",
}}
>
  <div className="mx-auto max-w-6xl px-6 text-center">

    <h2
      className="text-4xl md:text-5xl font-bold text-[#5C6B2E]"
      style={{
        fontFamily: "var(--font-playfair)",
      }}
    >
      ✻ Rooted in Nature • Crafted with Care • Trusted by Families ✻
    </h2>

    <p className="mt-10 text-4xl leading-relaxed text-[#1F1F1F]">

      Choose wellness.
      Choose purity.
      Choose{" "}

      <span className="font-bold text-[#5C6B2E]">

        AAUSHADHI WELLNESS.

      </span>

    </p>

    <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">

      {/* Products */}

      <Link
        href="/products"
        className="
          rounded-full
          bg-[#5C6B2E]
          px-12
          py-5
          text-lg
          font-semibold
          text-white
          shadow-lg
          transition
          duration-300
          hover:-translate-y-1
          hover:bg-[#6B7B33]
        "
      >
        EXPLORE OUR PRODUCTS
      </Link>

      {/* WhatsApp */}

      <a
        href="https://wa.me/919999999999"
        target="_blank"
        className="
          rounded-full
          bg-[#2ECC52]
          px-12
          py-5
          text-lg
          font-semibold
          text-white
          shadow-lg
          transition
          duration-300
          hover:-translate-y-1
          hover:bg-[#24c048]
        "
      >
        💬 CHAT WITH US
      </a>

    </div>

  </div>
</section>
</main>

<Footer />
</>
  );
}