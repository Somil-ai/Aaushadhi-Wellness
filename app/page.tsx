import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/strapi";
import type { ComponentType } from "react";
import BrandStory from "@/components/BrandStory";
import Seasonal from "@/components/Seasonal";
import BlogAndUSP from "@/components/Blog&USP";

type Products = Awaited<ReturnType<typeof getProducts>>;


export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 6);

  return (
    <>
      {/* Full-page dreamy gradient background — everything sits on this */}
      <div
        className="relative min-h-screen overflow-clip"
        style={{
          background:
            "linear-gradient(170deg, #EDE3CA 0%, #F5EAD6 15%, #F2D4C0 35%, #ECC8B8 48%, #E0C8C4 55%, #D4CEDB 65%, #C8D6E2 78%, #D0DBE6 90%, #D6DDE8 100%)",
        }}
      >
        {/* Decorative leaf — top right */}
        <div className="absolute -top-4 -right-4 w-72 md:w-96 h-72 md:h-96 opacity-25 pointer-events-none select-none z-0">
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M380 30C380 30 220 20 130 140C60 240 100 350 210 340C320 330 400 180 380 30Z"
              fill="#7A8C3A"
              opacity="0.6"
            />
            <path
              d="M340 60C290 150 240 230 190 320"
              stroke="#5C6B2E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M310 90C270 150 240 210 210 270"
              stroke="#5C6B2E"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Second leaf overlapping */}
            <path
              d="M350 10C350 10 250 50 200 130C160 200 190 280 260 260C330 240 370 140 350 10Z"
              fill="#5C6B2E"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Decorative leaf — bottom left (subtle) */}
        <div className="absolute bottom-20 -left-8 w-40 h-40 opacity-15 pointer-events-none select-none z-0">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 180C20 180 120 170 160 100C190 40 140 0 80 20C20 40 -10 120 20 180Z"
              fill="#7A8C3A"
            />
          </svg>
        </div>

        {/* Sparkle / bokeh dots */}
        <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-white/50 pointer-events-none z-0" />
        <div className="absolute top-[25%] right-[18%] w-1 h-1 rounded-full bg-white/40 pointer-events-none z-0" />
        <div className="absolute top-[55%] left-[25%] w-2 h-2 rounded-full bg-white/35 pointer-events-none z-0" />
        <div className="absolute top-[65%] right-[30%] w-1.5 h-1.5 rounded-full bg-white/45 pointer-events-none z-0" />
        <div className="absolute top-[40%] left-[55%] w-1 h-1 rounded-full bg-white/40 pointer-events-none z-0" />
        <div className="absolute top-[75%] left-[45%] w-1 h-1 rounded-full bg-white/30 pointer-events-none z-0" />
        <div className="absolute top-[80%] right-[15%] w-1.5 h-1.5 rounded-full bg-white/35 pointer-events-none z-0" />

        {/* Page content */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <ProductCarousel products={featured} />
            <BrandStory/>
            <Seasonal products={featured} />
            <BlogAndUSP />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
