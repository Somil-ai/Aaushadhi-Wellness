"use client";

import { useState, useRef, type FormEvent } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════
   Contact Page — "The Wellness Conversation"
   
   Creative concept: Instead of a generic grid,
   we present contact as a journey — an organic,
   botanical layout where each contact channel
   is a "petal" radiating from a central message.
   The form is presented as writing a personal
   letter, complete with subtle paper texture.
   ═══════════════════════════════════════════════ */

/* ── Decorative leaf SVG (reused from brand) ── */
function FloatingLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className}>
      <path d="M380 30C380 30 220 20 130 140C60 240 100 350 210 340C320 330 400 180 380 30Z" fill="#7A8C3A" opacity="0.5" />
      <path d="M340 60C290 150 240 230 190 320" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

/* ── Contact channel card ── */
function ChannelCard({
  icon,
  label,
  value,
  href,
  description,
  accentColor,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  description: string;
  accentColor: string;
  delay: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group relative block rounded-3xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(255,255,255,0.55)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.5)",
        animationDelay: delay,
      }}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
        style={{ background: accentColor }}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{ background: `${accentColor}15`, border: `1.5px solid ${accentColor}25` }}
      >
        {icon}
      </div>

      {/* Label */}
      <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1.5">
        {label}
      </p>

      {/* Value */}
      <p
        className="text-lg md:text-xl font-bold text-text-dark mb-2 group-hover:text-olive transition-colors duration-300"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {value}
      </p>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center gap-1.5 text-olive opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
        <span className="text-xs font-semibold uppercase tracking-wider">Reach out</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

/* ── Main Page Component ── */
export default function ContactPage() {
  const playfair = { fontFamily: "var(--font-playfair)" };
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormState("sending");

    // Build mailto link with pre-filled fields
    const subject = encodeURIComponent(`Message from ${name} via Aaushadhi Website`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailtoUrl = `mailto:aaushadhiwellness@gmail.com?subject=${subject}&body=${body}`;

    // Small delay for the animation, then open mail client
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setFormState("sent");
      // Reset after showing success
      setTimeout(() => {
        setFormState("idle");
        setName("");
        setEmail("");
        setMessage("");
      }, 3000);
    }, 600);
  }

  return (
    <>
      <div
        className="relative min-h-screen overflow-clip"
        
          style={{
  backgroundImage: "url('/products/bg.png')",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
}}
        
      >
        {/* ── Decorative elements ── */}
        <FloatingLeaf className="absolute -top-8 -right-8 w-80 md:w-[420px] h-80 md:h-[420px] opacity-20 pointer-events-none select-none z-0" />
        <div className="absolute bottom-32 -left-12 w-48 h-48 opacity-10 pointer-events-none select-none z-0 rotate-180">
          <svg viewBox="0 0 200 200" fill="none">
            <path d="M20 180C20 180 120 170 160 100C190 40 140 0 80 20C20 40 -10 120 20 180Z" fill="#7A8C3A" />
          </svg>
        </div>

        {/* Bokeh dots */}
        <div className="absolute top-[15%] left-[8%] w-2 h-2 rounded-full bg-white/40 pointer-events-none z-0" />
        <div className="absolute top-[30%] right-[12%] w-1.5 h-1.5 rounded-full bg-white/35 pointer-events-none z-0" />
        <div className="absolute top-[60%] left-[18%] w-1 h-1 rounded-full bg-white/50 pointer-events-none z-0" />
        <div className="absolute top-[45%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/30 pointer-events-none z-0" />
        <div className="absolute top-[72%] left-[40%] w-2 h-2 rounded-full bg-white/25 pointer-events-none z-0" />

        <div className="relative z-10">
          <Navbar />

          <main
  className="relative overflow-hidden"
  style={{
    backgroundImage: "url('/images/paper-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Left Leaves */}
  <img
    src="/images/leaf-left.png"
    alt=""
    className="absolute left-0 top-0 h-full w-36 object-cover opacity-30 pointer-events-none"
  />

  {/* Right Leaves */}
  <img
    src="/images/leaf-right.png"
    alt=""
    className="absolute right-0 top-0 h-full w-36 object-cover opacity-30 pointer-events-none"
  />

  {/* Center Hanging Leaf */}
  <img
    src="/images/leaf-center.png"
    alt=""
    className="absolute left-1/2 top-0 -translate-x-1/2 w-24 opacity-40 pointer-events-none"
  />
  {/* ================= PAGE HEADING ================= */}
<section className="pt-12 md:pt-16 pb-6">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-[#7A8C3A] font-semibold mb-3">
      Get In Touch
    </p>

    <h1
      className="text-4xl md:text-6xl font-bold text-[#1F1F1F]"
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      Contact Us
    </h1>

    <div className="mt-5 flex justify-center">
      <div className="h-[3px] w-20 rounded-full bg-[#7A8C3A]" />
    </div>
  </div>
</section>

{/* ================= CONTACT HERO ================= */}

<section
  className="relative overflow-hidden bg-[#ECD7B9] py-28 md:py-36"
>
  {/* Soft Glow */}
  <div className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/25 blur-[140px]" />

  {/* Left Leaf */}
<div
  className="
    pointer-events-none
    absolute
    left-8
    bottom-10
    text-7xl
    opacity-30
  "
>
  🌿
</div>


{/* Right Leaf */}
<div
  className="
    pointer-events-none
    absolute
    right-10
    top-10
    text-6xl
    opacity-30
  "
>
  🍃
</div>


{/* Bottom Border Plants */}
<div
  className="
    pointer-events-none
    absolute
    bottom-4
    left-0
    flex
    w-full
    justify-around
    text-4xl
    opacity-25
  "
>
  <span>🌱</span>
  <span>🌿</span>
  <span>🍃</span>
  <span>🌱</span>
  <span>☘️</span>
</div>
  <div className="relative mx-auto max-w-7xl px-6">

    <div className="text-center">

      {/* Green Heading */}

      <h2
        className="text-[52px] md:text-[72px] font-bold leading-none text-[#5B6E2F]"
        style={{
          fontFamily: "var(--font-playfair)",
        }}
      >
        Every Wellness Journey
      </h2>

      {/* Black Heading */}

      <h1
        className="mt-3 text-[58px] md:text-[82px] font-bold leading-none text-[#111111]"
        style={{
          fontFamily: "var(--font-playfair)",
        }}
      >
        Starts with a Conversation
      </h1>

      {/* Description */}

      <p
        className="
          mx-auto
          mt-12
          max-w-6xl
          text-xl
          md:text-[26px]
          leading-[2.2]
          text-[#4F4F4F]
        "
      >
        Whether you have a question about our herbs,
        need guidance choosing the right product,
        or just want to say hello —
        we're here, rooted and ready.
      </p>

    </div>

  </div>
</section>
{/* ================= CONTACT CARDS ================= */}

<section className="relative max-w-6xl mx-auto px-6 pb-24">

  <div className="space-y-8">

    

    <ChannelCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  }
                  label="Chat with us"
                  value="WhatsApp"
                  href="https://wa.me/918269431640"
                  description="Our fastest channel. Get product recommendations, place orders, or ask anything — we typically reply within minutes."
                  accentColor="#25D366"
                  delay="0ms"
                />

                {/* Email */}
                <ChannelCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  }
                  label="Write to us"
                  value="aaushadhiwellness@gmail.com"
                  href="mailto:aaushadhiwellness@gmail.com"
                  description="For detailed inquiries, bulk orders, partnerships, or anything that deserves a thoughtful, written response."
                  accentColor="#5C6B2E"
                  delay="80ms"
                />

                {/* Phone */}
                <ChannelCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                  label="Call us"
                  value="+91 82694 31640"
                  href="tel:+918269431640"
                  description="Sometimes a voice is all you need. Call us for quick guidance on our products or to place an order directly."
                  accentColor="#8B5E3C"
                  delay="160ms"
                />

                {/* Facebook */}
                <ChannelCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  }
                  label="Follow us"
                  value="Facebook"
                  href="https://www.facebook.com/share/1EL3uvziQP/?mibextid=wwXIfr"
                  description="Join our community on Facebook for updates, wellness tips, and special offers."
                  accentColor="#1877F2"
                  delay="240ms"
                />

                {/* Instagram */}
                <ChannelCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  }
                  label="Connect with us"
                  value="Instagram"
                  href="https://www.instagram.com/aaushadhi_wellness/"
                  description="Follow us on Instagram for a visual journey into natural healing and organic remedies."
                  accentColor="#E1306C"
                  delay="320ms"
                />

  </div>

</section>
            

            
      
            

            {/* ═══════════════ Bottom Assurance ═══════════════ */}
            <section className="px-4 md:px-8 py-10" id="contact-assurance">
              <div className="max-w-3xl mx-auto">
                <div
                  className="rounded-3xl p-8 md:p-10 text-center"
                  style={{
                    background: "rgba(255,255,255,0.35)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Trust icons row */}
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {[
                      { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, tip: "Secure" },
                      { icon: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></>, tip: "Personal" },
                      { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, tip: "Timely" },
                    ].map((item) => (
                      <div
                        key={item.tip}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div className="w-11 h-11 rounded-full bg-olive/8 flex items-center justify-center">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {item.icon}
                          </svg>
                        </div>
                        <span className="text-[10px] font-semibold text-olive/60 uppercase tracking-wider">
                          {item.tip}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    className="text-olive font-bold text-lg md:text-xl mb-2"
                    style={playfair}
                  >
                    Your trust is our most valued herb.
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
                    We never share your information. Every message is read personally by our team,
                    and we treat your wellness concerns with the same care we put into our products.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
