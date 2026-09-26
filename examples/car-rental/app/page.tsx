import {
  BadgeCheckIcon,
  Building2Icon,
  CarIcon,
  ClockIcon,
  HeadphonesIcon,
  KeyRoundIcon,
  MapPinIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  TrainFrontIcon,
  TruckIcon,
  ZapIcon,
  CrownIcon,
  MountainIcon,
} from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { CategoryCard } from "@ux-sting/react/category-card";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Heading, Text } from "@ux-sting/react/typography";
import type { ReactNode } from "react";
import { CarCard } from "../components/car-card";
import { SearchForm } from "../components/search-form";
import { Section } from "../components/section";
import { withBase } from "../lib/base";
import { cars, categories, faqs, locations, reviews, type Category } from "../lib/data";
import { photos } from "../lib/photos";
import { jsonLd, pageMeta, SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "Rent economy, electric, premium and family cars across France with unlimited kilometres, free cancellation and contactless pick-up.",
});

const categoryIcons: Record<Category, ReactNode> = {
  economy: <CarIcon />,
  compact: <KeyRoundIcon />,
  electric: <ZapIcon />,
  premium: <CrownIcon />,
  suv: <MountainIcon />,
  van: <TruckIcon />,
};

const steps = [
  {
    icon: <SmartphoneIcon />,
    title: "Book in 60 seconds",
    body: "Pick dates, a car and extras. Pay at pick-up or now.",
  },
  {
    icon: <KeyRoundIcon />,
    title: "Skip the counter",
    body: "Check in online and unlock the car with the app.",
  },
  {
    icon: <CarIcon />,
    title: "Drive unlimited",
    body: "Unlimited kilometres, roadside assistance included.",
  },
  {
    icon: <ClockIcon />,
    title: "Return in minutes",
    body: "Park, photograph the car, drop the key. Done.",
  },
];

const promises = [
  { icon: <ShieldCheckIcon />, title: "Free cancellation", body: "Up to 48 hours before pick-up." },
  {
    icon: <BadgeCheckIcon />,
    title: "Price match",
    body: "Found it cheaper? We refund the difference.",
  },
  {
    icon: <HeadphonesIcon />,
    title: "24/7 roadside help",
    body: "One tap in the app, anywhere in Europe.",
  },
];

export default function HomePage() {
  const popular = cars.filter((c) => c.popular);
  return (
    <div className="grid gap-20 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: "Car rental across France.",
            },
            { "@type": "AutoRental", name: SITE_NAME, url: SITE_URL, areaServed: "FR" },
          ],
        })}
      />
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <img
          src={photos.hero.src}
          alt=""
          className="absolute inset-0 -z-20 size-full bg-muted object-cover"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/45 to-black/70"
        />
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-12 pt-12 text-white sm:px-6 sm:pt-20 md:pb-24 md:pt-28">
          <div className="grid max-w-3xl gap-4">
            <h1
              id="hero-title"
              className="text-4xl font-bold leading-tight text-balance md:text-6xl"
            >
              The open road, without the queue
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Rent from 12 models across France — unlimited kilometres, free cancellation and
              contactless pick-up.
            </p>
          </div>
          <SearchForm />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
            {promises.map((p) => (
              <li key={p.title} className="flex items-center gap-2 [&_svg]:size-4">
                <span aria-hidden>{p.icon}</span>
                <span>
                  <strong className="font-semibold text-white">{p.title}</strong> · {p.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section
        id="categories"
        title="Find the right car"
        intro="From city runabouts to 9-seat vans."
        href="/cars"
        hrefLabel="See the whole fleet"
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <CategoryCard
                name={c.name}
                href={withBase(`/cars/?category=${c.id}`)}
                icon={categoryIcons[c.id]}
                count={c.description}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="popular"
        title="Most booked this month"
        intro="Prices per day, taxes included."
        href="/cars"
        hrefLabel="All cars"
      >
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {popular.map((c) => (
            <li key={c.id} className="grid w-[80%] shrink-0 snap-start sm:w-auto">
              <CarCard car={c} />
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="how-title" className="bg-primary-subtle py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6">
          <Heading level={2} size="xl" id="how-title">
            How Drivo works
          </Heading>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="grid content-start gap-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-background text-primary [&_svg]:size-5">
                  {s.icon}
                </span>
                <h3 className="font-semibold text-primary-subtle-foreground">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <Text size="sm" className="text-primary-subtle-foreground/85">
                  {s.body}
                </Text>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section
        id="locations"
        title="Pick up where you land"
        intro="Airports, stations and city centres across France."
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <li
              key={l.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:size-5">
                {l.type === "Airport" ? (
                  <PlaneIcon aria-hidden />
                ) : l.type === "City" ? (
                  <Building2Icon aria-hidden />
                ) : (
                  <TrainFrontIcon aria-hidden />
                )}
              </span>
              <div className="grid min-w-0 gap-0.5">
                <p className="font-medium">{l.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPinIcon aria-hidden className="size-3.5" /> {l.type} · Open {l.hours}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="reviews" title="Drivers love Drivo" intro="4.8 out of 5 from 31,000+ rentals.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.name} className="grid">
              <ReviewCard
                author={{ name: r.name, subtitle: r.trip }}
                rating={r.rating}
                date={{ display: r.display, dateTime: r.date }}
                body={r.body}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Good to know">
        <Accordion type="single" collapsible variant="separated" className="max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger headingLevel={3}>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </div>
  );
}
