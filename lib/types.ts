// ─── Strapi Media ────────────────────────────────────────────
export type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
};

export type StrapiImage = {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
};

// ─── Category ────────────────────────────────────────────────
export type StrapiCategory = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  image: StrapiImage | null;
};

// ─── Components ──────────────────────────────────────────────

export type Benefit = {
  id: number;
  title: string;
};

export type AyurvedicProfile = {
  id: number;
  rasa: string | null;
  guna: string | null;
  virya: string | null;
  vipaka: string | null;
  doshaKarma: string | null;
};

export type UsageInfo = {
  id: number;
  howToUse: string | null;
  servingMethod: string | null;
  dailyDosage: string | null;
  bestTimeToConsume: string | null;
  lifestylePairing: string | null;
};

export type BenefitRow = {
  id: number;
  targetArea: string;
  mechanism: string;
  expectedOutcome: string;
};

export type UsageRow = {
  id: number;
  dosage: string | null;
  mixingVehicle: string | null;
  frequency: string | null;
  optimalTiming: string | null;
};

// Strapi v5 rich text block format
export type RichTextBlock = {
  type: string;
  children: { type: string; text: string; bold?: boolean; italic?: boolean }[];
};

export type FAQ = {
  id: number;
  question: string;
  answer: RichTextBlock[];
};

export type ComparisonPoint = {
  id: number;
  Brand: string;
  Description: string;
};

export type SEO = {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  seoProductDescription: string | null;
  keywords: string | null;
  productTags: string | null;
  searchKeywords: string | null;
};

// ─── Product ─────────────────────────────────────────────────
export type StrapiProduct = {
  id: number;
  documentId: string;

  // Core identity
  productName: string;
  slug: string;
  tagline: string;
  valueProposition: string;
  category: StrapiCategory;

  // Media
  mainImage: StrapiImage | null;
  galleryImages: StrapiImage[] | null;

  // Pricing
  price: number;
  comparePrice: number;
  featured: boolean | null;

  // Main content
  description: string;
  keyBenefits: Benefit[];
  ingredients: string | null;
  whyCustomersLoveIt: string | null;
  whoCanUseIt: string | null;
  bestFor: string | null;
  purityInformation: string | null;
  productFeatures: string | null;
  productHighlights: string | null;
  herbalProfile: string | null;

  // Ayurvedic
  ayurvedicProfile: AyurvedicProfile | null;

  // Usage
  usageInfo: UsageInfo | null;

  // Tables
  benefitsTable: BenefitRow[];
  usageTable: UsageRow[];

  // FAQs
  faqs: FAQ[];

  // Safety
  safetyInformation: string | null;
  precautions: string | null;

  // Trust & Marketing
  ctaText: string | null;
  trustBuildingText: string | null;
  whyChooseUs: string | null;
  productComparison: ComparisonPoint[];

  // SEO
  seo: SEO | null;

  // Relations
  relatedProducts: StrapiProduct[];
};

// ─── Cart (lightweight subset for cart context) ──────────────
export type CartProduct = {
  id: number;
  productName: string;
  slug: string;
  price: number;
  comparePrice: number;
  mainImageUrl: string; // resolved URL or placeholder
};
