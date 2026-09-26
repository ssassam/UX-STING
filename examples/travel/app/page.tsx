import {
  HeadphonesIcon,
  LandmarkIcon,
  MountainIcon,
  ShieldCheckIcon,
  ShipIcon,
  SparklesIcon,
  TentIcon,
  TreePalmIcon,
  Building2Icon,
  WalletIcon,
} from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { Button } from "@ux-sting/react/button";
import { CategoryCard, CityCard } from "@ux-sting/react/category-card";
import { Stat, StatGroup } from "@ux-sting/react/stat";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { HeroSearch } from "../components/hero-search";
import { Newsletter } from "../components/newsletter";
import { Section } from "../components/section";
import { StayCard } from "../components/stay-card";
import { Testimonials } from "../components/testimonials";
import { TourCard } from "../components/tour-card";
import { destinations, faqs, stays, tours, tripStyles, type TripStyle } from "../lib/data";
import { photos, sized } from "../lib/photos";

const styleIcons: Record<TripStyle, ReactNode> = {
  beach: <TreePalmIcon />,
  mountains: <MountainIcon />,
  city: <Building2Icon />,
  culture: <LandmarkIcon />,
  adventure: <TentIcon />,
  cruise: <ShipIcon />,
};

const promises = [
  {
    icon: <ShieldCheckIcon />,
    title: "Free cancellation",
    body: "On most stays until 48 hours before check-in.",
  },
  {
    icon: <WalletIcon />,
    title: "No hidden fees",
    body: "Prices include taxes and service fees upfront.",
  },
  {
    icon: <HeadphonesIcon />,
    title: "24/7 travel support",
    body: "Real people by chat or phone, in three languages.",
  },
  {
    icon: <SparklesIcon />,
    title: "Hand-picked quality",
    body: "Every stay and tour is reviewed by our local experts.",
  },
];

export default function HomePage() {
  const featured = stays.filter((s) => s.featured).slice(0, 4);
  return (
    <div className="grid gap-20 pb-8">
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <img
          src={photos.hero.src}
          alt=""
          className="absolute inset-0 -z-20 size-full bg-muted object-cover"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        />
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-16 pt-20 text-white sm:px-6 md:pb-24 md:pt-28">
          <div className="grid max-w-3xl gap-4">
            <Text size="sm" weight="semibold" className="uppercase tracking-widest text-white/90">
              Stays · Tours · Destinations
            </Text>
            <h1
              id="hero-title"
              className="text-4xl font-bold leading-tight text-balance md:text-6xl"
            >
              Find your next unforgettable journey
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Hand-picked stays and small-group tours in 80+ countries, with free cancellation on
              most bookings.
            </p>
          </div>
          <HeroSearch />
          <StatGroup className="max-w-2xl text-white [&_dd]:text-white [&_dt]:text-white/85">
            <Stat label="Travellers hosted" value="2.4M" />
            <Stat label="Average rating" value="4.8/5" />
            <Stat label="Destinations" value="80+" />
          </StatGroup>
        </div>
      </section>

      <Section
        id="destinations"
        title="Popular destinations"
        intro="Where our travellers are heading this season."
        href="/destinations"
        hrefLabel="All destinations"
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {destinations.slice(0, 8).map((d) => (
            <li key={d.slug}>
              <CityCard
                name={d.name}
                href={`/destinations/${d.slug}`}
                image={{ src: sized(d.image, 960), alt: "" }}
                count={`${d.country} · from €${d.fromPrice}`}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="styles" title="Travel your way" intro="Browse trips by the experience you want.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tripStyles.map((s) => (
            <li key={s.id}>
              <CategoryCard
                name={s.name}
                href={`/destinations?style=${s.id}`}
                icon={styleIcons[s.id]}
                count={`${s.count} trips`}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="stays"
        title="Guest favourites"
        intro="Top-rated stays with flexible booking."
        href="/search"
        hrefLabel="Browse all stays"
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <li key={s.id} className="grid">
              <StayCard stay={s} />
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="promise-title" className="bg-primary-subtle py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 sm:px-6">
          <Heading level={2} size="xl" id="promise-title" className="text-balance">
            Book with confidence
          </Heading>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => (
              <li key={p.title} className="grid content-start gap-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-background text-primary [&_svg]:size-5">
                  {p.icon}
                </span>
                <h3 className="font-semibold text-primary-subtle-foreground">{p.title}</h3>
                <Text size="sm" className="text-primary-subtle-foreground/85">
                  {p.body}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section
        id="tours"
        title="Small-group tours"
        intro="Expert local guides, groups of 12 or fewer."
        href="/tours"
        hrefLabel="All tours"
      >
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((t) => (
            <li key={t.id} className="grid">
              <TourCard tour={t} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="reviews"
        title="Loved by travellers"
        intro="Rated 4.8 out of 5 from 58,000+ reviews."
      >
        <Testimonials />
      </Section>

      <Section id="faq" title="Frequently asked questions">
        <Accordion type="single" collapsible variant="separated" className="max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger headingLevel={3}>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <section aria-labelledby="news-title" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-2 md:items-center md:p-10">
          <div className="grid gap-2">
            <Heading level={2} size="xl" id="news-title">
              Get travel deals first
            </Heading>
            <Text variant="muted">
              One email a fortnight with flash sales and new destinations. Unsubscribe anytime.
            </Text>
          </div>
          <Newsletter />
        </div>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="link">
            <NextLink href="/trips">Already booked? Manage your trips</NextLink>
          </Button>
        </div>
      </section>
    </div>
  );
}
