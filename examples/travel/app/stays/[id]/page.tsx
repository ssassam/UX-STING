import { BathIcon, BedIcon, CheckIcon, MapPinIcon, UsersIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { List, ListItem } from "@ux-sting/react/list";
import { LocationCard } from "@ux-sting/react/location";
import { MapPlaceholder } from "@ux-sting/react/map-placeholder";
import { ImageGallery } from "@ux-sting/react/media";
import { FeaturedBadge } from "@ux-sting/react/premium-badge";
import { Currency, Price } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Separator } from "@ux-sting/react/separator";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingCard } from "../../../components/booking-card";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { StayCard } from "../../../components/stay-card";
import { CURRENCY, getDestination, getStay, stays, testimonials } from "../../../lib/data";
import { absolute, jsonLd, pageMeta } from "../../../lib/seo";

export function generateStaticParams() {
  return stays.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const s = getStay((await params).id);
  return s
    ? pageMeta({
        title: s.name,
        description: s.description,
        path: `stays/${s.id}`,
        image: { url: s.image.src, alt: s.image.alt },
      })
    : {};
}

export default async function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const stay = getStay((await params).id);
  if (!stay) notFound();
  const d = getDestination(stay.destination)!;
  const photos = [stay.image, ...d.gallery.filter((p) => p !== stay.image)]
    .slice(0, 5)
    .map((p) => ({ src: p.src, alt: p.alt }));
  const nearby = stays
    .filter((s) => s.destination === stay.destination && s.id !== stay.id)
    .slice(0, 3);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-28 pt-8 sm:px-6 lg:pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: stay.name,
          description: stay.description,
          image: stay.image.src,
          url: absolute(`stays/${stay.id}`),
          starRating: { "@type": "Rating", ratingValue: stay.stars },
          priceRange: `From €${stay.nightly} per night`,
          address: {
            "@type": "PostalAddress",
            addressLocality: `${stay.area}, ${d.name}`,
            addressCountry: d.country,
          },
          amenityFeature: stay.amenities.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a,
            value: true,
          })),
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: d.name, href: `/destinations/${d.slug}` },
          { label: "Stays", href: `/search?destination=${d.slug}` },
          { label: stay.name },
        ]}
      />
      <header className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            {stay.type} · {stay.stars}-star
          </Badge>
          {stay.featured ? <FeaturedBadge size="sm">Guest favourite</FeaturedBadge> : null}
          {stay.freeCancellation ? <Badge variant="success">Free cancellation</Badge> : null}
        </div>
        <Heading level={1} size="3xl">
          {stay.name}
        </Heading>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <ReviewStars value={stay.rating} count={stay.reviews} showValue />
          <Text variant="muted" className="flex items-center gap-1">
            <MapPinIcon aria-hidden className="size-4" /> {stay.area}, {d.name} · {stay.distance}
          </Text>
        </div>
      </header>

      <ImageGallery images={photos} layout="mosaic" columns={3} max={5} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid content-start gap-10">
          <section aria-labelledby="about-title" className="grid gap-3">
            <Heading level={2} size="lg" id="about-title">
              About this stay
            </Heading>
            <Text className="max-w-prose text-pretty">{stay.description}</Text>
          </section>
          <section aria-labelledby="amenities-title" className="grid gap-3">
            <Heading level={2} size="lg" id="amenities-title">
              What this place offers
            </Heading>
            <ul className="grid gap-2 sm:grid-cols-2">
              {stay.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <CheckIcon aria-hidden className="size-4 text-success" /> {a}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="rooms-title" className="grid gap-3">
            <Heading level={2} size="lg" id="rooms-title">
              Rooms
            </Heading>
            <List variant="bordered">
              {stay.rooms.map((r) => (
                <ListItem
                  key={r.id}
                  start={<BedIcon aria-hidden className="size-5 text-muted-foreground" />}
                  title={r.name}
                  description={
                    <span className="inline-flex flex-wrap gap-x-3">
                      <span>{r.beds}</span>
                      <span className="inline-flex items-center gap-1">
                        <UsersIcon aria-hidden className="size-3.5" /> Up to {r.guests}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BathIcon aria-hidden className="size-3.5" /> Private bathroom
                      </span>
                    </span>
                  }
                  end={
                    <span className="text-end text-sm">
                      <Currency
                        value={r.price}
                        currency={CURRENCY}
                        fractionDigits={0}
                        className="font-semibold text-foreground"
                      />
                      <span className="block text-muted-foreground">per night</span>
                    </span>
                  }
                />
              ))}
            </List>
          </section>
          <section aria-labelledby="reviews-title" className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Heading level={2} size="lg" id="reviews-title">
                Guest reviews
              </Heading>
              <ReviewStars value={stay.rating} count={stay.reviews} showValue />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.slice(0, 2).map((t) => (
                <ReviewCard
                  key={t.name}
                  author={{ name: t.name, subtitle: "Verified stay" }}
                  rating={t.rating}
                  date={{ display: t.display, dateTime: t.date }}
                  body={t.body}
                />
              ))}
            </div>
          </section>
          <section aria-labelledby="location-title" className="grid gap-3">
            <Heading level={2} size="lg" id="location-title">
              Location
            </Heading>
            <LocationCard
              name={stay.name}
              address={`${stay.area}, ${d.name}, ${d.country}`}
              distance={stay.distance}
              directionsHref={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${stay.area} ${d.name}`)}`}
              map={
                <MapPlaceholder
                  label={`Map showing ${stay.name}`}
                  ratio={16 / 7}
                  pins={[
                    { id: stay.id, label: stay.name, x: stay.pin.x, y: stay.pin.y, active: true },
                  ]}
                />
              }
            />
          </section>
        </div>
        <BookingCard stay={stay} />
      </div>

      {nearby.length ? (
        <>
          <Separator />
          <section aria-labelledby="nearby-title" className="grid gap-4">
            <Heading level={2} size="lg" id="nearby-title">
              More stays in {d.name}
            </Heading>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((s) => (
                <li key={s.id} className="grid">
                  <StayCard stay={s} />
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-(--ui-z-sticky) flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur lg:hidden">
        <div className="grid">
          <Price amount={stay.nightly} currency={CURRENCY} period="/ night" fractionDigits={0} />
          <span className="text-xs text-muted-foreground">
            {stay.freeCancellation ? "Free cancellation" : "Non-refundable rate"}
          </span>
        </div>
        <Button asChild size="lg">
          <a href="#booking">Check availability</a>
        </Button>
      </div>
    </div>
  );
}
