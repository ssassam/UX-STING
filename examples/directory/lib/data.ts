import type { OpeningPeriod } from "@ux-sting/react/opening-hours";

export interface Place {
  slug: string;
  name: string;
  category: string;
  categoryId: string;
  city: string;
  area: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  priceLevel: 1 | 2 | 3 | 4;
  premium: boolean;
  verified: boolean;
  amenities: string[];
  image: string;
  phone: string;
  description: string;
  hours: OpeningPeriod[];
  pin: { x: number; y: number };
}

const photo = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;
const weekdays = (open: string, close: string) =>
  [1, 2, 3, 4, 5].map((day) => ({ day, open, close }));
const everyDay = (open: string, close: string) =>
  [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open, close }));

export const categories = [
  { id: "restaurants", name: "Restaurants", count: 1204 },
  { id: "cafes", name: "Cafés", count: 468 },
  { id: "hotels", name: "Hotels", count: 212 },
  { id: "services", name: "Services", count: 890 },
  { id: "shopping", name: "Shopping", count: 640 },
  { id: "fitness", name: "Fitness", count: 96 },
] as const;

export const cities = [
  {
    id: "casablanca",
    name: "Casablanca",
    count: 3120,
    image: photo("photo-1539020140153-e479b8c22e70"),
  },
  {
    id: "marrakech",
    name: "Marrakech",
    count: 2480,
    image: photo("photo-1597212618440-806262de4f6b"),
  },
  { id: "rabat", name: "Rabat", count: 1310, image: photo("photo-1553603227-2358aabe821e") },
];

export const places: Place[] = [
  {
    slug: "cafe-atlas",
    name: "Café Atlas",
    category: "Coffee shop",
    categoryId: "cafes",
    city: "Casablanca",
    area: "Gauthier",
    address: "12 Rue de Fès",
    distanceKm: 0.85,
    rating: 4.6,
    reviews: 128,
    priceLevel: 1,
    premium: false,
    verified: true,
    amenities: ["Wi-Fi", "Terrace", "Vegan options"],
    image: photo("photo-1554118811-1e0d58224f24"),
    phone: "+212 522 000 111",
    description:
      "Specialty coffee roasted weekly, pastries baked in house and a calm upstairs room for remote work.",
    hours: everyDay("08:00", "22:00"),
    pin: { x: 32, y: 40 },
  },
  {
    slug: "la-sqala",
    name: "La Sqala",
    category: "Moroccan restaurant",
    categoryId: "restaurants",
    city: "Casablanca",
    area: "Ancienne Médina",
    address: "Boulevard des Almohades",
    distanceKm: 1.2,
    rating: 4.7,
    reviews: 2310,
    priceLevel: 2,
    premium: true,
    verified: true,
    amenities: ["Terrace", "Kids friendly", "Parking"],
    image: photo("photo-1517248135467-4c7edcad34c4"),
    phone: "+212 522 000 222",
    description:
      "Garden restaurant inside an 18th-century fortress, famous for its Moroccan brunch.",
    hours: everyDay("09:00", "23:00"),
    pin: { x: 55, y: 58 },
  },
  {
    slug: "riad-zitoun",
    name: "Riad Zitoun",
    category: "Boutique hotel",
    categoryId: "hotels",
    city: "Marrakech",
    area: "Medina",
    address: "Derb Zitoun Jdid",
    distanceKm: 3.4,
    rating: 4.9,
    reviews: 412,
    priceLevel: 3,
    premium: true,
    verified: true,
    amenities: ["Wi-Fi", "Pool", "Breakfast"],
    image: photo("photo-1566073771259-6a8506099945"),
    phone: "+212 524 000 333",
    description: "Eight rooms around a courtyard pool, rooftop breakfast and a hammam.",
    hours: everyDay("00:00", "23:59"),
    pin: { x: 70, y: 32 },
  },
  {
    slug: "karim-plumbing",
    name: "Karim Plumbing",
    category: "Plumber",
    categoryId: "services",
    city: "Casablanca",
    area: "Maarif",
    address: "Serves Casablanca & Mohammedia",
    distanceKm: 2.1,
    rating: 4.8,
    reviews: 96,
    priceLevel: 2,
    premium: false,
    verified: false,
    amenities: ["Emergency", "Licensed"],
    image: photo("photo-1585704032915-c3400ca199e7"),
    phone: "+212 661 000 444",
    description: "Licensed plumbers for repairs, installations and 24/7 emergencies.",
    hours: weekdays("08:00", "19:00"),
    pin: { x: 44, y: 70 },
  },
  {
    slug: "blue-door",
    name: "Blue Door Coffee Bar",
    category: "Coffee shop",
    categoryId: "cafes",
    city: "Rabat",
    area: "Agdal",
    address: "7 Avenue de France",
    distanceKm: 4.9,
    rating: 4.4,
    reviews: 57,
    priceLevel: 1,
    premium: false,
    verified: true,
    amenities: ["Wi-Fi", "Pet friendly"],
    image: photo("photo-1501339847302-ac426a4a7cbb"),
    phone: "+212 537 000 555",
    description: "Pour-over and cold brew with a sunny terrace.",
    hours: [...weekdays("07:30", "20:00"), { day: 6, open: "09:00", close: "18:00" }],
    pin: { x: 22, y: 25 },
  },
  {
    slug: "sahara-grill",
    name: "Sahara Grill",
    category: "Grill",
    categoryId: "restaurants",
    city: "Casablanca",
    area: "Ain Diab",
    address: "Boulevard de la Corniche",
    distanceKm: 5.6,
    rating: 4.2,
    reviews: 780,
    priceLevel: 3,
    premium: false,
    verified: true,
    amenities: ["Sea view", "Parking", "Live music"],
    image: photo("photo-1414235077428-338989a2e8c0"),
    phone: "+212 522 000 666",
    description: "Charcoal grill and seafood facing the ocean; live music on weekends.",
    hours: [...everyDay("12:00", "15:00"), ...everyDay("19:00", "01:00")],
    pin: { x: 85, y: 62 },
  },
  {
    slug: "atlas-fitness",
    name: "Atlas Fitness Club",
    category: "Gym",
    categoryId: "fitness",
    city: "Casablanca",
    area: "Racine",
    address: "45 Rue Ibnou Katir",
    distanceKm: 1.9,
    rating: 4.5,
    reviews: 204,
    priceLevel: 2,
    premium: true,
    verified: true,
    amenities: ["Showers", "Classes", "Parking"],
    image: photo("photo-1534438327276-14e5300c3a48"),
    phone: "+212 522 000 777",
    description: "Strength floor, group classes and a 25 m pool.",
    hours: [
      ...weekdays("06:00", "22:00"),
      { day: 6, open: "08:00", close: "20:00" },
      { day: 0, open: "08:00", close: "14:00" },
    ],
    pin: { x: 40, y: 48 },
  },
  {
    slug: "medina-books",
    name: "Medina Books",
    category: "Bookstore",
    categoryId: "shopping",
    city: "Rabat",
    area: "Medina",
    address: "Rue des Consuls",
    distanceKm: 6.2,
    rating: 4.7,
    reviews: 88,
    priceLevel: 1,
    premium: false,
    verified: false,
    amenities: ["Wi-Fi", "Café"],
    image: photo("photo-1521017432531-fbd92d768814"),
    phone: "+212 537 000 888",
    description: "Independent bookstore with Arabic, French and English titles and a small café.",
    hours: weekdays("10:00", "19:00"),
    pin: { x: 60, y: 20 },
  },
];

export const amenities = [...new Set(places.flatMap((p) => p.amenities))].sort();
