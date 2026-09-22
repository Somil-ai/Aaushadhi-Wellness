import type { StrapiProduct, StrapiCategory, StrapiReview, ReviewStats } from "./types";

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

// ─── Reviews ────────────────────────────────────────────────

/**
 * Fetch approved reviews for a product, newest first.
 * Pending/rejected reviews are never returned here — this is the only
 * read path the product page uses, so moderation is enforced by construction
 * rather than relying on a query param a client could tamper with.
 */
export async function getProductReviews(
  productId: number
): Promise<StrapiReview[]> {
  const response = await fetchStrapi<StrapiListResponse<StrapiReview>>(
    "/api/reviews",
    {
      "filters[product][id][$eq]": String(productId),
      "filters[reviewStatus][$eq]": "approved",
      "sort": "createdAt:desc",
      "fields[0]": "customerName",
      "fields[1]": "rating",
      "fields[2]": "comment",
      "fields[3]": "reviewStatus",
      "fields[4]": "createdAt",
      "pagination[pageSize]": "100",
    }
  );
  return response.data;
}

/** Compute average rating + count from a list of approved reviews. */
export function computeReviewStats(reviews: StrapiReview[]): ReviewStats {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/**
 * Check whether a customer has already reviewed this product
 * (regardless of moderation status) — used to block duplicate submissions.
 */
export async function hasCustomerReviewed(
  productId: number,
  customerEmail: string
): Promise<boolean> {
  const response = await fetchStrapi<StrapiListResponse<{ id: number }>>(
    "/api/reviews",
    {
      "filters[product][id][$eq]": String(productId),
      "filters[customerEmail][$eq]": customerEmail,
      "fields[0]": "id",
      "pagination[pageSize]": "1",
    }
  );
  return response.data.length > 0;
}

/**
 * Create a new review in Strapi. Always forced to "pending" status here —
 * the API route calling this never lets the client set status directly.
 */
export async function createReview(input: {
  productId: number;
  customerEmail: string;
  customerName: string;
  rating: number;
  comment: string;
}): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${STRAPI_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        product: input.productId,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        rating: input.rating,
        comment: input.comment,
        reviewStatus: "pending",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Strapi review creation failed:", text);
    return { success: false, error: "Failed to submit review" };
  }

  return { success: true };
}
