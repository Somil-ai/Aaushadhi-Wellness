import Image from "next/image";
import Link from "next/link";
import type { StrapiProduct } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/strapi";

type Props = {
  product: StrapiProduct;
  featured?: boolean;
  priority?: boolean;
};

export default function ProductCard({
  product,
  featured = false,
  priority = false,
}: Props) {
  const imageUrl = getStrapiImageUrl(product.mainImage);
  const categoryName = product.category?.name ?? "Wellness";
  const firstBenefit = product.keyBenefits?.[0]?.title ?? product.tagline;

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] flex flex-col w-full flex-shrink-0 transition-all duration-500 ease-out
        ${
          featured
            ? "scale-100 opacity-100"
            : "scale-[0.92] opacity-70"
        }
      `}
      style={{
        background: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",

        border: "1px solid rgba(255,255,255,0.55)",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.25)",
      }}
    >
      {/* Product image */}

      <div
        className="relative aspect-square overflow-hidden rounded-[22px] m-4 bg-parchment/40"
      >
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          quality={80}
          sizes="(max-width:768px)100vw,33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />

      </div>

      {/* Content */}

      <div
        className="px-5 pb-5 pt-2 flex flex-col flex-1"
      >
        {/* Category */}

        <p
          className="text-[11px] uppercase tracking-[0.18em] text-olive/75 font-medium mb-2"
        >
          {categoryName}
        </p>

        {/* Name */}

        <h3
          className={`text-text-dark font-bold leading-tight ${
              featured
                ? "text-[22px]"
                : "text-[18px]"
            }`}
          style={{
            fontFamily:"var(--font-playfair)",
          }}
        >
          {product.productName}
        </h3>

        {/* Benefit */}

        <p
          className="mt-3 text-text-muted text-sm leading-relaxed"
        >
          {firstBenefit}
        </p>

        {/* CTA */}

        <div className="mt-auto pt-5">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-olive text-sm font-semibold transition-all duration-300 group-hover:gap-3 after:absolute after:inset-0"
          >
            Explore

            <span
              className="text-lg leading-none"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}