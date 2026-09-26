"use client";
import { Alert, AlertDescription } from "@ux-sting/react/alert";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Checkbox } from "@ux-sting/react/checkbox";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { Image } from "@ux-sting/react/media";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Currency } from "@ux-sting/react/price";
import { Separator } from "@ux-sting/react/separator";
import { EmptyState, SuccessState } from "@ux-sting/react/state";
import { Stepper } from "@ux-sting/react/stepper";
import { Textarea } from "@ux-sting/react/textarea";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CURRENCY, getDestination, getStay, getTour } from "../lib/data";
import { sized } from "../lib/photos";

const DAY = 86_400_000;
const extras = [
  { id: "transfer", label: "Airport transfer", description: "Private car both ways", price: 60 },
  {
    id: "insurance",
    label: "Travel insurance",
    description: "Cancellation and medical cover",
    price: 45,
  },
  { id: "late", label: "Late checkout", description: "Keep your room until 4 pm", price: 30 },
];
const fmt = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(`${iso}T00:00:00`),
      )
    : "—";

export function Checkout() {
  const params = useSearchParams();
  const stay = getStay(params.get("stay") ?? "");
  const tour = getTour(params.get("tour") ?? "");
  const guests = Math.max(1, Number(params.get("guests") ?? 1));
  const from = params.get("from");
  const to = params.get("to");
  const [step, setStep] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [reference, setReference] = useState<string | null>(null);

  if (!stay && !tour) {
    return (
      <EmptyState
        size="lg"
        headingLevel={1}
        title="Nothing to book yet"
        description="Choose a stay or a tour first, then come back to confirm."
        actions={
          <Button asChild>
            <NextLink href="/search">Browse stays</NextLink>
          </Button>
        }
      />
    );
  }

  const room = stay?.rooms.find((r) => r.id === params.get("room")) ?? stay?.rooms[0];
  const nights =
    from && to ? Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / DAY)) : 1;
  const base = stay ? (room?.price ?? stay.nightly) * nights : tour!.price * guests;
  const extrasTotal = extras
    .filter((e) => selectedExtras.includes(e.id))
    .reduce((n, e) => n + e.price, 0);
  const fees = Math.round(base * 0.08);
  const total = base + extrasTotal + fees;
  const title = stay?.name ?? tour!.title;
  const place = getDestination(stay?.destination ?? tour!.destination);

  if (reference) {
    return (
      <SuccessState
        size="lg"
        headingLevel={1}
        title="You're booked!"
        description={`Booking ${reference} for ${title} is confirmed. We've emailed your itinerary and receipt.`}
        actions={
          <>
            <Button asChild>
              <NextLink href="/trips">View my trips</NextLink>
            </Button>
            <Button asChild variant="outline">
              <NextLink href="/">Back to home</NextLink>
            </Button>
          </>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Heading level={1} size="2xl">
        Confirm and pay
      </Heading>
      <Stepper
        current={step}
        onStepClick={(i) => i < step && setStep(i)}
        steps={[{ title: "Your details" }, { title: "Extras" }, { title: "Payment" }]}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Form
          onSubmit={async () => {
            if (step < 2) {
              setStep(step + 1);
              return;
            }
            await new Promise((r) => setTimeout(r, 900));
            setReference(`WF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
          }}
        >
          <FormErrorSummary />
          {step === 0 ? (
            <Fieldset legend="Lead traveller" description="As shown on your passport or ID.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="given" label="First name" required>
                  <Input autoComplete="given-name" />
                </Field>
                <Field name="family" label="Last name" required>
                  <Input autoComplete="family-name" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="email"
                  label="Email"
                  description="We'll send your confirmation here."
                  required
                >
                  <Input type="email" autoComplete="email" />
                </Field>
                <Field name="phone" label="Mobile phone" description="For urgent travel updates.">
                  <Input type="tel" autoComplete="tel" />
                </Field>
              </div>
              <Field name="country" label="Country of residence" required>
                <NativeSelect autoComplete="country" defaultValue="FR">
                  <option value="FR">France</option>
                  <option value="MA">Morocco</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                </NativeSelect>
              </Field>
              <Field
                name="requests"
                label="Special requests"
                description="Optional — we'll pass these on to your host."
              >
                <Textarea autoResize maxRows={6} />
              </Field>
            </Fieldset>
          ) : step === 1 ? (
            <Fieldset legend="Add extras" description="Optional — you can also add these later.">
              <div className="grid gap-3">
                {extras.map((e) => (
                  <Checkbox
                    key={e.id}
                    checked={selectedExtras.includes(e.id)}
                    onCheckedChange={(c) =>
                      setSelectedExtras((s) => (c ? [...s, e.id] : s.filter((x) => x !== e.id)))
                    }
                    label={`${e.label} — €${e.price}`}
                    description={e.description}
                  />
                ))}
              </div>
            </Fieldset>
          ) : (
            <Fieldset legend="Payment">
              <Alert variant="info">
                <AlertDescription>
                  Demo template — no payment is taken. Card fields support browser autofill.
                </AlertDescription>
              </Alert>
              <Field name="cc-name" label="Name on card" required>
                <Input autoComplete="cc-name" />
              </Field>
              <Field name="cc-number" label="Card number" required>
                <Input autoComplete="cc-number" inputMode="numeric" pattern="[0-9 ]{12,23}" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="cc-exp" label="Expiry (MM/YY)" required>
                  <Input autoComplete="cc-exp" placeholder="MM/YY" pattern="\d{2}/\d{2}" />
                </Field>
                <Field name="cc-csc" label="Security code" required>
                  <Input autoComplete="cc-csc" inputMode="numeric" pattern="\d{3,4}" />
                </Field>
              </div>
              <Checkbox
                name="terms"
                value="yes"
                required
                label="I agree to the booking conditions and cancellation policy"
              />
            </Fieldset>
          )}
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : null}
            <Button type="submit" size="lg">
              {step < 2
                ? "Continue"
                : `Pay ${new Intl.NumberFormat("en", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(total)}`}
            </Button>
          </div>
        </Form>
        <Card className="h-fit overflow-hidden lg:sticky lg:top-24">
          <Image src={sized(stay?.image ?? tour!.image, 960)} alt="" ratio={16 / 9} radius="none" />
          <CardHeader>
            <CardTitle as="h2">{title}</CardTitle>
            <Text size="sm" variant="muted">
              {place?.name}, {place?.country}
            </Text>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <dl className="grid gap-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{stay ? "Check-in" : "Departure"}</dt>
                <dd>{fmt(from)}</dd>
              </div>
              {stay ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Check-out</dt>
                  <dd>{fmt(to)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{stay ? "Room" : "Duration"}</dt>
                <dd className="text-end">{stay ? room?.name : `${tour!.days} days`}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Guests</dt>
                <dd>{guests}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <span>
                {stay ? `${nights} ${nights === 1 ? "night" : "nights"}` : `${guests} × tour`}
              </span>
              <Currency value={base} currency={CURRENCY} fractionDigits={0} />
            </div>
            {extrasTotal ? (
              <div className="flex justify-between gap-4">
                <span>Extras</span>
                <Currency value={extrasTotal} currency={CURRENCY} fractionDigits={0} />
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <span>Taxes and fees</span>
              <Currency value={fees} currency={CURRENCY} fractionDigits={0} />
            </div>
            <Separator />
            <div className="flex justify-between gap-4 text-md font-semibold">
              <span>Total</span>
              <Currency value={total} currency={CURRENCY} fractionDigits={0} />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
