"use client";
import { Alert, AlertDescription } from "@unified-ui/react/alert";
import { Button } from "@unified-ui/react/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@unified-ui/react/card";
import { Checkbox } from "@unified-ui/react/checkbox";
import { Field, Fieldset } from "@unified-ui/react/field";
import { Form, FormErrorSummary } from "@unified-ui/react/form";
import { Input } from "@unified-ui/react/input";
import { List, ListItem } from "@unified-ui/react/list";
import { NativeSelect } from "@unified-ui/react/native-select";
import { Currency } from "@unified-ui/react/price";
import { RadioCard, RadioGroup } from "@unified-ui/react/radio-group";
import { Separator } from "@unified-ui/react/separator";
import { SuccessState } from "@unified-ui/react/state";
import { Stepper } from "@unified-ui/react/stepper";
import { Heading } from "@unified-ui/react/typography";
import NextLink from "next/link";
import { useState } from "react";
import { useCart } from "../app/providers";
import { products } from "../lib/data";

const shipping = { standard: 0, express: 12 } as const;

export function Checkout() {
  const { lines } = useCart();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<keyof typeof shipping>("standard");
  const [done, setDone] = useState(false);
  const items = lines.map((l) => ({ ...l, product: products.find((p) => p.id === l.id)! })).filter((i) => i.product);
  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
  const total = subtotal + shipping[method];

  if (done) {
    return (
      <SuccessState
        size="lg"
        headingLevel={1}
        title="Order confirmed"
        description="We've emailed your receipt. Artisans usually ship within 2 days."
        actions={<Button asChild><NextLink href="/">Continue shopping</NextLink></Button>}
      />
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Heading level={1} size="lg">Checkout</Heading>
      <Stepper current={step} onStepClick={setStep} steps={[{ title: "Shipping" }, { title: "Delivery" }, { title: "Payment" }]} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Form
          onSubmit={async () => {
            if (step < 2) {
              setStep(step + 1);
              return;
            }
            await new Promise((r) => setTimeout(r, 900));
            setDone(true);
          }}
        >
          <FormErrorSummary />
          {step === 0 ? (
            <Fieldset legend="Shipping address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="given" label="First name" required><Input autoComplete="given-name" /></Field>
                <Field name="family" label="Last name" required><Input autoComplete="family-name" /></Field>
              </div>
              <Field name="email" label="Email" description="For your receipt and delivery updates." required><Input type="email" autoComplete="email" /></Field>
              <Field name="address" label="Street address" required><Input autoComplete="street-address" /></Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field name="city" label="City" required><Input autoComplete="address-level2" /></Field>
                <Field name="zip" label="Postal code" required><Input autoComplete="postal-code" /></Field>
                <Field name="country" label="Country" required>
                  <NativeSelect autoComplete="country" defaultValue="FR">
                    <option value="FR">France</option>
                    <option value="MA">Morocco</option>
                    <option value="ES">Spain</option>
                  </NativeSelect>
                </Field>
              </div>
            </Fieldset>
          ) : step === 1 ? (
            <Fieldset legend="Delivery method">
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as keyof typeof shipping)} className="grid gap-3 sm:grid-cols-2">
                <RadioCard value="standard" label="Standard — free" description="3–5 business days" />
                <RadioCard value="express" label="Express — €12" description="Next business day" />
              </RadioGroup>
            </Fieldset>
          ) : (
            <Fieldset legend="Payment">
              <Alert variant="info">
                <AlertDescription>This is a demo — no payment is taken. Card fields support browser autofill.</AlertDescription>
              </Alert>
              <Field name="cc-name" label="Name on card" required><Input autoComplete="cc-name" /></Field>
              <Field name="cc-number" label="Card number" required><Input autoComplete="cc-number" inputMode="numeric" pattern="[0-9 ]{12,23}" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="cc-exp" label="Expiry (MM/YY)" required><Input autoComplete="cc-exp" placeholder="MM/YY" pattern="\d{2}/\d{2}" /></Field>
                <Field name="cc-csc" label="Security code" required><Input autoComplete="cc-csc" inputMode="numeric" pattern="\d{3,4}" /></Field>
              </div>
              <Checkbox name="terms" value="yes" required label="I agree to the terms of sale" />
            </Fieldset>
          )}
          <div className="flex gap-2">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button> : null}
            <Button type="submit">{step < 2 ? "Continue" : `Pay ${new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(total)}`}</Button>
          </div>
        </Form>
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle as="h2">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-0">
            <List variant="divided">
              {items.map((i) => (
                <ListItem key={i.id} title={i.product.name} description={`Qty ${i.qty}`} end={<Currency value={i.product.price * i.qty} currency="EUR" className="text-foreground" />} />
              ))}
            </List>
          </CardContent>
          <CardFooter className="grid gap-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><Currency value={subtotal} currency="EUR" /></div>
            <div className="flex justify-between"><span>Shipping</span><Currency value={shipping[method]} currency="EUR" /></div>
            <Separator />
            <div className="flex justify-between text-md font-semibold"><span>Total</span><Currency value={total} currency="EUR" /></div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
