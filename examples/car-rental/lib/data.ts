/**
 * Demo content for the Drivo car-rental template. Prices are fictional.
 * Photos come from Wikimedia Commons (see lib/photos.ts and /credits).
 */
import { photos, type Photo } from "./photos";

export type Category = "economy" | "compact" | "electric" | "premium" | "suv" | "van";
export type Transmission = "Manual" | "Automatic";
export type Fuel = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export interface Car {
  id: string;
  name: string;
  similar: string;
  category: Category;
  photo: Photo;
  seats: number;
  doors: number;
  bags: number;
  transmission: Transmission;
  fuel: Fuel;
  /** km of range for electric cars */
  rangeKm?: number;
  pricePerDay: number;
  rating: number;
  reviews: number;
  features: string[];
  deposit: number;
  popular?: boolean;
}

export const categories: { id: Category; name: string; description: string }[] = [
  { id: "economy", name: "Economy", description: "Easy to park, great for cities" },
  { id: "compact", name: "Compact", description: "Room for four and their bags" },
  { id: "electric", name: "Electric", description: "Zero emissions, fast charging" },
  { id: "premium", name: "Premium", description: "Executive comfort for business" },
  { id: "suv", name: "SUV & 4x4", description: "Space and grip for any road" },
  { id: "van", name: "Vans", description: "Up to 9 seats for groups" },
];

export const cars: Car[] = [
  {
    id: "fiat-500",
    name: "Fiat 500",
    similar: "or similar city car",
    category: "economy",
    photo: photos.fiat500,
    seats: 4,
    doors: 3,
    bags: 1,
    transmission: "Manual",
    fuel: "Petrol",
    pricePerDay: 29,
    rating: 4.5,
    reviews: 1284,
    features: ["Air conditioning", "Bluetooth", "Apple CarPlay"],
    deposit: 500,
  },
  {
    id: "renault-clio",
    name: "Renault Clio",
    similar: "or similar small hatchback",
    category: "economy",
    photo: photos.clio,
    seats: 5,
    doors: 5,
    bags: 2,
    transmission: "Manual",
    fuel: "Petrol",
    pricePerDay: 34,
    rating: 4.6,
    reviews: 2210,
    features: ["Air conditioning", "Cruise control", "Android Auto"],
    deposit: 500,
    popular: true,
  },
  {
    id: "vw-golf",
    name: "Volkswagen Golf",
    similar: "or similar compact",
    category: "compact",
    photo: photos.golf,
    seats: 5,
    doors: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 45,
    rating: 4.7,
    reviews: 1876,
    features: ["Automatic", "Parking sensors", "Apple CarPlay", "Lane assist"],
    deposit: 700,
    popular: true,
  },
  {
    id: "toyota-corolla",
    name: "Toyota Corolla Hybrid",
    similar: "or similar hybrid",
    category: "compact",
    photo: photos.corolla,
    seats: 5,
    doors: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 49,
    rating: 4.8,
    reviews: 1432,
    features: ["Hybrid", "Adaptive cruise", "Reversing camera"],
    deposit: 700,
  },
  {
    id: "tesla-model-3",
    name: "Tesla Model 3",
    similar: "or similar electric saloon",
    category: "electric",
    photo: photos.model3,
    seats: 5,
    doors: 4,
    bags: 3,
    transmission: "Automatic",
    fuel: "Electric",
    rangeKm: 513,
    pricePerDay: 79,
    rating: 4.9,
    reviews: 964,
    features: ["Autopilot", "Supercharger access", "Heated seats", "Glass roof"],
    deposit: 1000,
    popular: true,
  },
  {
    id: "kia-ev6",
    name: "Kia EV6",
    similar: "or similar electric crossover",
    category: "electric",
    photo: photos.ev6,
    seats: 5,
    doors: 5,
    bags: 4,
    transmission: "Automatic",
    fuel: "Electric",
    rangeKm: 528,
    pricePerDay: 75,
    rating: 4.8,
    reviews: 512,
    features: ["800V fast charging", "Heat pump", "Head-up display"],
    deposit: 1000,
  },
  {
    id: "bmw-3",
    name: "BMW 3 Series",
    similar: "or similar premium saloon",
    category: "premium",
    photo: photos.bmw3,
    seats: 5,
    doors: 4,
    bags: 3,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 89,
    rating: 4.8,
    reviews: 741,
    features: ["Leather seats", "Navigation", "Adaptive LED lights"],
    deposit: 1500,
  },
  {
    id: "mercedes-e",
    name: "Mercedes-Benz E-Class",
    similar: "or similar executive saloon",
    category: "premium",
    photo: photos.eclass,
    seats: 5,
    doors: 4,
    bags: 4,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 109,
    rating: 4.9,
    reviews: 388,
    features: ["Massage seats", "Burmester audio", "Driver assistance pack"],
    deposit: 2000,
  },
  {
    id: "toyota-rav4",
    name: "Toyota RAV4 Plug-in",
    similar: "or similar hybrid SUV",
    category: "suv",
    photo: photos.rav4,
    seats: 5,
    doors: 5,
    bags: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 69,
    rating: 4.7,
    reviews: 823,
    features: ["All-wheel drive", "Roof rails", "Wireless charging"],
    deposit: 1000,
    popular: true,
  },
  {
    id: "peugeot-3008",
    name: "Peugeot e-3008",
    similar: "or similar electric SUV",
    category: "suv",
    photo: photos["3008"],
    seats: 5,
    doors: 5,
    bags: 4,
    transmission: "Automatic",
    fuel: "Electric",
    rangeKm: 527,
    pricePerDay: 72,
    rating: 4.6,
    reviews: 297,
    features: ["Panoramic display", "Fast charging", "Hands-free tailgate"],
    deposit: 1000,
  },
  {
    id: "jeep-wrangler",
    name: "Jeep Wrangler 4xe",
    similar: "or similar 4x4",
    category: "suv",
    photo: photos.wrangler,
    seats: 5,
    doors: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 119,
    rating: 4.7,
    reviews: 214,
    features: ["Removable roof", "4x4 off-road", "Hill descent control"],
    deposit: 2000,
  },
  {
    id: "vw-transporter",
    name: "Volkswagen Transporter",
    similar: "or similar 9-seat minibus",
    category: "van",
    photo: photos.transporter,
    seats: 9,
    doors: 4,
    bags: 6,
    transmission: "Manual",
    fuel: "Diesel",
    pricePerDay: 99,
    rating: 4.6,
    reviews: 356,
    features: ["9 seats", "Sliding door", "Rear air conditioning"],
    deposit: 1500,
  },
];

export const locations = [
  {
    id: "cdg",
    name: "Paris Charles de Gaulle Airport",
    city: "Paris",
    type: "Airport",
    hours: "24/7",
  },
  { id: "orly", name: "Paris Orly Airport", city: "Paris", type: "Airport", hours: "6:00–23:30" },
  {
    id: "lyon",
    name: "Lyon Part-Dieu Station",
    city: "Lyon",
    type: "Train station",
    hours: "7:00–21:00",
  },
  { id: "nice", name: "Nice Côte d'Azur Airport", city: "Nice", type: "Airport", hours: "24/7" },
  {
    id: "marseille",
    name: "Marseille Saint-Charles Station",
    city: "Marseille",
    type: "Train station",
    hours: "7:00–20:00",
  },
  {
    id: "bordeaux",
    name: "Bordeaux city centre",
    city: "Bordeaux",
    type: "City",
    hours: "8:00–19:00",
  },
];

export const extras = [
  { id: "driver", name: "Additional driver", description: "Share the driving", perDay: 9 },
  { id: "child", name: "Child seat", description: "For children 9–18 kg", perDay: 7 },
  { id: "gps", name: "Portable GPS", description: "Offline maps for Europe", perDay: 5 },
  { id: "snow", name: "Snow chains", description: "Required on some mountain roads", perDay: 4 },
];

export const protection = [
  { id: "basic", name: "Basic", description: "Included · excess up to the deposit", perDay: 0 },
  {
    id: "plus",
    name: "Plus",
    description: "Excess reduced to €300, tyres and glass covered",
    perDay: 12,
  },
  { id: "full", name: "Full", description: "Zero excess, deposit reduced to €100", perDay: 21 },
];

export const reviews = [
  {
    name: "Inès Laurent",
    trip: "Tesla Model 3 · Nice Airport",
    rating: 5,
    date: "2026-08-14",
    display: "August 2026",
    body: "Picked up in five minutes with the app, car was spotless and fully charged. Return was just as quick.",
  },
  {
    name: "Tom Becker",
    trip: "Volkswagen Transporter · Lyon",
    rating: 5,
    date: "2026-07-02",
    display: "July 2026",
    body: "Perfect for our family of eight. Clear pricing with no surprises at the counter.",
  },
  {
    name: "Yasmin Haddad",
    trip: "Renault Clio · Paris Orly",
    rating: 4,
    date: "2026-06-19",
    display: "June 2026",
    body: "Great value and friendly staff. Only wish the station opened a little earlier.",
  },
];

export const faqs = [
  {
    q: "What do I need to pick up the car?",
    a: "A driving licence held for at least one year, a passport or ID card, and a credit card in the main driver's name for the deposit.",
  },
  {
    q: "Is mileage unlimited?",
    a: "Yes — every rental includes unlimited kilometres within France and neighbouring EU countries.",
  },
  {
    q: "Can I cancel for free?",
    a: "Free cancellation up to 48 hours before pick-up. After that we keep one day's rental.",
  },
  {
    q: "How does charging work for electric cars?",
    a: "Cars leave at 80% or more. Return with at least 20% and there is no charging fee; you can use any public charger with the included card.",
  },
];

export const CURRENCY = "EUR";
export const getCar = (id: string) => cars.find((c) => c.id === id);
export const getLocation = (id: string) => locations.find((l) => l.id === id);
