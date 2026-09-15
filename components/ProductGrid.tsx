"use client";

import { useMemo, useState } from "react";
import type { StrapiProduct } from "@/lib/types";
import CatalogCard from "@/components/CatalogCard";

type Props = {
  products: StrapiProduct[];
  categories: {
    name: string;
    slug: string;
  }[];
  initialSearch?: string;
};

const BATCH_SIZE = 8;

export default function ProductGrid({
  products,
  initialSearch = "",
}: Props) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(q) ||
          product.tagline.toLowerCase().includes(q) ||
          (product.category?.name ?? "")
            .toLowerCase()
            .includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "name":
        filtered.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () =>
    setVisibleCount((prev) =>
      Math.min(prev + BATCH_SIZE, filteredProducts.length)
    );

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
    setVisibleCount(BATCH_SIZE);
  };

  return (<section
  className="relative overflow-hidden py-12 lg:py-20"
  style={{
    backgroundImage: "url('/products/bg.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
  }}
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-[#F6EBD6]/40" />

  <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-white/40 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#ECD7B9]/60 blur-[120px]" />

  {/* Decorative Leaves */}
  <div className="pointer-events-none absolute left-2 top-6 hidden select-none text-[140px] opacity-20 lg:block">
    🍃
  </div>

  <div className="pointer-events-none absolute right-2 top-6 hidden select-none text-[140px] opacity-20 lg:block">
    🍃
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Search */}

    <div className="mx-auto mb-8 max-w-2xl">
      <div className="relative">

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search herbal products..."
          className="
            h-14
            md:h-16
            w-full
            rounded-full
            border
            border-[#D7C6A5]
            bg-white
            pl-14
            pr-5
            text-sm
            md:text-base
            text-[#2F2A22]
            shadow-lg
            outline-none
            transition-all
            focus:border-[#556B2F]
            focus:ring-2
            focus:ring-[#556B2F]/20
          "
        />

        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#556B2F]"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

      </div>
    </div>

    {/* Sort */}

    <div className="mb-10 flex items-center justify-end border-b border-[#D9C9AF] pb-5">

      <div className="relative">

        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-2 rounded-full border border-[#D9C9AF] bg-white px-5 py-2.5 text-sm font-semibold text-[#2F2A22] shadow-sm transition hover:border-[#556B2F]"
        >
          Sort By
          <span className="text-xs">▼</span>
        </button>

        {showSortMenu && (

          <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

            <button
              onClick={() => {
                setSortBy("default");
                setShowSortMenu(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F6EBD6]"
            >
              Default
            </button>

            <button
              onClick={() => {
                setSortBy("price-low");
                setShowSortMenu(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F6EBD6]"
            >
              Price: Low to High
            </button>

            <button
              onClick={() => {
                setSortBy("price-high");
                setShowSortMenu(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F6EBD6]"
            >
              Price: High to Low
            </button>

            <button
              onClick={() => {
                setSortBy("name");
                setShowSortMenu(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F6EBD6]"
            >
              Name A–Z
            </button>

          </div>

        )}

      </div>

    </div>
        {/* ================= Products ================= */}

    {filteredProducts.length > 0 ? (
      <>

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-3
            gap-3
            sm:gap-5
            lg:gap-8
            items-stretch
          "
        >
          {visibleProducts.map((product, idx) => (
            <div
              key={product.id}
              className="
                h-full
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <CatalogCard
                product={product}
                priority={idx < 6}
              />
            </div>
          ))}
        </div>

        {/* ================= Load More ================= */}

        {hasMore && (
          <div className="mt-12 flex justify-center">

            <button
              onClick={loadMore}
              className="
                rounded-full
                border
                border-[#556B2F]
                bg-white
                px-8
                py-3
                text-sm
                font-semibold
                tracking-[2px]
                text-[#556B2F]
                shadow-md
                transition-all
                duration-300
                hover:bg-[#556B2F]
                hover:text-white
              "
            >
              LOAD MORE
            </button>

          </div>
        )}

        
          <div className="h-px flex-1 bg-[#D8C6A5]" />

        
              </>
    ) : (
      <div className="py-20 text-center lg:py-28">

        <h2
          className="text-3xl font-bold text-[#2F2A22] lg:text-4xl"
          style={{
            fontFamily: "var(--font-playfair)",
          }}
        >
          No Products Found
        </h2>

        <p className="mt-5 text-base text-[#6B665C] lg:text-lg">
          Try searching with another keyword.
        </p>

      </div>
    )}

  </div>

</section>
  );
}