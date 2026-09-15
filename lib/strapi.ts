import type { StrapiProduct, StrapiCategory } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

// ─── Generic fetch helper ────────────────────────────────────
async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(path, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
  }

  const isDev = process.env.NODE_ENV === "development";

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }), // Bypass cache in dev, ISR in prod
    });

    if (!res.ok) {
      console.warn(`[fetchStrapi] Failed: ${res.status} ${res.statusText} at ${path}`);
      return { data: [], meta: { pagination: { total: 0 } } } as unknown as T;
    }

    return await res.json();
  } catch (error) {
    console.error(`[fetchStrapi] Unreachable backend at ${path}:`, error);
    // Return empty payload to prevent Next.js from crashing
    return { data: [], meta: { pagination: { total: 0 } } } as unknown as T;
  }
}

// ─── Products ────────────────────────────────────────────────

type StrapiListResponse<T> = {
  data: T[];
  meta: {
    pagination: { page: number; pageSize: number; pageCount: number; total: number };
  };
};

type StrapiSingleResponse<T> = {
  data: T;
};

/**
 * Fetch all products with fields needed for the grid card.
 * Populates category, mainImage, and keyBenefits.
 */
export async function getProducts(): Promise<StrapiProduct[]> {
  const response = await fetchStrapi<StrapiListResponse<StrapiProduct>>(
    "/api/products",
    {
      "populate[category]": "true",
      "populate[mainImage]": "true",
      "populate[keyBenefits]": "true",
      "sort": "productName:asc",
      "pagination[pageSize]": "100",
    }
  );
  return response.data;
}

/**
 * Fetch a single product by slug with ALL components populated.
 */
export async function getProductBySlug(
  slug: string
): Promise<StrapiProduct | null> {
  const response = await fetchStrapi<StrapiListResponse<StrapiProduct>>(
    "/api/products",
    {
      "filters[slug][$eq]": slug,
      // Deep populate all components
      "populate[category]": "true",
      "populate[mainImage]": "true",
      "populate[galleryImages]": "true",
      "populate[keyBenefits]": "true",
      "populate[ayurvedicProfile]": "true",
      "populate[usageInfo]": "true",
      "populate[benefitsTable]": "true",
      "populate[usageTable]": "true",
      "populate[faqs]": "true",
      "populate[productComparison]": "true",
      "populate[seo]": "true",
      "populate[relatedProducts][populate][0]": "mainImage",
      "populate[relatedProducts][populate][1]": "category",
      "populate[relatedProducts][populate][2]": "keyBenefits",
    }
  );

  return response.data[0] ?? null;
}

/**
 * Get all product slugs for static generation.
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const response = await fetchStrapi<StrapiListResponse<{ slug: string }>>(
    "/api/products",
    {
      "fields[0]": "slug",
      "pagination[pageSize]": "100",
    }
  );
  return response.data.map((p) => p.slug);
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(): Promise<StrapiCategory[]> {
  const response = await fetchStrapi<StrapiListResponse<StrapiCategory>>(
    "/api/categories",
    {
      "populate": "*",
      "sort": "name:asc",
    }
  );
  return response.data;
}

// ─── Image URL helper ────────────────────────────────────────

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export function getStrapiImageUrl(
  image: { url: string } | null | undefined
): string {
  if (!image?.url) return PLACEHOLDER_IMAGE;
  // If the URL is already absolute, return as-is
  if (image.url.startsWith("http")) return image.url;
  // Otherwise prepend the Strapi base URL, avoiding double slashes
  const baseUrl = STRAPI_URL.endsWith("/") ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
  const imagePath = image.url.startsWith("/") ? image.url : `/${image.url}`;
  return `${baseUrl}${imagePath}`;
}
