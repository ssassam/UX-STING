export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: "City guides" | "Food & drink" | "Culture" | "Travel tips";
  author: Author;
  date: string;
  readingMinutes: number;
  image: string;
  body: string[];
}

const photo = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=70&auto=format&fit=crop`;

export const authors: Author[] = [
  { id: "leila", name: "Leila Mansouri", role: "Senior editor", avatar: "https://i.pravatar.cc/120?img=45", bio: "Writes about cities, architecture and the people who make them." },
  { id: "yann", name: "Yann Leroux", role: "Food critic", avatar: "https://i.pravatar.cc/120?img=12", bio: "Has eaten his way through 40 medinas and counting." },
];

const body = [
  "Casablanca rewards the curious walker. Behind the traffic of the boulevards hide Art Deco façades, quiet courtyards and cafés where time moves at the pace of mint tea.",
  "Start early in the Habous quarter, built in the 1930s as a 'new medina'. Arcades shelter booksellers and olive merchants, and the pastry shops open before the souks do.",
  "By midday, head to the Corniche. The ocean breeze is the city's best air conditioning, and the seafood grills along the promenade are as good as anything in town.",
  "In the evening, the old medina comes alive. Follow the sound of music toward the Sqala, an 18th-century fortress turned garden restaurant.",
];

export const articles: Article[] = [
  { slug: "48-hours-casablanca", title: "48 hours in Casablanca: an architecture lover's guide", excerpt: "From Art Deco façades to the Hassan II Mosque, here's how to spend a weekend in Morocco's largest city.", category: "City guides", author: authors[0]!, date: "2026-03-12", readingMinutes: 8, image: photo("photo-1569383746724-6f1b882b8f46"), body },
  { slug: "rooftop-terraces", title: "The best rooftop terraces for sunset", excerpt: "Seven rooftops with views over the medina — and what to order at each.", category: "Food & drink", author: authors[1]!, date: "2026-03-09", readingMinutes: 5, image: photo("photo-1528127269322-539801943592"), body },
  { slug: "zellige-masters", title: "Meet the zellige masters of Fès", excerpt: "Inside the workshops where geometric tiles are still cut by hand, one piece at a time.", category: "Culture", author: authors[0]!, date: "2026-03-02", readingMinutes: 11, image: photo("photo-1602143407151-7111542de6e8"), body },
  { slug: "tagine-guide", title: "A field guide to tagines", excerpt: "Lamb and prunes, chicken and preserved lemon, or kefta and egg? How to order like a local.", category: "Food & drink", author: authors[1]!, date: "2026-02-25", readingMinutes: 6, image: photo("photo-1590502593747-42a996133562"), body },
  { slug: "train-travel", title: "Getting around by train", excerpt: "The Al Boraq high-speed line, overnight sleepers and tips for booking the best seats.", category: "Travel tips", author: authors[0]!, date: "2026-02-18", readingMinutes: 4, image: photo("photo-1474487548417-781cb71495f3"), body },
  { slug: "chefchaouen-blue", title: "Why is Chefchaouen blue?", excerpt: "Theories abound. We asked historians, painters and the people who repaint their doors every spring.", category: "Culture", author: authors[1]!, date: "2026-02-10", readingMinutes: 7, image: photo("photo-1597212618440-806262de4f6b"), body },
];

export const sections = ["City guides", "Food & drink", "Culture", "Travel tips"] as const;

export const formatDate = (iso: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(iso));
