/**
 * Demo catalogue for the Maison Nord shop template. Products and prices are
 * fictional; photos come from Wikimedia Commons (see lib/photos.ts and /credits).
 */
import { photos, type Photo } from "./photos";

export type CategoryId = "kitchen" | "table" | "living" | "lighting" | "plants";

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  compareAt?: number;
  photo: Photo;
  rating: number;
  reviews: number;
  colors: { id: string; name: string; swatch: string }[];
  description: string;
  details: string[];
  maker: string;
  badge?: "New" | "Bestseller" | "Last pieces";
  stock: number;
}

export const categories: { id: CategoryId; name: string }[] = [
  { id: "kitchen", name: "Kitchen & coffee" },
  { id: "table", name: "Tableware" },
  { id: "living", name: "Living" },
  { id: "lighting", name: "Lighting" },
  { id: "plants", name: "Plants & pots" },
];

/* Swatches are product colours shown as data, not UI tokens. */
const clay = { id: "clay", name: "Clay", swatch: "oklch(0.62 0.09 45)" };
const ink = { id: "ink", name: "Ink", swatch: "oklch(0.25 0.02 260)" };
const sand = { id: "sand", name: "Sand", swatch: "oklch(0.86 0.04 85)" };
const sage = { id: "sage", name: "Sage", swatch: "oklch(0.72 0.05 150)" };
const brass = { id: "brass", name: "Brass", swatch: "oklch(0.74 0.11 85)" };
const steel = { id: "steel", name: "Steel", swatch: "oklch(0.8 0.01 250)" };
const oak = { id: "oak", name: "Oak", swatch: "oklch(0.7 0.08 70)" };

export const products: Product[] = [
  {
    id: "iron-teapot",
    name: "Cast-iron teapot",
    category: "kitchen",
    price: 64,
    photo: photos.teapot,
    rating: 4.8,
    reviews: 212,
    colors: [ink, clay],
    description:
      "A heavy cast-iron pot that keeps tea hot for an hour, with a removable steel infuser.",
    details: ["0.8 litre", "Enamelled interior", "Stainless infuser included", "Hand wash only"],
    maker: "Studio Kaji, Morioka",
    badge: "Bestseller",
    stock: 14,
  },
  {
    id: "morning-mug",
    name: "Morning mug",
    category: "table",
    price: 18,
    photo: photos.mug,
    rating: 4.7,
    reviews: 486,
    colors: [sand, sage, ink],
    description:
      "Our everyday stoneware mug: a thick rim, a thumb rest and a glaze that softens with use.",
    details: ["350 ml", "Stoneware", "Dishwasher and microwave safe"],
    maker: "Atelier Lune, Lyon",
    badge: "Bestseller",
    stock: 120,
  },
  {
    id: "brass-candlestick",
    name: "Brass candlestick",
    category: "lighting",
    price: 42,
    photo: photos.candle,
    rating: 4.9,
    reviews: 97,
    colors: [brass],
    description: "Solid turned brass that develops a warm patina. Fits standard dinner candles.",
    details: ["Height 18 cm", "Solid brass", "Felt base to protect tables"],
    maker: "Skultuna-inspired workshop, Sweden",
    stock: 9,
    badge: "Last pieces",
  },
  {
    id: "linen-cushions",
    name: "Linen cushion covers",
    category: "living",
    price: 36,
    compareAt: 45,
    photo: photos.cushion,
    rating: 4.6,
    reviews: 158,
    colors: [sand, sage, clay],
    description: "Stonewashed French linen covers with a hidden zip. Sold as a pair.",
    details: ["50 × 50 cm", "100% linen", "Machine wash at 40°", "Set of two covers"],
    maker: "Tissage du Nord, Lille",
    stock: 40,
  },
  {
    id: "french-press",
    name: "Glass French press",
    category: "kitchen",
    price: 39,
    photo: photos.frenchpress,
    rating: 4.7,
    reviews: 341,
    colors: [steel, ink],
    description: "Borosilicate glass and a four-layer steel filter for rich, clean coffee.",
    details: ["1 litre / 8 cups", "Borosilicate glass", "Dishwasher safe"],
    maker: "Maison Nord",
    stock: 32,
  },
  {
    id: "white-orchid",
    name: "White orchid",
    category: "plants",
    price: 32,
    photo: photos.plant,
    rating: 4.5,
    reviews: 74,
    colors: [sand],
    description:
      "A long-flowering Phalaenopsis that blooms for months with a weekly splash of water.",
    details: ["Height 50–60 cm", "Delivered in a nursery pot", "Bright, indirect light"],
    maker: "Serres de Loire",
    badge: "New",
    stock: 18,
  },
  {
    id: "oak-board",
    name: "Oak chopping board",
    category: "kitchen",
    price: 48,
    photo: photos.board,
    rating: 4.8,
    reviews: 129,
    colors: [oak],
    description: "End-grain oak that is kind to knives, finished with food-safe oil.",
    details: ["40 × 28 × 3 cm", "FSC-certified oak", "Oil monthly"],
    maker: "Menuiserie Bernard, Jura",
    stock: 21,
  },
  {
    id: "steel-kettle",
    name: "Stovetop kettle",
    category: "kitchen",
    price: 58,
    photo: photos.kettle,
    rating: 4.6,
    reviews: 88,
    colors: [steel],
    description: "A classic brushed-steel kettle for gas, electric and induction hobs.",
    details: ["1.8 litre", "Induction compatible", "Heat-proof handle"],
    maker: "Maison Nord",
    stock: 25,
  },
  {
    id: "paper-lampshade",
    name: "Paper lampshade",
    category: "lighting",
    price: 54,
    photo: photos.lamp,
    rating: 4.7,
    reviews: 63,
    colors: [sand],
    description: "Pleated rice-paper shade that turns any bulb into soft, even light.",
    details: ["Ø 45 cm", "Rice paper on a steel frame", "E27 fitting, cord not included"],
    maker: "Atelier Washi, Kyoto",
    badge: "New",
    stock: 12,
  },
  {
    id: "clay-planters",
    name: "Hand-thrown clay pots",
    category: "plants",
    price: 29,
    photo: photos.pottery,
    rating: 4.8,
    reviews: 104,
    colors: [clay, sand],
    description: "Unglazed terracotta that lets roots breathe. Every pot is slightly different.",
    details: ["Set of three: 10, 14 and 18 cm", "Drainage holes", "Frost-resistant"],
    maker: "Potters' cooperative, Nsukka",
    stock: 30,
  },
];

export const makers = {
  photo: photos.basket,
  title: "Made by hand, bought direct",
  body: "We work with 23 small workshops across three continents and pay them upfront, at the price they set. Every product page names its maker.",
};

export const CURRENCY = "EUR";
export const FREE_SHIPPING = 80;
export const getProduct = (id: string) => products.find((p) => p.id === id);
