export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Rugs" | "Ceramics" | "Beauty" | "Lighting" | "Textiles";
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  description: string;
}

const photo = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;

const seed: Array<Omit<Product, "id" | "description">> = [
  {
    name: "Handwoven Berber rug, 160 × 230 cm",
    brand: "Atlas Loom",
    category: "Rugs",
    price: 420,
    compareAt: 520,
    rating: 4.8,
    reviews: 88,
    stock: 4,
    image: photo("photo-1600166898405-da9535204843"),
  },
  {
    name: "Ceramic tagine, hand painted",
    brand: "Safi Clay",
    category: "Ceramics",
    price: 38,
    rating: 4.6,
    reviews: 214,
    stock: 30,
    image: photo("photo-1590502593747-42a996133562"),
  },
  {
    name: "Organic argan oil, 100 ml",
    brand: "Souss",
    category: "Beauty",
    price: 19,
    rating: 4.9,
    reviews: 1320,
    stock: 120,
    image: photo("photo-1608571423902-eed4a5ad8108"),
  },
  {
    name: "Brass pendant lamp",
    brand: "Medina Light",
    category: "Lighting",
    price: 145,
    compareAt: 169,
    rating: 4.5,
    reviews: 61,
    stock: 8,
    image: photo("photo-1513506003901-1e6a229e2d15"),
  },
  {
    name: "Cotton throw blanket",
    brand: "Tissage",
    category: "Textiles",
    price: 64,
    rating: 4.7,
    reviews: 143,
    stock: 0,
    image: photo("photo-1580301762395-21ce84d00bc6"),
  },
  {
    name: "Zellige coasters (set of 4)",
    brand: "Fès Tiles",
    category: "Ceramics",
    price: 24,
    rating: 4.3,
    reviews: 57,
    stock: 45,
    image: photo("photo-1602143407151-7111542de6e8"),
  },
  {
    name: "Kilim cushion cover",
    brand: "Atlas Loom",
    category: "Textiles",
    price: 42,
    rating: 4.4,
    reviews: 99,
    stock: 22,
    image: photo("photo-1584100936595-c0654b55a2e2"),
  },
  {
    name: "Rhassoul clay mask",
    brand: "Souss",
    category: "Beauty",
    price: 16,
    rating: 4.2,
    reviews: 310,
    stock: 80,
    image: photo("photo-1556228720-195a672e8a03"),
  },
  {
    name: "Pierced metal lantern",
    brand: "Medina Light",
    category: "Lighting",
    price: 89,
    rating: 4.8,
    reviews: 76,
    stock: 12,
    image: photo("photo-1507473885765-e6ed057f782c"),
  },
  {
    name: "Beni Ourain runner",
    brand: "Atlas Loom",
    category: "Rugs",
    price: 260,
    rating: 4.9,
    reviews: 35,
    stock: 3,
    image: photo("photo-1531835551805-16d864c8d311"),
  },
  {
    name: "Glazed serving bowl",
    brand: "Safi Clay",
    category: "Ceramics",
    price: 48,
    compareAt: 58,
    rating: 4.6,
    reviews: 128,
    stock: 16,
    image: photo("photo-1610701596007-11502861dcfa"),
  },
  {
    name: "Saffron soap bar",
    brand: "Souss",
    category: "Beauty",
    price: 9,
    rating: 4.1,
    reviews: 402,
    stock: 200,
    image: photo("photo-1600857062241-98e5dba7f214"),
  },
];

export const products: Product[] = seed.map((p, i) => ({
  ...p,
  id: String(i + 1),
  description: `${p.name} by ${p.brand}. Made by artisans using traditional techniques and natural materials. Each piece is unique; small variations are part of its character.`,
}));

export const categories = ["Rugs", "Ceramics", "Beauty", "Lighting", "Textiles"] as const;
export const brands = [...new Set(products.map((p) => p.brand))];
