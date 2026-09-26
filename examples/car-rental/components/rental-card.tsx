"use client";
import { ShieldCheckIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader } from "@ux-sting/react/card";
import { Checkbox } from "@ux-sting/react/checkbox";
import { DateRangePicker } from "@ux-sting/react/date-picker";
import { Field, Fieldset } from "@ux-sting/react/field";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Currency, Price } from "@ux-sting/react/price";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { Text } from "@ux-sting/react/typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENCY, extras, locations, protection, type Car } from "../lib/data";

const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function RentalCard({ car }: { car: Car }) {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [pickup, setPickup] = useState("cdg");
  const [dates, setDates] = useState<{ from: Date | null; to: Date | null }>({
    from: new Date(today.getTime() + 7 * DAY),
    to: new Date(today.getTime() + 10 * DAY),
  });
  const [cover, setCover] = useState("plus");
  const [chosen, setChosen] = useState<string[]>([]);
  const days =
    dates.from && dates.to
      ? Math.max(1, Math.round((dates.to.getTime() - dates.from.getTime()) / DAY))
      : 0;
  const coverPerDay = protection.find((p) => p.id === cover)!.perDay;
  const extrasPerDay = extras
    .filter((e) => chosen.includes(e.id))
    .reduce((n, e) => n + e.perDay, 0);
  const total = days * (car.pricePerDay + coverPerDay + extrasPerDay);

  return (
    <Card id="book" variant="elevated" className="h-fit scroll-mt-20 lg:sticky lg:top-24">
      <CardHeader>
        <Price
          amount={car.pricePerDay}
          currency={CURRENCY}
          period="/ day"
          size="lg"
          fractionDigits={0}
        />
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Pick-up location">
          <NativeSelect value={pickup} onChange={(e) => setPickup(e.target.value)}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Dates" required>
          <DateRangePicker
            value={dates}
            onValueChange={setDates}
            min={today}
            placeholder="Pick-up – return"
          />
        </Field>
        <Fieldset legend="Protection">
          <RadioGroup value={cover} onValueChange={setCover} className="grid gap-2">
            {protection.map((p) => (
              <RadioCard
                key={p.id}
                value={p.id}
                label={p.perDay ? `${p.name} · +€${p.perDay}/day` : `${p.name} · included`}
                description={p.description}
              />
            ))}
          </RadioGroup>
        </Fieldset>
        <Fieldset legend="Extras">
          <div className="grid gap-2">
            {extras.map((e) => (
              <Checkbox
                key={e.id}
                checked={chosen.includes(e.id)}
                onCheckedChange={(c) =>
                  setChosen((s) => (c ? [...s, e.id] : s.filter((x) => x !== e.id)))
                }
                label={`${e.name} · €${e.perDay}/day`}
                description={e.description}
              />
            ))}
          </div>
        </Fieldset>
      </CardContent>
      <CardFooter className="grid gap-3">
        {days ? (
          <div className="flex items-baseline justify-between gap-2 border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">
              Total for {days} {days === 1 ? "day" : "days"}
            </span>
            <Currency
              value={total}
              currency={CURRENCY}
              fractionDigits={0}
              className="text-lg font-semibold text-foreground"
            />
          </div>
        ) : null}
        <Button
          size="lg"
          fullWidth
          disabled={!days}
          onClick={() =>
            router.push(
              `/checkout?car=${car.id}&pickup=${pickup}&from=${iso(dates.from!)}&to=${iso(dates.to!)}&cover=${cover}&extras=${chosen.join(",")}`,
            )
          }
        >
          Continue
        </Button>
        <Text
          size="sm"
          variant="muted"
          align="center"
          className="flex items-center justify-center gap-1"
        >
          <ShieldCheckIcon aria-hidden className="size-4 text-success" /> Free cancellation up to 48
          h before pick-up
        </Text>
      </CardFooter>
    </Card>
  );
}
