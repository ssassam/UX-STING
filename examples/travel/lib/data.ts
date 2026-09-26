/**
 * Demo content for the Wayfare travel template. Replace with your CMS or API.
 * Photos come from Wikimedia Commons (see lib/photos.ts and the /credits page).
 */
import { photos, type Photo } from "./photos";

export type TripStyle = "beach" | "mountains" | "city" | "culture" | "adventure" | "cruise";

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  image: Photo;
  gallery: Photo[];
  styles: TripStyle[];
  fromPrice: number;
  rating: number;
  reviews: number;
  bestTime: string;
  flightHours: number;
  avgTemp: number;
  language: string;
  currency: string;
  highlights: string[];
  pin: { x: number; y: number };
}

export interface Stay {
  id: string;
  name: string;
  destination: string;
  area: string;
  type: "Hotel" | "Resort" | "Villa" | "Riad" | "Boutique";
  stars: number;
  rating: number;
  reviews: number;
  nightly: number;
  compareAt?: number;
  image: Photo;
  amenities: string[];
  freeCancellation: boolean;
  featured?: boolean;
  distance: string;
  description: string;
  rooms: { id: string; name: string; beds: string; guests: number; price: number }[];
  pin: { x: number; y: number };
}

export interface Tour {
  id: string;
  title: string;
  destination: string;
  days: number;
  groupSize: number;
  price: number;
  rating: number;
  reviews: number;
  image: Photo;
  level: "Easy" | "Moderate" | "Challenging";
  summary: string;
  departures: string[];
  itinerary: { title: string; description: string }[];
  included: string[];
}

export const tripStyles: { id: TripStyle; name: string; count: number }[] = [
  { id: "beach", name: "Beach escapes", count: 128 },
  { id: "mountains", name: "Mountains", count: 64 },
  { id: "city", name: "City breaks", count: 212 },
  { id: "culture", name: "Culture & history", count: 97 },
  { id: "adventure", name: "Adventure", count: 53 },
  { id: "cruise", name: "Cruises", count: 31 },
];

export const destinations: Destination[] = [
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    tagline: "Whitewashed cliffs above the Aegean",
    description:
      "A crescent of volcanic cliffs, blue-domed chapels and sunsets that stop the whole island. Swim at black-sand beaches, sail the caldera and taste Assyrtiko in century-old wineries.",
    image: photos["santorini-1"],
    gallery: [
      photos["santorini-1"],
      photos["santorini-2"],
      photos["stay-caldera-view-suites"],
      photos["santorini-4"],
    ],
    styles: ["beach", "culture"],
    fromPrice: 189,
    rating: 4.9,
    reviews: 3120,
    bestTime: "May–October",
    flightHours: 3.5,
    avgTemp: 24,
    language: "Greek",
    currency: "EUR",
    highlights: [
      "Sunset from Oia castle",
      "Caldera catamaran cruise",
      "Akrotiri Bronze Age site",
      "Wine tasting in Megalochori",
    ],
    pin: { x: 58, y: 42 },
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    tagline: "Temples, tea houses and quiet gardens",
    description:
      "Japan's former capital keeps more than a thousand temples, wooden machiya streets and moss gardens. Arrive for cherry blossoms in spring or fiery maples in autumn.",
    image: photos["kyoto-1"],
    gallery: [
      photos["kyoto-1"],
      photos["kyoto-2"],
      photos["kyoto-3"],
      photos["kyoto-4"],
      photos["kyoto-5"],
    ],
    styles: ["culture", "city"],
    fromPrice: 142,
    rating: 4.8,
    reviews: 2894,
    bestTime: "March–May, October–November",
    flightHours: 13,
    avgTemp: 16,
    language: "Japanese",
    currency: "JPY",
    highlights: [
      "Fushimi Inari torii trail at dawn",
      "Arashiyama bamboo grove",
      "Tea ceremony in Gion",
      "Kinkaku-ji golden pavilion",
    ],
    pin: { x: 84, y: 40 },
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    tagline: "Souks, riads and Atlas sunsets",
    description:
      "Lose yourself in the medina's spice-scented alleys, rest in tiled riad courtyards and head into the Atlas Mountains or the Agafay desert for a night under the stars.",
    image: photos["marrakech-1"],
    gallery: [
      photos["marrakech-1"],
      photos["marrakech-2"],
      photos["marrakech-3"],
      photos["marrakech-4"],
      photos["tour-atlas-and-sahara"],
    ],
    styles: ["culture", "adventure"],
    fromPrice: 96,
    rating: 4.7,
    reviews: 1987,
    bestTime: "March–May, September–November",
    flightHours: 3.5,
    avgTemp: 22,
    language: "Arabic, Amazigh, French",
    currency: "MAD",
    highlights: [
      "Jemaa el-Fnaa at dusk",
      "Jardin Majorelle",
      "Atlas Mountains day trek",
      "Agafay desert camp",
    ],
    pin: { x: 45, y: 46 },
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    tagline: "Rice terraces, surf and sacred temples",
    description:
      "From Ubud's jungle valleys to Uluwatu's cliff-top surf breaks, Bali mixes wellness retreats, Hindu ceremonies and some of Asia's most relaxed beach towns.",
    image: photos["bali-2"],
    gallery: [
      photos["bali-1"],
      photos["bali-2"],
      photos["bali-3"],
      photos["bali-4"],
      photos["bali-5"],
    ],
    styles: ["beach", "adventure", "culture"],
    fromPrice: 74,
    rating: 4.8,
    reviews: 4210,
    bestTime: "April–October",
    flightHours: 16,
    avgTemp: 28,
    language: "Indonesian, Balinese",
    currency: "IDR",
    highlights: [
      "Tegallalang rice terraces",
      "Sunrise hike on Mount Batur",
      "Uluwatu temple kecak dance",
      "Snorkelling at Nusa Penida",
    ],
    pin: { x: 80, y: 62 },
  },
  {
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    region: "Europe",
    tagline: "Glaciers, lakes and scenic railways",
    description:
      "Ride panoramic trains past glaciers, hike flower-filled meadows in summer or ski world-class slopes in winter, with chalet villages at every turn.",
    image: photos["swiss-alps-3"],
    gallery: [
      photos["swiss-alps-1"],
      photos["swiss-alps-2"],
      photos["swiss-alps-3"],
      photos["swiss-alps-4"],
      photos["swiss-alps-5"],
    ],
    styles: ["mountains", "adventure"],
    fromPrice: 210,
    rating: 4.9,
    reviews: 1654,
    bestTime: "June–September, December–March",
    flightHours: 2,
    avgTemp: 12,
    language: "German, French, Italian",
    currency: "CHF",
    highlights: [
      "Glacier Express from Zermatt",
      "Jungfraujoch viewpoint",
      "Lake Oeschinen hike",
      "Fondue in a mountain hut",
    ],
    pin: { x: 52, y: 34 },
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    tagline: "Trams, tiles and Atlantic light",
    description:
      "Seven hills of pastel façades, tiled palaces and miradouros. Eat pastéis de nata in Belém, hear fado in Alfama and reach Atlantic beaches in half an hour.",
    image: photos["lisbon-2"],
    gallery: [
      photos["lisbon-2"],
      photos["lisbon-1"],
      photos["lisbon-4"],
      photos["lisbon-5"],
      photos["lisbon-3"],
    ],
    styles: ["city", "culture", "beach"],
    fromPrice: 118,
    rating: 4.7,
    reviews: 2340,
    bestTime: "March–June, September–October",
    flightHours: 2.5,
    avgTemp: 20,
    language: "Portuguese",
    currency: "EUR",
    highlights: [
      "Tram 28 through Alfama",
      "Belém tower and monastery",
      "Sintra palaces day trip",
      "Sunset at Miradouro da Graça",
    ],
    pin: { x: 42, y: 38 },
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    country: "Chile & Argentina",
    region: "South America",
    tagline: "Granite towers at the end of the world",
    description:
      "Trek beneath the towers of Torres del Paine, watch glaciers calve at Perito Moreno and cross wind-swept steppe where guanacos outnumber people.",
    image: photos["patagonia-5"],
    gallery: [
      photos["patagonia-5"],
      photos["patagonia-1"],
      photos["patagonia-2"],
      photos["patagonia-4"],
    ],
    styles: ["mountains", "adventure"],
    fromPrice: 165,
    rating: 4.9,
    reviews: 876,
    bestTime: "November–March",
    flightHours: 17,
    avgTemp: 11,
    language: "Spanish",
    currency: "CLP",
    highlights: [
      "W Trek in Torres del Paine",
      "Perito Moreno glacier walk",
      "Fitz Roy sunrise",
      "Estancia asado dinner",
    ],
    pin: { x: 30, y: 80 },
  },
  {
    slug: "norwegian-fjords",
    name: "Norwegian Fjords",
    country: "Norway",
    region: "Europe",
    tagline: "Cruise between waterfalls and cliffs",
    description:
      "Sail narrow fjords framed by thousand-metre walls and waterfalls, stop in colourful harbour towns and chase the midnight sun or the northern lights.",
    image: photos["norwegian-fjords-1"],
    gallery: [
      photos["norwegian-fjords-1"],
      photos["norwegian-fjords-2"],
      photos["norwegian-fjords-3"],
      photos["norwegian-fjords-4"],
      photos["norwegian-fjords-5"],
    ],
    styles: ["cruise", "mountains"],
    fromPrice: 240,
    rating: 4.8,
    reviews: 712,
    bestTime: "May–September",
    flightHours: 2.5,
    avgTemp: 13,
    language: "Norwegian",
    currency: "NOK",
    highlights: [
      "Geirangerfjord cruise",
      "Flåm railway",
      "Preikestolen hike",
      "Bergen fish market",
    ],
    pin: { x: 53, y: 20 },
  },
];

const room = (base: number) => [
  { id: "classic", name: "Classic room", beds: "1 queen bed", guests: 2, price: base },
  {
    id: "deluxe",
    name: "Deluxe room with view",
    beds: "1 king bed",
    guests: 2,
    price: Math.round(base * 1.35),
  },
  {
    id: "suite",
    name: "Family suite",
    beds: "1 king + 2 singles",
    guests: 4,
    price: Math.round(base * 1.9),
  },
];

export const stays: Stay[] = [
  {
    id: "caldera-view-suites",
    name: "Caldera View Suites",
    destination: "santorini",
    area: "Oia",
    type: "Boutique",
    stars: 5,
    rating: 4.9,
    reviews: 612,
    nightly: 420,
    compareAt: 495,
    image: photos["stay-caldera-view-suites"],
    amenities: ["Infinity pool", "Sea view", "Breakfast included", "Wi-Fi", "Airport transfer"],
    freeCancellation: true,
    featured: true,
    distance: "300 m to Oia castle",
    description:
      "Cave suites carved into the caldera cliff, each with a private terrace and plunge pool facing the sunset.",
    rooms: room(420),
    pin: { x: 38, y: 30 },
  },
  {
    id: "aegean-blue-hotel",
    name: "Aegean Blue Hotel",
    destination: "santorini",
    area: "Fira",
    type: "Hotel",
    stars: 4,
    rating: 4.6,
    reviews: 1024,
    nightly: 189,
    image: photos["santorini-2"],
    amenities: ["Pool", "Wi-Fi", "Breakfast included", "Bar"],
    freeCancellation: true,
    distance: "Central Fira",
    description:
      "A friendly hotel in the heart of Fira with a pool terrace, generous breakfasts and easy bus links.",
    rooms: room(189),
    pin: { x: 55, y: 48 },
  },
  {
    id: "ryokan-hanami",
    name: "Ryokan Hanami",
    destination: "kyoto",
    area: "Higashiyama",
    type: "Boutique",
    stars: 4,
    rating: 4.9,
    reviews: 438,
    nightly: 265,
    image: photos["stay-ryokan-hanami"],
    amenities: ["Onsen", "Breakfast included", "Garden", "Wi-Fi"],
    freeCancellation: false,
    featured: true,
    distance: "5 min walk to Kiyomizu-dera",
    description:
      "A traditional inn with tatami rooms, kaiseki dinners and a private hot-spring bath overlooking a moss garden.",
    rooms: room(265),
    pin: { x: 62, y: 35 },
  },
  {
    id: "kyoto-station-hotel",
    name: "Kamo River Hotel",
    destination: "kyoto",
    area: "Shimogyo",
    type: "Hotel",
    stars: 3,
    rating: 4.4,
    reviews: 1890,
    nightly: 142,
    image: photos["stay-kyoto-station-hotel"],
    amenities: ["Wi-Fi", "Gym", "Restaurant"],
    freeCancellation: true,
    distance: "400 m to Kyoto Station",
    description: "Modern rooms by the river with fast links to every temple district.",
    rooms: room(142),
    pin: { x: 45, y: 62 },
  },
  {
    id: "riad-yasmine",
    name: "Riad Yasmine",
    destination: "marrakech",
    area: "Medina",
    type: "Riad",
    stars: 4,
    rating: 4.8,
    reviews: 954,
    nightly: 118,
    compareAt: 140,
    image: photos["marrakech-4"],
    amenities: ["Pool", "Breakfast included", "Rooftop terrace", "Wi-Fi", "Hammam"],
    freeCancellation: true,
    featured: true,
    distance: "8 min walk to Jemaa el-Fnaa",
    description:
      "Green-tiled courtyard, plunge pool and a rooftop terrace where breakfast is served under the palms.",
    rooms: room(118),
    pin: { x: 48, y: 44 },
  },
  {
    id: "atlas-kasbah-lodge",
    name: "Atlas Kasbah Lodge",
    destination: "marrakech",
    area: "Imlil",
    type: "Resort",
    stars: 4,
    rating: 4.7,
    reviews: 311,
    nightly: 96,
    image: photos["marrakech-2"],
    amenities: ["Mountain view", "Restaurant", "Guided hikes", "Wi-Fi"],
    freeCancellation: false,
    distance: "90 min from Marrakech",
    description: "An eco-lodge in the High Atlas with Berber cooking and trailheads at the door.",
    rooms: room(96),
    pin: { x: 70, y: 72 },
  },
  {
    id: "ubud-jungle-villas",
    name: "Ubud Jungle Villas",
    destination: "bali",
    area: "Ubud",
    type: "Villa",
    stars: 5,
    rating: 4.9,
    reviews: 778,
    nightly: 210,
    image: photos["bali-1"],
    amenities: ["Private pool", "Spa", "Breakfast included", "Yoga", "Wi-Fi"],
    freeCancellation: true,
    featured: true,
    distance: "10 min to Ubud centre",
    description:
      "Private pool villas hanging over the Ayung river valley, with daily yoga and a riverside spa.",
    rooms: room(210),
    pin: { x: 42, y: 38 },
  },
  {
    id: "uluwatu-surf-house",
    name: "Uluwatu Surf House",
    destination: "bali",
    area: "Uluwatu",
    type: "Hotel",
    stars: 3,
    rating: 4.5,
    reviews: 642,
    nightly: 74,
    image: photos["stay-uluwatu-surf-house"],
    amenities: ["Pool", "Surfboard rental", "Wi-Fi", "Bar"],
    freeCancellation: true,
    distance: "Walk to Padang Padang beach",
    description: "Laid-back rooms steps from the cliffs, with a board rack and sunset bar.",
    rooms: room(74),
    pin: { x: 30, y: 78 },
  },
  {
    id: "zermatt-chalet",
    name: "Chalet Matterhorn",
    destination: "swiss-alps",
    area: "Zermatt",
    type: "Boutique",
    stars: 4,
    rating: 4.8,
    reviews: 402,
    nightly: 310,
    image: photos["stay-zermatt-chalet"],
    amenities: ["Mountain view", "Spa", "Ski storage", "Breakfast included", "Wi-Fi"],
    freeCancellation: true,
    distance: "250 m to Gornergrat railway",
    description:
      "Larch-wood rooms with Matterhorn balconies, a sauna and hearty Alpine breakfasts.",
    rooms: room(310),
    pin: { x: 50, y: 55 },
  },
  {
    id: "alfama-house",
    name: "Casa Alfama",
    destination: "lisbon",
    area: "Alfama",
    type: "Boutique",
    stars: 4,
    rating: 4.7,
    reviews: 866,
    nightly: 134,
    image: photos["lisbon-2"],
    amenities: ["Rooftop terrace", "Wi-Fi", "Breakfast included"],
    freeCancellation: true,
    distance: "3 min to Tram 28",
    description: "Tiled townhouse rooms with river views and a rooftop for sundowners.",
    rooms: room(134),
    pin: { x: 60, y: 40 },
  },
];

export const tours: Tour[] = [
  {
    id: "cyclades-sailing-week",
    title: "Cyclades sailing week",
    destination: "santorini",
    days: 7,
    groupSize: 10,
    price: 1490,
    rating: 4.9,
    reviews: 212,
    image: photos["tour-cyclades-sailing-week"],
    level: "Easy",
    summary: "Island-hop Santorini, Ios, Paros and Naxos on a skippered yacht.",
    departures: ["2026-05-16", "2026-06-13", "2026-09-05"],
    itinerary: [
      { title: "Santorini", description: "Board in Vlychada marina, sunset swim in the caldera." },
      { title: "Ios", description: "Quiet coves in the morning, Chora's lanes at night." },
      { title: "Paros", description: "Naoussa harbour and a seafood lunch." },
      { title: "Naxos", description: "The Portara at sunset and a mountain village tour." },
      { title: "Return", description: "Sail back to Santorini for a farewell dinner." },
    ],
    included: ["Skipper and fuel", "Cabin accommodation", "Breakfasts and 3 dinners"],
  },
  {
    id: "atlas-and-sahara",
    title: "Atlas Mountains & Sahara",
    destination: "marrakech",
    days: 5,
    groupSize: 12,
    price: 690,
    rating: 4.8,
    reviews: 348,
    image: photos["tour-atlas-and-sahara"],
    level: "Moderate",
    summary: "Cross the High Atlas to Merzouga's dunes, with a night in a desert camp.",
    departures: ["2026-04-04", "2026-10-10", "2026-11-07"],
    itinerary: [
      { title: "Marrakech → Aït Ben Haddou", description: "Tizi n'Tichka pass and the ksar." },
      { title: "Dadès Gorges", description: "Walk the gorges, stay in a family guesthouse." },
      { title: "Merzouga", description: "Camel trek at sunset, night in a desert camp." },
      { title: "Return", description: "Draa valley palm groves back to Marrakech." },
    ],
    included: ["Guide and driver", "4 nights' accommodation", "Breakfasts and dinners"],
  },
  {
    id: "kyoto-food-and-temples",
    title: "Kyoto food & temples",
    destination: "kyoto",
    days: 4,
    groupSize: 8,
    price: 980,
    rating: 4.9,
    reviews: 187,
    image: photos["tour-kyoto-food-and-temples"],
    level: "Easy",
    summary: "Market tastings, a tea ceremony and temple walks with a local guide.",
    departures: ["2026-03-28", "2026-04-11", "2026-11-14"],
    itinerary: [
      { title: "Nishiki market", description: "Tasting walk and a knife-shop visit." },
      { title: "Higashiyama", description: "Kiyomizu-dera, Gion and a tea ceremony." },
      { title: "Arashiyama", description: "Bamboo grove, Tenryu-ji and a shojin lunch." },
    ],
    included: ["Local guide", "Tastings and tea ceremony", "3 nights in a ryokan"],
  },
  {
    id: "w-trek-patagonia",
    title: "W Trek, Torres del Paine",
    destination: "patagonia",
    days: 6,
    groupSize: 10,
    price: 1850,
    rating: 4.9,
    reviews: 96,
    image: photos["patagonia-5"],
    level: "Challenging",
    summary: "Hike the classic W to the towers, French valley and Grey glacier.",
    departures: ["2026-11-20", "2026-12-18", "2027-01-15"],
    itinerary: [
      { title: "Puerto Natales", description: "Gear check and briefing." },
      { title: "Base of the Towers", description: "The park's iconic granite spires." },
      { title: "French Valley", description: "Hanging glaciers and avalanche views." },
      { title: "Grey Glacier", description: "Boat to the ice face, return to town." },
    ],
    included: ["Mountain guide", "Refugio beds", "All meals on trail"],
  },
];

export const testimonials = [
  {
    name: "Amira Benali",
    trip: "Riad Yasmine, Marrakech",
    rating: 5,
    date: "2026-04-02",
    display: "April 2026",
    body: "Everything was seamless — the riad was even more beautiful than the photos, and the Atlas day trip our host arranged was the highlight of the year.",
  },
  {
    name: "Lucas Moreau",
    trip: "Cyclades sailing week",
    rating: 5,
    date: "2026-06-21",
    display: "June 2026",
    body: "Clear pricing, flexible cancellation and a skipper who knew every hidden cove. We've already booked again.",
  },
  {
    name: "Hana Sato",
    trip: "Ubud Jungle Villas, Bali",
    rating: 4,
    date: "2026-08-11",
    display: "August 2026",
    body: "Stunning villa and caring staff. The app kept all our bookings in one place, which made a two-week trip stress-free.",
  },
  {
    name: "Daniel Ortiz",
    trip: "W Trek, Patagonia",
    rating: 5,
    date: "2026-01-30",
    display: "January 2026",
    body: "Tough, spectacular and superbly organised. The packing list and daily briefings were spot on.",
  },
];

export const faqs = [
  {
    q: "Can I cancel or change my booking?",
    a: "Most stays offer free cancellation until 48 hours before check-in — look for the “Free cancellation” tag. Tours can be moved to another departure up to 30 days before.",
  },
  {
    q: "When am I charged?",
    a: "Stays are charged at check-in unless the rate says “Pay now”. Tours take a 20% deposit, with the balance due 30 days before departure.",
  },
  {
    q: "Do prices include taxes and fees?",
    a: "Yes. The price you see includes taxes and service fees; local city taxes, where they apply, are shown before you pay.",
  },
  {
    q: "How do I reach support while travelling?",
    a: "Our travel team is available 24/7 by chat and phone in English, French and Arabic.",
  },
];

export const amenityOptions = [
  "Pool",
  "Breakfast included",
  "Wi-Fi",
  "Spa",
  "Sea view",
  "Mountain view",
  "Gym",
];

export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
export const getStay = (id: string) => stays.find((s) => s.id === id);
export const getTour = (id: string) => tours.find((t) => t.id === id);
export const staysIn = (slug: string) => stays.filter((s) => s.destination === slug);
export const toursIn = (slug: string) => tours.filter((t) => t.destination === slug);

export const CURRENCY = "EUR";
