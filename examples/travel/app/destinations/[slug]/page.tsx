import { CheckIcon, MapPinIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ux-sting/react/card";
import { MapPlaceholder } from "@ux-sting/react/map-placeholder";
import { ImageGallery } from "@ux-sting/react/media";
import { ReviewStars } from "@ux-sting/react/rating";
import { Stat, StatGroup } from "@ux-sting/react/stat";
import { EmptyState } from "@ux-sting/react/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { StayCard } from "../../../components/stay-card";
import { TourCard } from "../../../components/tour-card";
import { destinations, getDestination, staysIn, toursIn, tripStyles } from "../../../lib/data";
import { pageMeta } from "../../../lib/seo";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const d = getDestination((await params).slug);
  return d
    ? pageMeta({
        title: `${d.name}, ${d.country} — travel guide, stays and tours`,
        description: `${d.tagline}. ${d.description}`,
        path: `destinations/${d.slug}`,
        image: { url: d.image.src, alt: d.image.alt },
      })
    : {};
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDestination((await params).slug);
  if (!d) notFound();
  const stays = staysIn(d.slug);
  const tours = toursIn(d.slug);
  const images = d.gallery.map((p) => ({ src: p.src, alt: p.alt }));

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: d.name },
        ]}
      />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            {d.styles.map((s) => (
              <Badge key={s} variant="primary">
                {tripStyles.find((t) => t.id === s)?.name}
              </Badge>
            ))}
          </div>
          <Heading level={1} size="3xl">
            {d.name}
          </Heading>
          <Text variant="muted" className="flex items-center gap-1">
            <MapPinIcon aria-hidden className="size-4" /> {d.country} · {d.tagline}
          </Text>
          <ReviewStars value={d.rating} count={d.reviews} showValue />
        </div>
        <Button asChild size="lg">
          <NextLink href={`/search?destination=${d.slug}`}>See stays in {d.name}</NextLink>
        </Button>
      </header>

      <ImageGallery images={images} layout="mosaic" columns={3} max={5} />

      <StatGroup>
        <Stat label="Best time to visit" value={d.bestTime} />
        <Stat label="Flight from Paris" value={`${d.flightHours} h`} />
        <Stat label="Average temperature" value={`${d.avgTemp} °C`} />
        <Stat label="Currency" value={d.currency} />
      </StatGroup>

      <Tabs defaultValue="overview" variant="line">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stays">Stays ({stays.length})</TabsTrigger>
          <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="grid content-start gap-4">
              <Heading level={2} size="lg">
                About {d.name}
              </Heading>
              <Text className="max-w-prose text-pretty">{d.description}</Text>
              <Heading level={3} size="md">
                Don&apos;t miss
              </Heading>
              <ul className="grid gap-2 sm:grid-cols-2">
                {d.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle as="h2">Good to know</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm">
                  {[
                    ["Language", d.language],
                    ["Currency", d.currency],
                    ["Region", d.region],
                    ["Stays from", `€${d.fromPrice} / night`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-end font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="stays" className="pt-6">
          {stays.length ? (
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stays.map((s) => (
                <li key={s.id} className="grid">
                  <StayCard stay={s} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              title="No stays listed yet"
              description="Check back soon."
            />
          )}
        </TabsContent>
        <TabsContent value="tours" className="pt-6">
          {tours.length ? (
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t) => (
                <li key={t.id} className="grid">
                  <TourCard tour={t} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              title="No guided tours here yet"
              description="Browse tours in other destinations."
              actions={
                <Button asChild variant="outline">
                  <NextLink href="/tours">All tours</NextLink>
                </Button>
              }
            />
          )}
        </TabsContent>
        <TabsContent value="map" className="pt-6">
          <MapPlaceholder
            label={`Map of stays in ${d.name}`}
            ratio={16 / 7}
            pins={stays.map((s) => ({ id: s.id, label: s.name, x: s.pin.x, y: s.pin.y }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
