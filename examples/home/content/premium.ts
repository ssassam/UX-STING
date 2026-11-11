/**
 * PREMIUM TEMPLATES FOR SALE — fill this list and redeploy (push to main).
 *
 * Each entry renders as a card in the "Premium templates" section. Leave the list empty and the
 * section shows a "first drop coming soon" notice with a get-notified link instead.
 *
 * - image: put a 1280×800 screenshot in public/templates/ and reference it as "templates/<file>.webp"
 * - price: number in `currency`; omit it to show "Price on request"
 * - buyUrl: checkout link (Gumroad, Lemon Squeezy, Stripe Payment Link…); omit it to fall back to email
 * - demoUrl: live preview (optional)
 */
export interface PremiumTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  buyUrl?: string;
  demoUrl?: string;
  /** Short bullet list of what is included. */
  includes?: string[];
}

export const premiumTemplates: PremiumTemplate[] = [
  // {
  //   id: "agency",
  //   name: "Studio — agency site",
  //   category: "Marketing",
  //   description: "Case studies, services, team and contact, with a Sanity-ready content layer.",
  //   image: "templates/agency.webp",
  //   price: 79,
  //   currency: "USD",
  //   buyUrl: "https://…",
  //   demoUrl: "https://…",
  //   includes: ["Next.js 16 source", "Light + dark themes", "Lifetime updates"],
  // },
];

/** Where "get notified" / "price on request" / white-label enquiries go. */
export const CONTACT_EMAIL = "contact@veltein.com";
