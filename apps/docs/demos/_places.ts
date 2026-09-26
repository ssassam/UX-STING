export interface PlaceRow {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
  status: "published" | "draft" | "pending";
  updated: Date;
}

const names = [
  "Café Atlas",
  "Riad Zitoun",
  "La Sqala",
  "Bab Food",
  "Pâtisserie Amoud",
  "Le Petit Rocher",
  "Dar Cherifa",
  "Blue Door",
  "Sahara Grill",
  "Olive & Co",
  "Medina Books",
  "Surf House",
];
const categories = [
  "Café",
  "Hotel",
  "Restaurant",
  "Restaurant",
  "Bakery",
  "Bar",
  "Guesthouse",
  "Café",
  "Restaurant",
  "Deli",
  "Bookstore",
  "Hostel",
];
const cities = [
  "Casablanca",
  "Marrakech",
  "Casablanca",
  "Rabat",
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tangier",
  "Agadir",
  "Rabat",
  "Fès",
  "Taghazout",
];

export const placeRows: PlaceRow[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  category: categories[i]!,
  city: cities[i]!,
  rating: Math.round((3.6 + ((i * 7) % 14) / 10) * 10) / 10,
  reviews: 20 + ((i * 53) % 400),
  status: (["published", "draft", "pending"] as const)[i % 3]!,
  updated: new Date(2026, 2, 28 - i),
}));
