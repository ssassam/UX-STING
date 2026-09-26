import type { ComboboxOption } from "@unified-ui/react/combobox";

export const cities: ComboboxOption[] = [
  { value: "casablanca", label: "Casablanca", group: "Morocco", description: "3.7M people" },
  { value: "rabat", label: "Rabat", group: "Morocco" },
  { value: "marrakech", label: "Marrakech", group: "Morocco" },
  { value: "paris", label: "Paris", group: "France", description: "Capital" },
  { value: "lyon", label: "Lyon", group: "France" },
  { value: "marseille", label: "Marseille", group: "France" },
  { value: "madrid", label: "Madrid", group: "Spain" },
  { value: "barcelona", label: "Barcelona", group: "Spain" },
  { value: "cairo", label: "Cairo", group: "Egypt" },
  { value: "dubai", label: "Dubai", group: "UAE" },
];

export const amenities: ComboboxOption[] = ["Wi-Fi", "Parking", "Terrace", "Pet friendly", "Vegan options", "Live music", "Kids menu", "Delivery"].map((label) => ({
  value: label.toLowerCase().replace(/\s+/g, "-"),
  label,
}));

export const img = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;
