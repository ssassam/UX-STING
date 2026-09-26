"use client";
import { ShieldCheckIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader } from "@ux-sting/react/card";
import { DateRangePicker } from "@ux-sting/react/date-picker";
import { Field } from "@ux-sting/react/field";
import { NativeSelect } from "@ux-sting/react/native-select";
import { NumberInput } from "@ux-sting/react/number-input";
import { Currency, Price } from "@ux-sting/react/price";
import { Text } from "@ux-sting/react/typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENCY, type Stay } from "../lib/data";

const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function BookingCard({ stay }: { stay: Stay }) {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dates, setDates] = useState<{ from: Date | null; to: Date | null }>({
    from: new Date(today.getTime() + 14 * DAY),
    to: new Date(today.getTime() + 18 * DAY),
  });
  const [guests, setGuests] = useState<number | null>(2);
  const [roomId, setRoomId] = useState(stay.rooms[0]!.id);
  const room = stay.rooms.find((r) => r.id === roomId)!;
  const nights =
    dates.from && dates.to
      ? Math.max(0, Math.round((dates.to.getTime() - dates.from.getTime()) / DAY))
      : 0;
  const subtotal = nights * room.price;
  const fees = Math.round(subtotal * 0.08);
  const tooMany = (guests ?? 0) > room.guests;

  return (
    <Card id="booking" variant="elevated" className="h-fit scroll-mt-20 lg:sticky lg:top-24">
      <CardHeader>
        <Price
          amount={room.price}
          currency={CURRENCY}
          period="/ night"
          size="lg"
          fractionDigits={0}
        />
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Dates" required>
          <DateRangePicker
            value={dates}
            onValueChange={setDates}
            min={today}
            placeholder="Check-in – check-out"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Guests"
            invalid={tooMany}
            error={tooMany ? `Max ${room.guests} for this room` : undefined}
          >
            <NumberInput value={guests} onValueChange={setGuests} min={1} max={8} />
          </Field>
          <Field label="Room">
            <NativeSelect value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              {stay.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        {nights ? (
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt>
                <Currency value={room.price} currency={CURRENCY} fractionDigits={0} /> × {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </dt>
              <dd>
                <Currency value={subtotal} currency={CURRENCY} fractionDigits={0} />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Taxes and service fee</dt>
              <dd>
                <Currency value={fees} currency={CURRENCY} fractionDigits={0} />
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2 text-md font-semibold">
              <dt>Total</dt>
              <dd>
                <Currency value={subtotal + fees} currency={CURRENCY} fractionDigits={0} />
              </dd>
            </div>
          </dl>
        ) : (
          <Text size="sm" variant="muted">
            Choose your dates to see the total price.
          </Text>
        )}
      </CardContent>
      <CardFooter className="grid gap-3">
        <Button
          size="lg"
          fullWidth
          disabled={!nights || tooMany}
          onClick={() =>
            router.push(
              `/checkout?stay=${stay.id}&room=${room.id}&from=${iso(dates.from!)}&to=${iso(dates.to!)}&guests=${guests ?? 1}`,
            )
          }
        >
          Reserve
        </Button>
        <Text
          size="sm"
          variant="muted"
          align="center"
          className="flex items-center justify-center gap-1"
        >
          <ShieldCheckIcon aria-hidden className="size-4 text-success" />
          {stay.freeCancellation
            ? "Free cancellation · You won't be charged yet"
            : "You won't be charged yet"}
        </Text>
      </CardFooter>
    </Card>
  );
}
