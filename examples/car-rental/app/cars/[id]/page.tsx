import { CheckIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
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
    ? {
        title: `Rent a ${c.name}`,
        description: `${c.name} ${c.similar}, from €${c.pricePerDay}/day.`,
      }
    : {};
}

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const car = getCar((await params).id);
  if (!car) notFound();
  const category = categories.find((c) => c.id === car.category)!;
  const similar = cars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-28 pt-8 sm:px-6 lg:pb-8">
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
          <header className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge>{category.name}</Badge>
              <Badge variant="success">Unlimited km</Badge>
            </div>
            <Heading level={1} size="3xl">
              {car.name}
            </Heading>
            <Text variant="muted">{car.similar}</Text>
            <ReviewStars value={car.rating} count={car.reviews} showValue />
          </header>
          <Image src={car.photo.src} alt={car.photo.alt} ratio={16 / 9} radius="xl" />
          <section aria-labelledby="specs-title" className="grid gap-3">
            <Heading level={2} size="lg" id="specs-title">
              Specifications
            </Heading>
            <CarSpecs car={car} className="sm:grid-cols-3" />
          </section>
          <section aria-labelledby="included-title" className="grid gap-3">
            <Heading level={2} size="lg" id="included-title">
              Features and what&apos;s included
            </Heading>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                ...car.features,
                "Unlimited kilometres",
                "Roadside assistance 24/7",
                "Third-party insurance",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon aria-hidden className="size-4 text-success" /> {f}
                </li>
              ))}
            </ul>
            <Text size="sm" variant="muted">
              Deposit of €{car.deposit.toLocaleString("en")} held on a credit card at pick-up and
              released on return.
            </Text>
          </section>
          <section aria-labelledby="reviews-title" className="grid gap-4">
            <Heading level={2} size="lg" id="reviews-title">
              Recent reviews
            </Heading>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.slice(0, 2).map((r) => (
                <ReviewCard
                  key={r.name}
                  author={{ name: r.name, subtitle: r.trip }}
                  rating={r.rating}
                  date={{ display: r.display, dateTime: r.date }}
                  body={r.body}
                />
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
            <Heading level={2} size="lg" id="similar-title">
              Similar cars
            </Heading>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <li key={c.id} className="grid">
                  <CarCard car={c} />
                </li>
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
