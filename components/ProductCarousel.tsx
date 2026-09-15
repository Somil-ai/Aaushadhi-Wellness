"use client";

import { useState } from "react";
import type { StrapiProduct } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type Props = {
  products: StrapiProduct[];
};

export default function ProductCarousel({ products }: Props) {
  const [active, setActive] = useState(1);
  const [animating, setAnimating] = useState(false);

  const navigate = (next: number) => {
    if (animating) return;

    setAnimating(true);
    setActive(next);

    setTimeout(() => setAnimating(false), 500);
  };

  const prev = () =>
    navigate(active === 0 ? products.length - 1 : active - 1);

  const next = () =>
    navigate(active === products.length - 1 ? 0 : active + 1);

  // Swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;

    if (distance > minSwipeDistance) next();
    if (distance < -minSwipeDistance) prev();
  };

  return (
    <section
      className="relative overflow-hidden py-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/products/bg.png')",
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#E7D8B5]/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#E8DCC6]/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border border-[#D7C6A5] bg-white px-5 py-2 text-sm font-semibold tracking-[4px] text-[#556B2F] shadow-sm">
            OUR BEST SELLERS
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-[#000000] font-playfair">
            Nature's Finest Collection
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#6B665C]">
            Carefully selected Ayurvedic wellness products crafted from
            authentic herbs and traditional formulations to help you live a
            healthier and more balanced life.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-12">
          <div className="relative h-[520px] flex items-center">

            {/* Left arrow */}
            <button
              onClick={prev}
              aria-label="Previous products"
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-20
                w-11 h-11 rounded-full
                bg-white/50 backdrop-blur-md
                border border-white/40
                flex items-center justify-center
                shadow-md cursor-pointer
                hover:bg-white/70 transition-all duration-200
                text-text-dark
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Cards viewport */}
            <div
              className="overflow-hidden px-16 w-full touch-pan-y"
              onWheel={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex items-end gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(calc(50% - ${active * 294 + 160}px))`,
                }}
              >
                {products.map((product, index) => {
                  const center = index === active;

                  const adjacent =
                    index === (active - 1 + products.length) % products.length ||
                    index === (active + 1) % products.length;

                  return (
                    <div
                      key={product.id}
                      className={`
                        flex-shrink-0
                        transition-all duration-500
                        ${
                          center
                            ? "scale-100 opacity-100 w-[320px]"
                            : adjacent
                            ? "scale-90 opacity-75 w-[270px]"
                            : "scale-75 opacity-0 w-[270px] pointer-events-none"
                        }
                      `}
                    >
                      <ProductCard
                        product={product}
                        featured={center}
                        priority={index <= 2}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={next}
              aria-label="Next products"
              className="
                absolute right-0 top-1/2 -translate-y-1/2 z-20
                w-11 h-11 rounded-full
                bg-white/50 backdrop-blur-md
                border border-white/40
                flex items-center justify-center
                shadow-md cursor-pointer
                hover:bg-white/70 transition-all duration-200
                text-text-dark
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`
                transition-all h-2 rounded-full
                ${i === active ? "w-6 bg-olive" : "w-2 bg-olive/30"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}