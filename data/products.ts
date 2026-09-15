export type Product = {
  id: number;
  name: string;
  category: string;
  benefit: string;
  badge: string;
  image: string;

  price: number;
  oldPrice?: number;
  rating: number;
  slug: string;
  bestSeller: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Ashwagandha Powder",
    category: "Adaptogenic Herb",
    benefit: "Stress Relief & Vitality",
    badge: "100% ORGANIC",
    image: "/products/ashwagandha.png",
    price: 499,
    rating: 4.5,
    slug: "ashwagandha-powder",
    bestSeller: true,
  },
  {
    id: 2,
    name: "Triphala Ghrutam",
    category: "Ayurvedic Formula",
    benefit: "Digestion & Detox",
    badge: "TRADITIONAL",
    image: "/products/triphala.png",
    price: 349,
    rating: 4.2,
    slug: "triphala-ghrutam",
    bestSeller: false,
  },
  {
    id: 3,
    name: "Organic Turmeric Root",
    category: "Anti-inflammatory",
    benefit: "Joint Health & Immunity",
    badge: "NATURAL",
    image: "/products/turmeric.png",
    price: 299,
    rating: 4.6,
    slug: "organic-turmeric-root",
    bestSeller: true,
  },
  {
    id: 4,
    name: "Amla Tablets",
    category: "Vitamin C Rich",
    benefit: "Immunity & Hair Health",
    badge: "AYURVEDIC",
    image: "/products/amla.png",
    price: 259,
    rating: 4.1,
    slug: "amla-tablets",
    bestSeller: false,
  },
  {
    id: 5,
    name: "Dried Neem & Tulsi",
    category: "Herbal Blend",
    benefit: "Skin Purification",
    badge: "HERBAL",
    image: "/products/neem-tulsi.png",
    price: 199,
    rating: 4.0,
    slug: "dried-neem-tulsi",
    bestSeller: false,
  },
  {
    id: 6,
    name: "Brahmi Leaf Powder",
    category: "Brain Tonic",
    benefit: "Memory & Focus",
    badge: "PURE",
    image: "/products/brahmi.png",
    price: 379,
    rating: 4.4,
    slug: "brahmi-leaf-powder",
    bestSeller: true,
  },
];
