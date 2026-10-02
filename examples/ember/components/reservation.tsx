"use client";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent } from "@ux-sting/react/card";
import { DatePicker } from "@ux-sting/react/date-picker";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { NumberInput } from "@ux-sting/react/number-input";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { SuccessState } from "@ux-sting/react/state";
import { Textarea } from "@ux-sting/react/textarea";
import { TimePicker } from "@ux-sting/react/time-picker";
import { useState } from "react";

const seatings = [
  { id: "room", name: "Dining room", description: "Tables of 2–8, €145 per guest" },
  { id: "counter", name: "Chef's counter", description: "12 courses + pairing, €225 per guest" },
  { id: "private", name: "Private room", description: "Minimum 6 guests, €165 per guest" },
];

const isTuesToSat = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 1;
};

export function Reservation() {
  const [seating, setSeating] = useState(seatings[0]!.id);
  const [partySize, setPartySize] = useState<number | null>(2);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  if (confirmed) {
    return (
      <SuccessState
        size="lg"
        headingLevel={3}
        title="Table reserved"
        description={confirmed}
        actions={
          <Button variant="outline" onClick={() => setConfirmed(null)}>
            Make another reservation
          </Button>
        }
      />
    );
  }

  const canSubmit = Boolean(date && time && partySize);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="p-5 sm:p-6">
        <Form
          onSubmit={async () => {
            await new Promise((r) => setTimeout(r, 800));
            const dateLabel = date
              ? new Intl.DateTimeFormat("en", { dateStyle: "full" }).format(date)
              : "";
            const seatingName = seatings.find((s) => s.id === seating)!.name;
            setConfirmed(
              `${partySize} guests on ${dateLabel} at ${time}, ${seatingName.toLowerCase()}. We've emailed your confirmation — reply there if your plans change.`,
            );
          }}
        >
          <FormErrorSummary />
          <Fieldset legend="Party & time">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="partySize" label="Guests" required>
                <NumberInput
                  value={partySize}
                  onValueChange={setPartySize}
                  min={1}
                  max={10}
                  aria-label="Number of guests"
                />
              </Field>
              <Field name="date" label="Date" required>
                <DatePicker
                  value={date}
                  onValueChange={setDate}
                  min={new Date()}
                  isDisabled={(d: Date) => !isTuesToSat(d)}
                  placeholder="Choose a date"
                />
              </Field>
              <Field name="time" label="Time" required>
                <TimePicker
                  value={time}
                  onValueChange={setTime}
                  min="18:00"
                  max="20:30"
                  step={15}
                  placeholder="Choose a time"
                />
              </Field>
            </div>
          </Fieldset>
          <Fieldset legend="Seating">
            <RadioGroup value={seating} onValueChange={setSeating} className="grid gap-3">
              {seatings.map((s) => (
                <RadioCard key={s.id} value={s.id} label={s.name} description={s.description} />
              ))}
            </RadioGroup>
          </Fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" required>
              <Input autoComplete="name" />
            </Field>
            <Field name="email" label="Email" required description="We'll send your confirmation.">
              <Input type="email" autoComplete="email" />
            </Field>
          </div>
          <Field
            name="notes"
            label="Allergies or special requests"
            description="Optional — let the kitchen know ahead of time."
          >
            <Textarea rows={3} maxLength={300} showCount />
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">No card required to hold your table.</p>
            <Button type="submit" size="lg" disabled={!canSubmit}>
              Confirm reservation
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
