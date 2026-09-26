"use client";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader } from "@ux-sting/react/card";
import { Field, Fieldset } from "@ux-sting/react/field";
import { NumberInput } from "@ux-sting/react/number-input";
import { Currency, Price } from "@ux-sting/react/price";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { Text } from "@ux-sting/react/typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENCY, type Tour } from "../lib/data";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));

export function TourBooking({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [departure, setDeparture] = useState(tour.departures[0]!);
  const [travellers, setTravellers] = useState<number | null>(2);
  const total = tour.price * (travellers ?? 1);
  return (
    <Card variant="elevated" className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <Price
          amount={tour.price}
          currency={CURRENCY}
          period="/ person"
          size="lg"
          fractionDigits={0}
        />
      </CardHeader>
      <CardContent className="grid gap-4">
        <Fieldset legend="Departure date">
          <RadioGroup value={departure} onValueChange={setDeparture} className="grid gap-2">
            {tour.departures.map((d, i) => (
              <RadioCard
                key={d}
                value={d}
                label={fmt(d)}
                description={i === 0 ? "Only 3 places left" : "Available"}
              />
            ))}
          </RadioGroup>
        </Fieldset>
        <Field label="Travellers" description={`Group size up to ${tour.groupSize}.`}>
          <NumberInput
            value={travellers}
            onValueChange={setTravellers}
            min={1}
            max={tour.groupSize}
          />
        </Field>
        <div className="flex justify-between text-md font-semibold">
          <span>Total</span>
          <Currency value={total} currency={CURRENCY} fractionDigits={0} />
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Button
          size="lg"
          fullWidth
          onClick={() =>
            router.push(`/checkout?tour=${tour.id}&from=${departure}&guests=${travellers ?? 1}`)
          }
        >
          Book this tour
        </Button>
        <Text size="sm" variant="muted" align="center">
          20% deposit today, balance 30 days before departure.
        </Text>
      </CardFooter>
    </Card>
  );
}
