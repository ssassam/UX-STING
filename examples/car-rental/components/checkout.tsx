"use client";

import { KeyRoundIcon } from "@ux-sting/icons";
import { AnimatedIcon } from "@ux-sting/icons/animated";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
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
import type { ReactNode } from "react";
import { CURRENCY, extras, getCar, getLocation, protection } from "../lib/data";
import { sized } from "../lib/photos";

const DAY = 86_400_000;
const fmt = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short" }).format(
        new Date(`${iso}T00:00:00`),
      )
    : "—";
const money = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);

type Line = { label: string; value: number };
type Car = NonNullable<ReturnType<typeof getCar>>;
type Desk = NonNullable<ReturnType<typeof getLocation>>;

const STEPS = [{ title: "Driver" }, { title: "Payment" }];

/**
 * The frame every checkout state shares: a static page header, the two-step
 * rail and a two-column body. Keeping it in one place is what lets the
 * Suspense fallback (`CheckoutSkeleton`) reserve exactly the space the hydrated
 * content takes — the page is a static export, so anything the fallback gets
 * wrong lands in the layout-shift score.
 */
function CheckoutShell({
  pickupName,
  days,
  step,
  onStepClick,
  form,
  card,
}: {
  pickupName: string | null;
  days: number;
  step: number;
  onStepClick: (index: number) => void;
  form: ReactNode;
  card: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <div className="grid gap-2">
        <p className="roadbook-label text-primary">
          <span className="text-muted-foreground">STAGE 10</span> · last 60 seconds
        </p>
        <Heading level={1} size="2xl" className="font-display tracking-tight text-balance">
          Two screens and the keys are yours
        </Heading>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          {pickupName ? `Pick-up at ${pickupName}` : "Pick-up desk chosen at the end of the flow"} ·{" "}
          {days} {days === 1 ? "day" : "days"} · unlimited kilometres · deposit released on return.
        </p>
      </div>
      <Stepper current={step} onStepClick={onStepClick} steps={STEPS} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        {form}
        {card}
      </div>
    </div>
  );
}

function DriverFieldset() {
  return (
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
  );
}

function PaymentFieldset() {
  return (
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
  );
}

function CheckoutForm({
  step,
  total,
  onStep,
  onPay,
}: {
  step: number;
  total: number;
  onStep: (next: number) => void;
  onPay: () => void;
}) {
  return (
    <Form
      onSubmit={async () => {
        if (step === 0) {
          onStep(1);
          return;
        }
        await new Promise((r) => setTimeout(r, 900));
        onPay();
      }}
    >
      <FormErrorSummary />
      {step === 0 ? <DriverFieldset /> : <PaymentFieldset />}
      <div className="flex gap-2">
        {step > 0 ? (
          <Button variant="outline" onClick={() => onStep(0)}>
            Back
          </Button>
        ) : null}
        <Button type="submit" size="lg">
          {step === 0 ? "Continue to payment" : `Pay ${money(total)}`}
        </Button>
      </div>
    </Form>
  );
}

function SummaryCard({
  car,
  desk,
  from,
  to,
  lines,
  total,
}: {
  car: Car;
  desk: Desk | null;
  from: string | null;
  to: string | null;
  lines: Line[];
  total: number;
}) {
  return (
    <Card className="h-fit overflow-hidden lg:sticky lg:top-24">
      <Image src={sized(car.photo, 960)} alt="" ratio={16 / 9} radius="none" />
      <CardHeader>
        <CardTitle as="h2" className="font-display tracking-tight">
          {car.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5 text-sm">
        <p className="roadbook-label flex flex-wrap items-center gap-2 text-muted-foreground">
          <AnimatedIcon
            icon={KeyRoundIcon}
            preset="ring"
            trigger="in"
            className="size-3.5 text-primary"
          />
          {desk?.name ?? "Desk chosen at the counter"}
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
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-2 text-md font-semibold">
          <span>Total</span>
          <AnimatedNumber
            value={total}
            from={0}
            duration={450}
            startOnView={false}
            format={{ style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }}
            className="font-display tabular-nums"
          />
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Fallback for the Suspense boundary around `useSearchParams`. It renders the
 * same shell, the same first step of the form and a summary card whose blocks
 * are sized to the text they will be replaced by, so nothing on screen moves
 * when the real booking data arrives.
 */
export function CheckoutSkeleton() {
  const bar = "rounded-sm bg-muted";
  return (
    <CheckoutShell
      pickupName={null}
      days={1}
      step={0}
      onStepClick={() => {}}
      form={<CheckoutForm step={0} total={0} onStep={() => {}} onPay={() => {}} />}
      card={
        <Card className="h-fit overflow-hidden lg:sticky lg:top-24">
          <span className="sr-only">Loading your booking summary</span>
          <span aria-hidden className={`block aspect-video rounded-none ${bar}`} />
          <CardHeader>
            <span aria-hidden className={`block h-7 w-44 ${bar}`} />
          </CardHeader>
          <CardContent className="grid gap-1.5 text-sm">
            <span aria-hidden className={`block h-5 w-40 ${bar}`} />
            <span aria-hidden className={`block h-5 w-56 ${bar}`} />
          </CardContent>
          <CardFooter className="grid gap-2 text-sm">
            <span aria-hidden className="flex justify-between gap-4">
              <span className={`block h-5 w-40 ${bar}`} />
              <span className={`block h-5 w-12 ${bar}`} />
            </span>
            <span aria-hidden className="flex justify-between gap-4">
              <span className={`block h-5 w-32 ${bar}`} />
              <span className={`block h-5 w-12 ${bar}`} />
            </span>
            <span
              aria-hidden
              className="flex items-baseline justify-between gap-4 border-t border-border pt-2 text-md font-semibold"
            >
              <span className={`block h-6 w-14 ${bar}`} />
              <span className={`block h-6 w-24 ${bar}`} />
            </span>
          </CardFooter>
        </Card>
      }
    />
  );
}

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
  const lines: Line[] = [
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
    <CheckoutShell
      pickupName={pickup?.name ?? null}
      days={days}
      step={step}
      onStepClick={(index) => {
        if (index < step) setStep(index);
      }}
      form={
        <CheckoutForm
          step={step}
          total={total}
          onStep={setStep}
          onPay={() => setRef(`DRV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)}
        />
      }
      card={
        <SummaryCard
          car={car}
          desk={pickup ?? null}
          from={from}
          to={to}
          lines={lines}
          total={total}
        />
      }
    />
  );
}
