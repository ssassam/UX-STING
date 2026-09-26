"use client";
import { Alert, AlertDescription } from "@ux-sting/react/alert";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Checkbox } from "@ux-sting/react/checkbox";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { Image } from "@ux-sting/react/media";
import { Currency } from "@ux-sting/react/price";
import { EmptyState, SuccessState } from "@ux-sting/react/state";
import { Stepper } from "@ux-sting/react/stepper";
import { Heading } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CURRENCY, extras, getCar, getLocation, protection } from "../lib/data";
import { sized } from "../lib/photos";

const DAY = 86_400_000;
const fmt = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short" }).format(
        new Date(`${iso}T00:00:00`),
      )
    : "—";

export function Checkout() {
  const params = useSearchParams();
  const car = getCar(params.get("car") ?? "");
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState<string | null>(null);
  if (!car) {
    return (
      <EmptyState
        size="lg"
        headingLevel={1}
        title="Choose a car first"
        description="Pick a car and dates, then come back here to confirm."
        actions={
          <Button asChild>
            <NextLink href="/cars">Browse the fleet</NextLink>
          </Button>
        }
      />
    );
  }
  const from = params.get("from");
  const to = params.get("to");
  const days = from && to ? Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / DAY)) : 1;
  const cover = protection.find((p) => p.id === params.get("cover")) ?? protection[0]!;
  const chosen = extras.filter((e) => (params.get("extras") ?? "").split(",").includes(e.id));
  const lines = [
    {
      label: `${car.name} × ${days} ${days === 1 ? "day" : "days"}`,
      value: car.pricePerDay * days,
    },
    ...(cover.perDay ? [{ label: `${cover.name} protection`, value: cover.perDay * days }] : []),
    ...chosen.map((e) => ({ label: e.name, value: e.perDay * days })),
  ];
  const total = lines.reduce((n, l) => n + l.value, 0);
  const pickup = getLocation(params.get("pickup") ?? "");

  if (ref) {
    return (
      <SuccessState
        size="lg"
        headingLevel={1}
        title="Your car is booked"
        description={`Booking ${ref}: ${car.name} from ${fmt(from)} at ${pickup?.name ?? "your pick-up location"}. We've emailed your confirmation and the app link to unlock the car.`}
        actions={
          <Button asChild>
            <NextLink href="/">Back to home</NextLink>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Heading level={1} size="2xl">
        Complete your booking
      </Heading>
      <Stepper
        current={step}
        onStepClick={(i) => i < step && setStep(i)}
        steps={[{ title: "Driver" }, { title: "Payment" }]}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Form
          onSubmit={async () => {
            if (step === 0) {
              setStep(1);
              return;
            }
            await new Promise((r) => setTimeout(r, 900));
            setRef(`DRV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
          }}
        >
          <FormErrorSummary />
          {step === 0 ? (
            <Fieldset
              legend="Main driver"
              description="Must be 21 or older with a licence held for at least one year."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="given" label="First name" required>
                  <Input autoComplete="given-name" />
                </Field>
                <Field name="family" label="Last name" required>
                  <Input autoComplete="family-name" />
                </Field>
                <Field name="email" label="Email" required>
                  <Input type="email" autoComplete="email" />
                </Field>
                <Field
                  name="phone"
                  label="Mobile phone"
                  required
                  description="We text you the unlock code."
                >
                  <Input type="tel" autoComplete="tel" />
                </Field>
                <Field name="dob" label="Date of birth" required>
                  <Input type="date" autoComplete="bday" />
                </Field>
                <Field name="licence" label="Driving licence number" required>
                  <Input autoComplete="off" />
                </Field>
              </div>
              <Field
                name="flight"
                label="Flight number"
                description="Optional — we'll hold the car if your flight is late."
              >
                <Input autoComplete="off" placeholder="e.g. AF1234" />
              </Field>
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
              <Checkbox name="terms" value="yes" required label="I accept the rental conditions" />
            </Fieldset>
          )}
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
            ) : null}
            <Button type="submit" size="lg">
              {step === 0
                ? "Continue to payment"
                : `Pay ${new Intl.NumberFormat("en", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(total)}`}
            </Button>
          </div>
        </Form>
        <Card className="h-fit overflow-hidden lg:sticky lg:top-24">
          <Image src={sized(car.photo, 960)} alt="" ratio={16 / 9} radius="none" />
          <CardHeader>
            <CardTitle as="h2">{car.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Pick-up:</span> {pickup?.name ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Dates:</span> {fmt(from)} → {fmt(to)}
            </p>
          </CardContent>
          <CardFooter className="grid gap-2 text-sm">
            {lines.map((l) => (
              <div key={l.label} className="flex justify-between gap-4">
                <span>{l.label}</span>
                <Currency value={l.value} currency={CURRENCY} fractionDigits={0} />
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-border pt-2 text-md font-semibold">
              <span>Total</span>
              <Currency value={total} currency={CURRENCY} fractionDigits={0} />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
