export interface Booking {
  id: string;
  guest: string;
  email: string;
  listing: string;
  date: string;
  nights: number;
  total: number;
  status: "confirmed" | "pending" | "cancelled";
}

const guests = [
  "Nadia Amrani",
  "Tom Becker",
  "Aya Tazi",
  "Lucas Martin",
  "Sara Benali",
  "Omar Haddad",
  "Emma Rossi",
  "Youssef Alami",
  "Chloé Dubois",
  "Karim Idrissi",
  "Léa Moreau",
  "Hamza Kettani",
];
const listings = ["Riad Zitoun", "Atlas Suites", "Ocean View Loft", "Medina House"];

export const bookings: Booking[] = Array.from({ length: 36 }, (_, i) => ({
  id: `BK-${2400 + i}`,
  guest: guests[i % guests.length]!,
  email: `${guests[i % guests.length]!.split(" ")[0]!.toLowerCase()}@example.com`,
  listing: listings[i % listings.length]!,
  date: new Date(2026, 3, 1 + (i % 28)).toISOString().slice(0, 10),
  nights: 1 + (i % 6),
  total: 90 * (1 + (i % 6)) + (i % 4) * 25,
  status: (["confirmed", "confirmed", "pending", "cancelled"] as const)[i % 4]!,
}));

export const revenueByMonth = [
  { month: "Oct", value: 18200 },
  { month: "Nov", value: 21400 },
  { month: "Dec", value: 32800 },
  { month: "Jan", value: 24100 },
  { month: "Feb", value: 27600 },
  { month: "Mar", value: 36900 },
];

export const activity = [
  { title: "New booking from Aya Tazi", time: "5 min ago", variant: "success" as const },
  { title: "Review received (★ 5) on Riad Zitoun", time: "1 h ago", variant: "primary" as const },
  { title: "Payout of €4,210 sent", time: "Yesterday", variant: "default" as const },
  { title: "Cancellation: Lucas Martin", time: "2 days ago", variant: "destructive" as const },
];
