import { GaugeIcon } from "@ux-sting/icons";
import { AnimatedCheckIcon, AnimatedIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Reveal } from "@ux-sting/react/reveal";
import { Image } from "@ux-sting/react/media";
import { Price } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Separator } from "@ux-sting/react/separator";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { CarCard } from "../../../components/car-card";
import { CarSpecs } from "../../../components/car-specs";
import { RentalCard } from "../../../components/rental-card";
import { cars, categories, CURRENCY, getCar, reviews } from "../../../lib/data";
import { absolute, jsonLd, pageMeta } from "../../../lib/seo";

export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const c = getCar((await params).id);
  return c
    ? pageMeta({
        title: `Rent a ${c.name}`,
        description: `${c.name} ${c.similar} from €${c.pricePerDay}/day: ${c.seats} seats, ${c.transmission.toLowerCase()}, ${c.fuel.toLowerCase()}. Unlimited kilometres and free cancellation.`,
        path: `cars/${c.id}`,
        image: { url: c.photo.src, alt: c.photo.alt },
      })
    : {};
}

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const car = getCar((await params).id);
  if (!car) notFound();
  const category = categories.find((c) => c.id === car.category)!;
  const similar = cars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-28 pt-8 sm:px-6 lg:pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${car.name} rental`,
          description: `${car.name} ${car.similar}. ${car.seats} seats, ${car.transmission}, ${car.fuel}.`,
          image: car.photo.src,
          url: absolute(`cars/${car.id}`),
          brand: { "@type": "Brand", name: "Drivo" },
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: car.pricePerDay,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: car.pricePerDay,
              priceCurrency: "EUR",
              unitCode: "DAY",
            },
            availability: "https://schema.org/InStock",
          },
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Fleet", href: "/cars" },
          { label: category.name, href: `/cars?category=${category.id}` },
          { label: car.name },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid content-start gap-8">
          <header className="grid gap-3">
            <p className="roadbook-label text-primary">
              <span className="text-muted-foreground">STAGE 09</span> · {category.name} ·{" "}
              {car.seats} seats
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Heading level={1} size="3xl" className="font-display text-balance tracking-tight">
                {car.name}
              </Heading>
              <ReviewStars value={car.rating} count={car.reviews} showValue />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{category.name}</Badge>
              <Badge variant="success">Unlimited km</Badge>
              {car.fuel === "Electric" ? <Badge variant="success">Electric</Badge> : null}
            </div>
            <Text variant="muted">{car.similar}</Text>
          </header>
          <Image src={car.photo.src} alt={car.photo.alt} ratio={16 / 9} radius="xl" />
          <section aria-labelledby="specs-title" className="grid gap-3">
            <Heading level={2} size="lg" id="specs-title" className="font-display tracking-tight">
              The numbers
            </Heading>
            <CarSpecs car={car} className="sm:grid-cols-3" />
          </section>
          <section aria-labelledby="included-title" className="grid gap-3">
            <Heading
              level={2}
              size="lg"
              id="included-title"
              className="font-display tracking-tight"
            >
              Features and what&apos;s included
            </Heading>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                ...car.features,
                "Unlimited kilometres",
                "Roadside assistance 24/7",
                "Third-party insurance",
              ].map((f) => (
                <li key={f} className={`${ICON_ANCHOR_CLASS} flex items-center gap-2 text-sm`}>
                  <AnimatedCheckIcon
                    aria-hidden
                    preset="draw"
                    trigger="in"
                    className="size-4 text-success"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Text size="sm" variant="muted" className="flex items-start gap-2">
              <AnimatedIcon
                icon={GaugeIcon}
                preset="spin"
                trigger="in"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                Deposit of €{car.deposit.toLocaleString("en")} held on a credit card at pick-up and
                released on return.
              </span>
            </Text>
          </section>
          <section aria-labelledby="reviews-title" className="grid gap-4">
            <Heading level={2} size="lg" id="reviews-title" className="font-display tracking-tight">
              Recent reviews
            </Heading>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.slice(0, 2).map((r, i) => (
                <Reveal key={r.name} delay={i * 90} preset="slide-up">
                  <ReviewCard
                    author={{ name: r.name, subtitle: r.trip }}
                    rating={r.rating}
                    date={{ display: r.display, dateTime: r.date }}
                    body={r.body}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
        <RentalCard car={car} />
      </div>
      {similar.length ? (
        <>
          <Separator />
          <section aria-labelledby="similar-title" className="grid gap-4">
            <Heading level={2} size="lg" id="similar-title" className="font-display tracking-tight">
              Same class, other keys
            </Heading>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c, i) => (
                <Reveal
                  key={c.id}
                  as="li"
                  delay={i * 80}
                  preset="slide-up"
                  className="fleet-card grid content-start"
                >
                  <CarCard car={c} />
                </Reveal>
              ))}
            </ul>
          </section>
        </>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-(--ui-z-sticky) flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur lg:hidden">
        <Price amount={car.pricePerDay} currency={CURRENCY} period="/ day" fractionDigits={0} />
        <Button asChild size="lg">
          <a href="#book">Choose dates</a>
        </Button>
      </div>
    </div>
  );
}
