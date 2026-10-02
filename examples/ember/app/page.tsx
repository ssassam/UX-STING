import {
  CalendarDaysIcon,
  LeafIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { MapPlaceholder } from "@ux-sting/react/map-placeholder";
import { OpeningHours, OpenStatus, type OpeningPeriod } from "@ux-sting/react/opening-hours";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Tag } from "@ux-sting/react/tag";
import { Heading, Text } from "@ux-sting/react/typography";
import { DemoLinks } from "../components/demo-links";
import { Experience } from "../components/experience";
import { Hero } from "../components/hero";
import { Reservation } from "../components/reservation";
import { Section } from "../components/section";
import { SiteHeader } from "../components/site-header";
import { jsonLd, pageMeta, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "Ember is a sixteen-seat tasting-menu restaurant in Ghent: one seating a night, nine courses built around the morning's market. Reserve a table.",
});

type Dietary = "Vegetarian" | "Vegan" | "Gluten-free" | "Pescatarian";

const menu: { course: string; name: string; description: string; tags?: Dietary[] }[] = [
  {
    course: "Snack",
    name: "Sea buckthorn & brown butter cracker",
    description: "A single warm bite to open the table.",
    tags: ["Vegetarian"],
  },
  {
    course: "Amuse-bouche",
    name: "Cured mackerel, dill oil, cucumber",
    description: "Line-caught that morning, cured for six hours.",
    tags: ["Pescatarian"],
  },
  {
    course: "Bread",
    name: "Charred sourdough, cultured butter, beef fat",
    description: "Baked twice daily in the open kitchen.",
  },
  {
    course: "Starter",
    name: "Heritage tomato, burrata, basil seed oil",
    description: "From a single grower an hour outside Ghent.",
    tags: ["Vegetarian", "Gluten-free"],
  },
  {
    course: "Fish",
    name: "North Sea turbot, brown shrimp, sea aster",
    description: "Pan-roasted on the bone, finished with brown butter.",
    tags: ["Pescatarian"],
  },
  {
    course: "Cleanser",
    name: "Yuzu & elderflower granita",
    description: "A cold reset before the main course.",
    tags: ["Vegan", "Gluten-free"],
  },
  {
    course: "Main",
    name: "Dry-aged Flemish beef, bone marrow, girolles",
    description: "Aged 35 days, served with a single seasonal mushroom.",
  },
  {
    course: "Cheese",
    name: "Aged Comté, quince, walnut bread",
    description: "A small plate before dessert.",
    tags: ["Vegetarian"],
  },
  {
    course: "Dessert",
    name: "Valrhona chocolate, salted caramel, hazelnut",
    description: "The only course that hasn't changed in three years.",
    tags: ["Vegetarian"],
  },
];

const tagIcon: Partial<Record<Dietary, typeof LeafIcon>> = {
  Vegan: LeafIcon,
  Vegetarian: LeafIcon,
};

const periods: OpeningPeriod[] = [
  { day: 2, open: "18:00", close: "23:00" },
  { day: 3, open: "18:00", close: "23:00" },
  { day: 4, open: "18:00", close: "23:00" },
  { day: 5, open: "18:00", close: "23:30" },
  { day: 6, open: "18:00", close: "23:30" },
];

const reviews = [
  {
    author: { name: "Freja L." },
    rating: 5,
    title: "Worth the three-month wait",
    body: "Every course had a reason to exist. The turbot alone was worth the trip from Brussels. Service explained each plate without ever feeling scripted.",
    date: { display: "September 2026", dateTime: "2026-09-12" },
  },
  {
    author: { name: "Mateo R.", subtitle: "Chef's counter" },
    rating: 5,
    title: "The counter seats are the move",
    body: "Sat right at the pass for the 12-course menu. Watching the kitchen work in near silence for two hours was its own kind of entertainment.",
    date: { display: "August 2026", dateTime: "2026-08-03" },
    footer: (
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Ember says:</span> Thank you, Mateo — see
        you again when the girolles are back.
      </p>
    ),
  },
  {
    author: { name: "Anneke V." },
    rating: 4,
    title: "Excellent, slightly rushed dessert",
    body: "Nine courses in two hours is tight for a kitchen this good. The chocolate course arrived a little quickly after the cheese, but everything else was close to perfect.",
    date: { display: "July 2026", dateTime: "2026-07-21" },
  },
];

const faqs = [
  {
    q: "Can you cater to allergies and dietary restrictions?",
    a: "Yes — tell us when you book or add a note to your reservation. We rebuild affected courses rather than simply removing an ingredient.",
  },
  {
    q: "Is there a dress code?",
    a: "Smart casual. No trainers or shorts in the dining room; the chef's counter is a little more relaxed.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free cancellation up to 48 hours before your seating. Later changes can usually move to another night.",
  },
  {
    q: "Do you offer a non-alcoholic pairing?",
    a: "Yes, a six-glass non-alcoholic pairing is available at the same price as the wine pairing — just ask when you arrive.",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="grid gap-24 pb-8 outline-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Ember",
            description: "Sixteen-seat tasting-menu restaurant in Ghent, one seating a night.",
            url: SITE_URL,
            servesCuisine: "Tasting menu",
            priceRange: "€€€€",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Jan Breydelstraat 4",
              addressLocality: "Ghent",
              addressCountry: "BE",
            },
            telephone: "+32 9 123 45 67",
            openingHoursSpecification: periods.map((p) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ][p.day],
              opens: p.open,
              closes: p.close,
            })),
          })}
        />
        <Hero />
        <Section
          id="menu"
          title="Tonight's tasting menu"
          intro="Nine courses, changed with the market. Wine pairing +€65, non-alcoholic pairing +€65."
          className="scroll-mt-24"
        >
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {menu.map((dish, i) => (
              <li
                key={dish.name}
                className="grid content-start gap-2 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-muted-foreground">{dish.course}</span>
                </div>
                <h3 className="font-semibold text-balance">{dish.name}</h3>
                <Text size="sm" variant="muted">
                  {dish.description}
                </Text>
                {dish.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dish.tags.map((tag) => {
                      const Icon = tagIcon[tag];
                      return (
                        <Tag key={tag} size="sm" icon={Icon ? <Icon /> : undefined}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </Section>
        <Section
          id="experience"
          title="Three ways to dine"
          intro="The same menu, three different seats."
          className="scroll-mt-24"
        >
          <Experience />
        </Section>
        <section id="reserve" aria-labelledby="reserve-title" className="scroll-mt-20 bg-muted/40 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6">
            <div className="grid gap-2 text-center">
              <Heading level={2} size="2xl" id="reserve-title">
                Reserve your table
              </Heading>
              <Text variant="muted">No card required. We hold your table for 15 minutes.</Text>
            </div>
            <Reservation />
          </div>
        </section>
        <Section id="hours" title="Find us" className="scroll-mt-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid gap-6">
              <div className="grid gap-3 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Opening hours</h3>
                  <OpenStatus periods={periods} />
                </div>
                <OpeningHours periods={periods} caption="Ember opening hours" />
              </div>
              <ul className="grid gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPinIcon aria-hidden className="size-4 text-primary" />
                  Jan Breydelstraat 4, 9000 Ghent, Belgium
                </li>
                <li className="flex items-center gap-2">
                  <PhoneIcon aria-hidden className="size-4 text-primary" />
                  <a href="tel:+3291234567" className="hover:underline">
                    +32 9 123 45 67
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon aria-hidden className="size-4 text-primary" />
                  <a href="mailto:table@ember.example" className="hover:underline">
                    table@ember.example
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDaysIcon aria-hidden className="size-4 text-primary" />
                  Reservations open 60 days ahead
                </li>
              </ul>
            </div>
            <MapPlaceholder
              label="Map showing Ember's location in central Ghent"
              ratio={4 / 3}
              pins={[{ id: "ember", x: 50, y: 50, label: "Ember", active: true }]}
            />
          </div>
        </Section>
        <Section id="reviews" title="What guests say" className="scroll-mt-24">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.author.name}>
                <ReviewCard {...r} className="h-full" />
              </li>
            ))}
          </ul>
        </Section>
        <Section id="faq" title="Questions" className="scroll-mt-24">
          <Accordion type="single" collapsible variant="separated" className="max-w-3xl">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger headingLevel={3}>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-2">
            <p className="text-lg font-bold">Ember</p>
            <Text size="sm" variant="muted" className="max-w-md">
              Ember is a fictional restaurant. This page is a UX-STING reservation-page template —
              no bookings are taken.
            </Text>
          </div>
          <DemoLinks current="ember" />
        </div>
        <div className="border-t border-border" />
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          Built with the{" "}
          <a
            href="https://github.com/ssassam/UX-STING"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm font-medium text-foreground underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            UX-STING design system
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </p>
      </footer>
    </>
  );
}
