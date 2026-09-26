import { Badge } from "@ux-sting/react/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ux-sting/react/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Container } from "@ux-sting/react/container";
import { ClaimBusiness } from "@ux-sting/react/lead-form";
import { LocationCard } from "@ux-sting/react/location";
import { MapPlaceholder } from "@ux-sting/react/map-placeholder";
import { ImageGallery } from "@ux-sting/react/media";
import { OpeningHours, OpenStatus } from "@ux-sting/react/opening-hours";
import { PremiumBadge, VerifiedBadge } from "@ux-sting/react/premium-badge";
import { PriceLevel } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Tag } from "@ux-sting/react/tag";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { LeadCard } from "../../../components/lead-card";
import { PlaceActions } from "../../../components/place-actions";
import { places } from "../../../lib/data";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = places.find((p) => p.slug === slug);
  return place ? { title: place.name, description: place.description } : {};
}

const reviews = [
  {
    name: "Hamza El Idrissi",
    rating: 5,
    when: "2 weeks ago",
    date: "2026-03-14",
    body: "Excellent service and very welcoming staff. Everything was exactly as described, and they went out of their way to help. Will definitely come back.",
  },
  {
    name: "Claire Martin",
    rating: 4,
    when: "1 month ago",
    date: "2026-02-20",
    body: "Very good overall. It can get busy at peak times, so booking ahead is a good idea.",
  },
];

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = places.find((p) => p.slug === slug);
  if (!place) notFound();
  const photos = [0, 1, 2, 3, 4].map((i) => ({
    src: `${place.image}&sig=${i}`,
    alt: `${place.name} — photo ${i + 1}`,
  }));
  return (
    <Container className="grid gap-8 py-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NextLink href="/">Explore</NextLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NextLink href={`/search?city=${place.city.toLowerCase()}`}>{place.city}</NextLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{place.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
      <ImageGallery images={photos} layout="mosaic" columns={4} max={5} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid content-start gap-8">
          <header className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {place.premium ? <PremiumBadge /> : null}
              {place.verified ? <VerifiedBadge /> : null}
              <Badge variant="secondary">{place.category}</Badge>
            </div>
            <Heading level={1} size="2xl">
              {place.name}
            </Heading>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <ReviewStars value={place.rating} showValue count={place.reviews} />
              <PriceLevel
                level={place.priceLevel}
                label={
                  ["Inexpensive", "Moderate", "Expensive", "Very expensive"][place.priceLevel - 1]
                }
              />
              <OpenStatus periods={place.hours} />
            </div>
            <Text className="max-w-prose">{place.description}</Text>
            <div className="flex flex-wrap gap-2">
              {place.amenities.map((a) => (
                <Tag key={a}>{a}</Tag>
              ))}
            </div>
            <PlaceActions place={place} />
          </header>
          <section aria-labelledby="reviews" className="grid gap-4">
            <Heading id="reviews" level={2} size="md">
              Reviews
            </Heading>
            {reviews.map((r) => (
              <ReviewCard
                key={r.name}
                author={{ name: r.name }}
                rating={r.rating}
                date={{ display: r.when, dateTime: r.date }}
                body={r.body}
              />
            ))}
          </section>
          {!place.verified ? <ClaimBusiness businessName={place.name} href="#claim" /> : null}
        </div>
        <aside aria-label="Details" className="grid content-start gap-4">
          <LeadCard place={place} />
          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-md">
                Opening hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OpeningHours periods={place.hours} />
            </CardContent>
          </Card>
          <LocationCard
            name={place.name}
            address={`${place.address}, ${place.area}, ${place.city}`}
            directionsHref={`https://maps.google.com/?q=${encodeURIComponent(`${place.address} ${place.city}`)}`}
            map={
              <MapPlaceholder
                ratio={16 / 10}
                className="rounded-none border-0 border-b"
                label={`Map showing ${place.name}`}
                pins={[{ id: place.slug, x: 50, y: 55, label: place.name, active: true }]}
              />
            }
          />
        </aside>
      </div>
    </Container>
  );
}
