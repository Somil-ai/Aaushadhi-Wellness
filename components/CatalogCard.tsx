"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiProduct, CartProduct } from "@/lib/types";

type Props = {
  product: StrapiProduct;
  priority?: boolean;
};

function toCartProduct(product: StrapiProduct): CartProduct {
  return {
    id: product.id,
    productName: product.productName,
    slug: product.slug,
    price: product.price,
    comparePrice: product.comparePrice,
    mainImageUrl: getStrapiImageUrl(product.mainImage),
  };
}

export default function CatalogCard({ product, priority = false }: Props) {
  const { addToCart, updateQuantity, getQuantity } = useCart();
  const router = useRouter();
  const qty = getQuantity(product.id);

  const discount = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100
  );

  const imageUrl = getStrapiImageUrl(product.mainImage);
  const categoryName = product.category?.name ?? "Wellness";
  const benefits = product.keyBenefits ?? [];

  return (
    <article
      className="
        group relative rounded-xl md:rounded-2xl overflow-hidden flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        bg-white/80
      "
      style={{
        border: "1px solid rgba(92,107,46,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-parchment/40 block">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={80}
          priority={priority}
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider bg-olive/90 z-10">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="px-2.5 py-2.5 md:px-4 md:py-4 flex flex-col gap-1 md:gap-1.5 flex-1">
        {/* Category */}
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.18em] text-olive/70 font-medium">
          {categoryName}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="hover:text-olive transition-colors duration-200">
          <h3
            className="text-text-dark font-bold text-[12px] md:text-[15px] leading-snug hover:text-olive transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {product.productName}
          </h3>
        </Link>

        {/* Benefits (show first 2) — hidden on mobile for compact cards */}
        {benefits.length > 0 && (
          <ul className="mt-1 space-y-0.5 hidden md:block">
            {benefits.slice(0, 2).map((benefit) => (
              <li
                key={benefit.id}
                className="text-text-muted text-[12px] leading-relaxed flex items-start gap-1.5"
              >
                <span className="text-olive/60 mt-0.5 text-[10px]">●</span>
                {benefit.title}
              </li>
            ))}
          </ul>
        )}

        {/* Tagline fallback if no benefits — hidden on mobile */}
        {benefits.length === 0 && (
          <p className="mt-1 text-text-muted text-[12px] leading-relaxed line-clamp-2 hidden md:block">
            {product.tagline}
          </p>
        )}

        {/* Price row with "per 100g" */}
        <div className="mt-auto pt-2 md:pt-3 flex items-baseline gap-1 md:gap-2 flex-wrap">
          <span className="text-olive font-bold text-sm md:text-lg">
            ₹{product.price}
          </span>
          <span className="text-text-muted text-xs md:text-sm line-through">
            ₹{product.comparePrice}
          </span>
          <span className="text-text-muted text-[9px] md:text-[11px] hidden sm:inline">per 100g</span>
        </div>

        {/* Add to Cart / Quantity controls */}
        {qty === 0 ? (
          <div className="mt-1.5 md:mt-2 flex flex-col sm:flex-row gap-1.5 md:gap-2">
            <button
              type="button"
              onClick={() => addToCart(toCartProduct(product))}
              className="
                flex-1 py-1.5 md:py-2.5 rounded-full text-[9px] md:text-[11px] font-semibold uppercase tracking-wider
                bg-olive text-white
                hover:bg-olive-light
                active:scale-[0.97]
                transition-all duration-200
                cursor-pointer
                shadow-sm
              "
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(toCartProduct(product));
                router.push("/checkout");
              }}
              className="
                flex-1 py-1.5 md:py-2.5 rounded-full text-[9px] md:text-[11px] font-semibold uppercase tracking-wider
                bg-earth text-white
                hover:bg-earth/90
                active:scale-[0.97]
                transition-all duration-200
                cursor-pointer
                shadow-sm
              "
            >
              Buy Now
            </button>
          </div>
        ) : (
          <div className="mt-1.5 md:mt-2 space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between rounded-full border border-olive/20 overflow-hidden">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="px-3 md:px-4 py-1.5 md:py-2 text-olive font-bold text-base md:text-lg hover:bg-olive/10 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-text-dark font-semibold text-xs md:text-sm">
                {qty} × 100g
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="px-3 md:px-4 py-1.5 md:py-2 text-olive font-bold text-base md:text-lg hover:bg-olive/10 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="
                w-full py-1.5 md:py-2.5 rounded-full text-[9px] md:text-[11px] font-semibold uppercase tracking-wider
                bg-earth text-white
                hover:bg-earth/90
                active:scale-[0.97]
                transition-all duration-200
                cursor-pointer
                shadow-sm
              "
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
