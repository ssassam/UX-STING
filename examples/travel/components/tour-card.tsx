import { CalendarDaysIcon, UsersIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Card, CardContent, CardLink, CardMedia } from "@ux-sting/react/card";
import { Image } from "@ux-sting/react/media";
import { Price } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { CURRENCY, getDestination, type Tour } from "../lib/data";
import { sized } from "../lib/photos";

const levelVariant = { Easy: "success", Moderate: "warning", Challenging: "destructive" } as const;

export function TourCard({ tour, headingLevel = 3 }: { tour: Tour; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Card interactive className="relative flex flex-col overflow-hidden">
      <CardMedia ratio={4 / 3}>
        <Image src={sized(tour.image, 960)} alt="" ratio={4 / 3} radius="none" />
      </CardMedia>
      <div className="absolute start-3 top-3">
        <Badge variant={levelVariant[tour.level]}>{tour.level}</Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Text size="xs" variant="muted" weight="medium" className="uppercase tracking-wide">
          {getDestination(tour.destination)?.name} · {tour.days} days
        </Text>
        <Heading className="text-md font-semibold leading-snug">
          <CardLink asChild>
            <NextLink href={`/tours/${tour.id}`}>{tour.title}</NextLink>
          </CardLink>
        </Heading>
        <Text size="sm" variant="muted">
          {tour.summary}
        </Text>
        <ReviewStars value={tour.rating} count={tour.reviews} size="sm" showValue />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <Text size="sm" variant="muted" className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <CalendarDaysIcon aria-hidden className="size-4" /> {tour.days} days
            </span>
            <span className="inline-flex items-center gap-1">
              <UsersIcon aria-hidden className="size-4" /> Max {tour.groupSize}
            </span>
          </Text>
          <Price amount={tour.price} currency={CURRENCY} period="/ person" fractionDigits={0} />
        </div>
      </CardContent>
    </Card>
  );
}
