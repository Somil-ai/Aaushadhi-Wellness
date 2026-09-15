import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiProduct, CartProduct } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailActions from "@/components/ProductDetailActions";
import FAQAccordion from "@/components/FAQAccordion";
import ProductGallery from "@/components/ProductGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── SEO Metadata ────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.seo?.metaTitle ?? `${product.productName} — Aaushadhi Wellness`,
    description:
      product.seo?.metaDescription ??
      `Discover the benefits of ${product.productName}: ${product.tagline}`,
  };
}

// ─── Helper: Build CartProduct from StrapiProduct ────────────
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

// ─── Section wrapper (only renders if children exist) ────────
function Section({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <h2
          className="text-xl md:text-2xl font-bold text-text-dark"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// ─── Icons ───────────────────────────────────────────────────
const LeafIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 1 8-1 3.5-3 5.5-5 7l-4 4z" />
    <path d="M10.7 20.7 5.3 15.3" />
  </svg>
);

const SparklesIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v5m4.5 1.5L21 8m-4.5 4.5L21 16m-9 5v-5m-4.5-1.5L3 16m4.5-4.5L3 8m9-5 1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
  </svg>
);

const BeakerIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" />
  </svg>
);

const ShieldIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const TableIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" />
  </svg>
);

const HeartIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ScaleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

const UserIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const AlertIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);

const QuestionIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
  </svg>
);

// ─── Main Page Component ─────────────────────────────────────
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discount = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100
  );

  const imageUrl = getStrapiImageUrl(product.mainImage);
  const cartProduct = toCartProduct(product);
  const categoryName = product.category?.name ?? "Wellness";

  const mainImageObj = { url: imageUrl, alt: product.productName };
  const galleryImagesArr = (product.galleryImages || []).map((img) => ({
    url: getStrapiImageUrl(img),
    alt: product.productName,
  }));

  // Check which optional sections have data
  const hasAyurvedicProfile = product.ayurvedicProfile &&
    (product.ayurvedicProfile.rasa || product.ayurvedicProfile.guna || product.ayurvedicProfile.virya || product.ayurvedicProfile.vipaka || product.ayurvedicProfile.doshaKarma);
  const hasUsageInfo = product.usageInfo &&
    (product.usageInfo.howToUse || product.usageInfo.servingMethod || product.usageInfo.dailyDosage || product.usageInfo.bestTimeToConsume || product.usageInfo.lifestylePairing);
  const hasBenefitsTable = product.benefitsTable && product.benefitsTable.length > 0;
  const hasUsageTable = product.usageTable && product.usageTable.length > 0;
  const hasFaqs = product.faqs && product.faqs.length > 0;
  const hasComparison = product.productComparison && product.productComparison.length > 0;
  const hasRelated = product.relatedProducts && product.relatedProducts.length > 0;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.productName,
    description: product.tagline,
    image: imageUrl !== "/products/placeholder.svg" ? imageUrl : undefined,
    brand: { "@type": "Brand", name: "Aaushadhi Wellness" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price.toString(),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-16">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-olive/80 hover:text-olive font-medium text-sm mb-8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Products
        </Link>

        {/* ═══════════════════════════════════════════════════
            SECTION 1: HERO — Image + Core Info + Add to Cart
            ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
          {/* Image Column */}
          <ProductGallery
            mainImage={mainImageObj}
            galleryImages={galleryImagesArr}
            discount={discount}
          />

          {/* Details Column */}
          <div className="flex flex-col">
            {/* Category badge */}
            <p className="text-olive text-xs font-bold tracking-[0.2em] uppercase mb-3">
              {categoryName}
            </p>

            {/* Product Name */}
            <h1
              className="text-3xl md:text-5xl font-bold text-text-dark leading-tight mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.productName}
            </h1>

            {/* Tagline */}
            <p className="text-text-muted text-base leading-relaxed mb-4 italic">
              {product.tagline}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-olive">
                ₹{product.price}
              </span>
              <span className="text-xl text-text-muted line-through">
                ₹{product.comparePrice}
              </span>
              <span className="text-text-muted text-sm font-medium ml-1">
                per 100g
              </span>
            </div>

            {/* Value Proposition */}
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              {product.valueProposition}
            </p>

            <div className="w-full h-px bg-olive/10 mb-6" />

            {/* Key Benefits */}
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-text-dark mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  Key Benefits
                </h3>
                <ul className="space-y-3 mb-8">
                  {product.keyBenefits.map((benefit) => (
                    <li key={benefit.id} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-text-muted text-base leading-relaxed">
                        {benefit.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add to Cart Actions */}
            <ProductDetailActions product={cartProduct} />

            {/* Trust badges */}
            <div className="mt-10 p-5 rounded-2xl bg-white/60 border border-olive/10">
              <div className="flex flex-col gap-3 text-sm text-text-muted">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>100% Organic & Authentically Sourced</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Secure checkout via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            REMAINING SECTIONS — Only render if data exists
            ═══════════════════════════════════════════════════ */}

        {/* ── Description ─────────────────────────────────── */}
        {product.description && (
          <Section title="About This Product" icon={LeafIcon}>
            <div className="p-6 rounded-2xl bg-white/50 border border-olive/8">
              {product.description.split("\n").map((paragraph, i) => (
                <p key={i} className="text-text-muted text-[15px] leading-[1.85] mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* ── Ayurvedic Profile ────────────────────────────── */}
        {hasAyurvedicProfile && (
          <Section title="Traditional Ayurvedic Profile" icon={SparklesIcon}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Rasa (Taste)", value: product.ayurvedicProfile!.rasa },
                { label: "Guna (Qualities)", value: product.ayurvedicProfile!.guna },
                { label: "Virya (Potency)", value: product.ayurvedicProfile!.virya },
                { label: "Vipaka (Post-Digestive)", value: product.ayurvedicProfile!.vipaka },
                { label: "Dosha Karma", value: product.ayurvedicProfile!.doshaKarma },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl bg-white/60 border border-olive/8 hover:border-olive/20 transition-colors"
                  >
                    <p className="text-[11px] uppercase tracking-[0.15em] text-olive/70 font-semibold mb-1.5">
                      {item.label}
                    </p>
                    <p className="text-text-dark text-sm font-medium leading-snug">
                      {item.value}
                    </p>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* ── Ingredients & Purity ─────────────────────────── */}
        {(product.ingredients || product.purityInformation) && (
          <Section title="Ingredients & Purity" icon={BeakerIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.ingredients && (
                <div className="p-5 rounded-2xl bg-white/50 border border-olive/8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Ingredients</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.ingredients}</p>
                </div>
              )}
              {product.purityInformation && (
                <div className="p-5 rounded-2xl bg-olive/5 border border-olive/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Purity Promise</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.purityInformation}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Usage & Dosage ───────────────────────────────── */}
        {hasUsageInfo && (
          <Section title="Usage & Dosage" icon={ClockIcon}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "How To Use", value: product.usageInfo!.howToUse, emoji: "🥄" },
                { label: "Serving Method", value: product.usageInfo!.servingMethod, emoji: "🍵" },
                { label: "Daily Dosage", value: product.usageInfo!.dailyDosage, emoji: "📏" },
                { label: "Best Time", value: product.usageInfo!.bestTimeToConsume, emoji: "⏰" },
                { label: "Lifestyle Pairing", value: product.usageInfo!.lifestylePairing, emoji: "🌿" },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl bg-white/60 border border-olive/8 flex gap-3"
                  >
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-olive/70 font-semibold mb-1">
                        {item.label}
                      </p>
                      <p className="text-text-dark text-sm leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* ── Benefits Table ───────────────────────────────── */}
        {hasBenefitsTable && (
          <Section title="Benefits Breakdown" icon={TableIcon}>
            <div className="overflow-x-auto rounded-2xl border border-olive/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-olive/8">
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Target Area</th>
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Mechanism</th>
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Expected Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {product.benefitsTable.map((row, i) => (
                    <tr
                      key={row.id}
                      className={i % 2 === 0 ? "bg-white/40" : "bg-white/70"}
                    >
                      <td className="px-5 py-3.5 text-text-dark font-medium">{row.targetArea}</td>
                      <td className="px-5 py-3.5 text-text-muted">{row.mechanism}</td>
                      <td className="px-5 py-3.5 text-text-muted">{row.expectedOutcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── Usage Table ──────────────────────────────────── */}
        {hasUsageTable && (
          <Section title="Dosage Guide" icon={TableIcon}>
            <div className="overflow-x-auto rounded-2xl border border-olive/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-olive/8">
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Dosage</th>
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Mixing Vehicle</th>
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Frequency</th>
                    <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-bold text-olive">Optimal Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {product.usageTable.map((row, i) => (
                    <tr
                      key={row.id}
                      className={i % 2 === 0 ? "bg-white/40" : "bg-white/70"}
                    >
                      <td className="px-5 py-3.5 text-text-dark font-medium">{row.dosage}</td>
                      <td className="px-5 py-3.5 text-text-muted">{row.mixingVehicle}</td>
                      <td className="px-5 py-3.5 text-text-muted">{row.frequency}</td>
                      <td className="px-5 py-3.5 text-text-muted">{row.optimalTiming}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── Why Customers Love It ────────────────────────── */}
        {product.whyCustomersLoveIt && (
          <Section title="Why Customers Love It" icon={HeartIcon}>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-olive/5 to-parchment/40 border border-olive/10 relative overflow-hidden">
              <div className="absolute top-4 left-5 text-olive/15 text-5xl leading-none" style={{ fontFamily: "var(--font-playfair)" }}>"</div>
              <p className="text-text-dark text-[15px] leading-[1.85] relative z-10 pl-6">
                {product.whyCustomersLoveIt}
              </p>
            </div>
          </Section>
        )}

        {/* ── Product Comparison ───────────────────────────── */}
        {hasComparison && (
          <Section title="How We Compare" icon={ScaleIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.productComparison.map((point) => {
                const isUs = point.Brand.toLowerCase().includes("aaushadhi");
                return (
                  <div
                    key={point.id}
                    className={`p-5 rounded-2xl border ${
                      isUs
                        ? "bg-olive/8 border-olive/20"
                        : "bg-white/40 border-olive/8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isUs && (
                        <span className="w-2 h-2 rounded-full bg-olive flex-shrink-0" />
                      )}
                      <h4 className={`text-sm font-bold ${isUs ? "text-olive" : "text-text-muted"}`}>
                        {point.Brand}
                      </h4>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {point.Description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Product Features & Highlights ─────────────────── */}
        {(product.productFeatures || product.productHighlights || product.herbalProfile) && (
          <Section title="Product Highlights" icon={SparklesIcon}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.productFeatures && (
                <div className="p-5 rounded-2xl bg-white/50 border border-olive/8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Features</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.productFeatures}</p>
                </div>
              )}
              {product.productHighlights && (
                <div className="p-5 rounded-2xl bg-white/50 border border-olive/8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Highlights</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.productHighlights}</p>
                </div>
              )}
              {product.herbalProfile && (
                <div className="p-5 rounded-2xl bg-white/50 border border-olive/8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Herbal Profile</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.herbalProfile}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Who Can Use It / Best For ─────────────────────── */}
        {(product.whoCanUseIt || product.bestFor) && (
          <Section title="Who Is It For" icon={UserIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.whoCanUseIt && (
                <div className="p-5 rounded-2xl bg-white/50 border border-olive/8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Suitable For</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.whoCanUseIt}</p>
                </div>
              )}
              {product.bestFor && (
                <div className="p-5 rounded-2xl bg-olive/5 border border-olive/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-olive mb-3">Best For</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.bestFor}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Safety & Precautions ──────────────────────────── */}
        {(product.safetyInformation || product.precautions) && (
          <Section title="Safety Information" icon={AlertIcon}>
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/50">
              {product.safetyInformation && (
                <div className="mb-3 last:mb-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">Safety</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.safetyInformation}</p>
                </div>
              )}
              {product.precautions && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">Precautions</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{product.precautions}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── FAQs ─────────────────────────────────────────── */}
        {hasFaqs && (
          <Section title="Frequently Asked Questions" icon={QuestionIcon}>
            <FAQAccordion faqs={product.faqs} />
          </Section>
        )}

        {/* ── Trust / Why Choose Us / CTA ───────────────────── */}
        {(product.trustBuildingText || product.whyChooseUs || product.ctaText) && (
          <section className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-olive/8 to-olive/3 border border-olive/12 text-center">
            {product.whyChooseUs && (
              <>
                <h3
                  className="text-xl font-bold text-text-dark mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Why Choose Aaushadhi Wellness
                </h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-2xl mx-auto mb-4">
                  {product.whyChooseUs}
                </p>
              </>
            )}
            {product.trustBuildingText && (
              <p className="text-olive/80 text-xs font-semibold uppercase tracking-widest mb-6">
                {product.trustBuildingText}
              </p>
            )}
            {product.ctaText && (
              <p className="text-text-dark text-base font-medium italic max-w-xl mx-auto">
                &ldquo;{product.ctaText}&rdquo;
              </p>
            )}
          </section>
        )}

        {/* ── Related Products ─────────────────────────────── */}
        {hasRelated && (
          <Section title="You May Also Like">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-olive/8 hover:border-olive/20 hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-parchment/40 flex-shrink-0">
                    <Image
                      src={getStrapiImageUrl(related.mainImage)}
                      alt={related.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-text-dark font-semibold text-sm group-hover:text-olive transition-colors">
                      {related.productName}
                    </h4>
                    <p className="text-olive font-bold text-sm mt-0.5">₹{related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}
