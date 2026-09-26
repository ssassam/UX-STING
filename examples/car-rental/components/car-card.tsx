import { Badge } from "@ux-sting/react/badge";
import { Card, CardContent, CardLink, CardMedia } from "@ux-sting/react/card";
import { Image } from "@ux-sting/react/media";
import { Price } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { categories, CURRENCY, type Car } from "../lib/data";
import { sized } from "../lib/photos";
import { CarSpecs } from "./car-specs";

export function CarCard({ car, headingLevel = 3 }: { car: Car; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Card interactive className="relative flex h-full flex-col overflow-hidden">
      <CardMedia ratio={16 / 10}>
        <Image src={sized(car.photo, 960)} alt="" ratio={16 / 10} radius="none" />
      </CardMedia>
      <div className="absolute start-3 top-3 flex gap-1.5">
        <Badge>{categories.find((c) => c.id === car.category)?.name}</Badge>
        {car.fuel === "Electric" && car.category !== "electric" ? (
          <Badge variant="success">Electric</Badge>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid gap-0.5">
          <Heading className="text-md font-semibold leading-snug">
            <CardLink asChild>
              <NextLink href={`/cars/${car.id}`}>{car.name}</NextLink>
            </CardLink>
          </Heading>
          <Text size="sm" variant="muted">
            {car.similar}
          </Text>
        </div>
        <ReviewStars value={car.rating} count={car.reviews} size="sm" showValue />
        <CarSpecs car={car} />
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
          <Price amount={car.pricePerDay} currency={CURRENCY} period="/ day" fractionDigits={0} />
          <Text size="xs" variant="muted">
            Unlimited km
          </Text>
        </div>
      </CardContent>
    </Card>
  );
}
