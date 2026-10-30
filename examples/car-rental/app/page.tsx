import { AnimatedIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import {
  Building2Icon,
  CarIcon,
  CrownIcon,
  KeyRoundIcon,
  MountainIcon,
  PlaneIcon,
  ShieldCheckIcon,
  TrainFrontIcon,
  TruckIcon,
  ZapIcon,
} from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { Badge } from "@ux-sting/react/badge";
import { CategoryCard } from "@ux-sting/react/category-card";
import { Reveal } from "@ux-sting/react/reveal";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Text } from "@ux-sting/react/typography";
import type { ReactNode } from "react";
import { CarCard } from "../components/car-card";
import { Hero } from "../components/hero";
import { Section } from "../components/section";
import { SearchForm } from "../components/search-form";
import { StagesSection } from "../components/stages-section";
import { withBase } from "../lib/base";
import { cars, categories, faqs, locations, protection, reviews, type Category } from "../lib/data";
import { jsonLd, pageMeta, SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "Twelve models at six arrival desks across France, two open around the clock. Unlimited kilometres, keys in the app, free cancellation up to 48 hours.",
});

/** Category tiles carry the animated icon layer: hover the tile, the mark answers. */
const categoryIcons: Record<Category, ReactNode> = {
  economy: <AnimatedIcon icon={CarIcon} preset="nudge" />,
  compact: <AnimatedIcon icon={KeyRoundIcon} preset="draw" />,
  electric: <AnimatedIcon icon={ZapIcon} preset="flash" />,
  premium: <AnimatedIcon icon={CrownIcon} preset="twinkle" />,
  suv: <AnimatedIcon icon={MountainIcon} preset="shift" />,
  van: <AnimatedIcon icon={TruckIcon} preset="launch" />,
};

const locationIcons = {
  Airport: <AnimatedIcon icon={PlaneIcon} preset="launch" />,
  City: <AnimatedIcon icon={Building2Icon} preset="peek" />,
  "Train station": <AnimatedIcon icon={TrainFrontIcon} preset="shift" />,
} as const;

export default function HomePage() {
  const popular = cars.filter((c) => c.popular);
  const cheapest = Math.min(...cars.map((c) => c.pricePerDay));
  const maxDeposit = Math.max(...cars.map((c) => c.deposit));
  const nightDesks = locations.filter((l) => l.hours === "24/7").length;

  return (
    <div className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: "Car rental at the arrival hall, across France.",
            },
            { "@type": "AutoRental", name: SITE_NAME, url: SITE_URL, areaServed: "FR" },
          ],
        })}
      />

      <Hero search={<SearchForm />} />

      <Section
        id="categories"
        index="01"
        kicker="Six ways to drive"
        title="Find the right car"
        intro="From a 3-door city car to a nine-seat minibus. Every category includes unlimited kilometres."
        href="/cars"
        hrefLabel="See the whole fleet"
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <li key={c.id} className={ICON_ANCHOR_CLASS}>
              <Reveal delay={i * 50} preset="fade">
                <CategoryCard
                  name={c.name}
                  href={withBase(`/cars/?category=${c.id}`)}
                  icon={categoryIcons[c.id]}
                  count={c.description}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="popular"
        index="02"
        kicker="Most booked this month"
        title="The fleet, priced per day"
        intro="Taxes and unlimited kilometres included. From €29 a day."
        href="/cars"
        hrefLabel="All cars"
        className="bg-surface"
      >
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {popular.map((c, i) => (
            <li key={c.id} className="fleet-card grid w-[80%] shrink-0 snap-start sm:w-auto">
              <Reveal delay={i * 60} preset="slide-up">
                <CarCard car={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <StagesSection />

      <Section
        id="locations"
        index="04"
        kicker="Where the keys are"
        title="Pick up where you land"
        intro="Airports, TGV stations and the city centre. Two of them never close."
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l, i) => (
            <li key={l.id} className={ICON_ANCHOR_CLASS}>
              <Reveal delay={i * 45} preset="slide-start">
                <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:size-5">
                    {locationIcons[l.type as keyof typeof locationIcons]}
                  </span>
                  <div className="grid min-w-0 gap-1">
                    <p className="font-display font-semibold">{l.name}</p>
                    <p className="roadbook-label text-muted-foreground">
                      {l.type} · {l.city}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      {l.hours === "24/7" ? (
                        <Badge variant="success" className="gap-1">
                          <ShieldCheckIcon aria-hidden className="size-3" /> Open all night
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Open {l.hours}</span>
                      )}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="roadbook-label mt-4 text-muted-foreground">
          Nice Côte d’Azur desk · 40 minutes from the Col de Turini, 14 hairpins, 1 614 m
        </p>
      </Section>

      <Section
        id="deposit"
        index="05"
        kicker="The number that decides"
        title="Deposits and protection, in the open"
        intro="The deposit is held on the card, released the day you return the car. Protection decides how much of it is ever at risk."
        className="bg-surface"
        bodyClassName="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10"
      >
        <dl className="grid gap-6 rounded-xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
          <div className="grid gap-1">
            <dt className="roadbook-label text-muted-foreground">
              Deposit, smallest to largest car
            </dt>
            <dd className="font-display flex items-baseline gap-2 text-3xl font-bold tabular-nums">
              <span>
                <AnimatedNumber value={500} /> €
              </span>
              <span aria-hidden>→</span>
              <span>
                <AnimatedNumber value={maxDeposit} /> €
              </span>
            </dd>
          </div>
          <div className="grid gap-1 border-t border-border pt-4">
            <dt className="roadbook-label text-muted-foreground">Cheapest day in the fleet</dt>
            <dd className="font-display text-3xl font-bold tabular-nums">
              <AnimatedNumber value={cheapest} /> €
            </dd>
          </div>
          <div className="grid gap-1 border-t border-border pt-4">
            <dt className="roadbook-label text-muted-foreground">Desks open around the clock</dt>
            <dd className="font-display text-3xl font-bold">
              <AnimatedNumber value={nightDesks} /> of {locations.length}
            </dd>
          </div>
        </dl>

        <ul className="grid gap-3 sm:grid-cols-3">
          {protection.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 70} preset="scale">
                <div
                  className={`flex h-full flex-col gap-2 rounded-xl border p-4 ${
                    p.id === "full"
                      ? "border-primary/45 bg-primary-subtle text-primary-subtle-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="roadbook-label flex items-center justify-between">
                    {p.name}
                    {p.id === "full" ? <Badge>Zero excess</Badge> : null}
                  </p>
                  <p className="font-display text-2xl font-bold tabular-nums">
                    {p.perDay === 0 ? (
                      "Included"
                    ) : (
                      <>
                        <AnimatedNumber value={p.perDay} /> €
                        <span className="text-sm font-medium"> / day</span>
                      </>
                    )}
                  </p>
                  <Text size="sm" className="mt-auto">
                    {p.description}
                  </Text>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="reviews"
        index="06"
        kicker="4.8 out of 5"
        title="What drivers say afterwards"
        intro="From 31 000+ rentals since 2021, collected after the car is back."
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.name} className="grid">
              <Reveal delay={i * 70} preset="slide-up">
                <ReviewCard
                  author={{ name: r.name, subtitle: r.trip }}
                  rating={r.rating}
                  date={{ display: r.display, dateTime: r.date }}
                  body={r.body}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" index="07" kicker="Good to know" title="Before you book">
        <Accordion type="single" collapsible variant="separated" className="max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger headingLevel={3}>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <CtaBand />
    </div>
  );
}

/** Closing band on the brand field: the logo reversed on signal red. */
function CtaBand() {
  return (
    <section
      aria-labelledby="cta-title"
      className="border-t border-border bg-primary px-4 py-14 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div className="grid gap-1">
          <p className="roadbook-label text-primary-foreground">Stage 00 · the start</p>
          <h2
            id="cta-title"
            className="font-display text-3xl font-bold text-balance text-primary-foreground sm:text-4xl"
          >
            Tell us where you land. We will have a car in the bay.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={withBase("/cars")}
            className="font-display inline-flex items-center gap-2 rounded-sm bg-background px-5 py-3 text-sm font-semibold text-foreground outline-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Browse the fleet
          </a>
          <a
            href={withBase("/#locations")}
            className="font-display inline-flex items-center gap-2 rounded-sm border border-primary-foreground/40 px-5 py-3 text-sm font-semibold text-primary-foreground outline-none hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            See the six desks
          </a>
        </div>
      </div>
    </section>
  );
}
