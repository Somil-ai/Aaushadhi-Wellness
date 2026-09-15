import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { getProducts, getCategories } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Our Products — Aaushadhi Wellness",
  description:
    "Browse our complete collection of certified organic Ayurvedic herbal powders. 100% natural, lab-tested remedies for holistic wellness.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const initialSearch = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Page wrapper with cream bg */}
      <div className="min-h-screen bg-cream">
        <Navbar />

        <main className="overflow-hidden">

  {/* Hero */}

  <section
  className="relative overflow-hidden py-20 lg:py-28"
  style={{
    backgroundImage: "url('/products/bg.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-[#F6EBD6]/40" />

  {/* Blur Background */}
  <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-white/40 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#ECD7B9]/60 blur-[120px]" />

  {/* Decorative Leaves */}
  <div className="pointer-events-none absolute left-2 top-6 hidden select-none text-[140px] opacity-20 lg:block">
    🍃
  </div>

  <div className="pointer-events-none absolute right-2 top-6 hidden select-none text-[140px] opacity-20 lg:block">
    🍃
  </div>

  <div className="relative mx-auto max-w-7xl px-6 text-center">


    <h1
      className="mt-6 text-4xl font-bold text-[#2F2A22] sm:text-5xl lg:text-6xl"
      style={{
        fontFamily: "var(--font-playfair)",
      }}
    >
      Our Products
    </h1>

    <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#5F5A53] sm:text-lg lg:text-xl">
      Handcrafted Ayurvedic herbal powders, sourced from nature and
      prepared with traditional wisdom to support your everyday wellness.
    </p>

  </div>
</section>

  <ProductGrid
      products={products}
      categories={categories.map((c)=>({
        name:c.name,
        slug:c.slug,
      }))}
      initialSearch={initialSearch}
  />

</main>

        <Footer />
      </div>
    </>
  );
}
