"use client";
import { Alert, AlertDescription } from "@ux-sting/react/alert";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Checkbox } from "@ux-sting/react/checkbox";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Currency } from "@ux-sting/react/price";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { EmptyState, SuccessState } from "@ux-sting/react/state";
import { Heading } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { useState } from "react";
import { useCart } from "../app/providers";
import { CURRENCY, FREE_SHIPPING } from "../lib/data";
import { sized } from "../lib/photos";

export function Checkout() {
  const cart = useCart();
  const [delivery, setDelivery] = useState("standard");
  const [order, setOrder] = useState<string | null>(null);
  const shipping = delivery === "express" ? 12 : cart.subtotal >= FREE_SHIPPING ? 0 : 6;
  const total = cart.subtotal + shipping;

  if (order) {
    return (
      <SuccessState
        size="lg"
        headingLevel={1}
        title="Thank you for your order"
        description={`Order ${order} is confirmed. We'll email you when it ships.`}
        actions={
          <Button asChild>
            <NextLink href="/shop">Continue shopping</NextLink>
          </Button>
        }
      />
    );
  }
  if (!cart.lines.length) {
    return (
      <EmptyState
        size="lg"
        headingLevel={1}
        title="Your bag is empty"
        description="Add a few things first, then check out here."
        actions={
          <Button asChild>
            <NextLink href="/shop">Shop the collection</NextLink>
          </Button>
        }
      />
    );
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Heading level={1} size="3xl" className="font-serif font-normal">
        Checkout
      </Heading>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Form
          onSubmit={async () => {
            await new Promise((r) => setTimeout(r, 900));
            setOrder(`MN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
            cart.clear();
          }}
        >
          <FormErrorSummary />
          <Fieldset legend="Contact">
            <Field name="email" label="Email" required>
              <Input type="email" autoComplete="email" />
            </Field>
          </Fieldset>
          <Fieldset legend="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="given" label="First name" required>
                <Input autoComplete="given-name" />
              </Field>
              <Field name="family" label="Last name" required>
                <Input autoComplete="family-name" />
              </Field>
            </div>
            <Field name="address" label="Address" required>
              <Input autoComplete="street-address" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="zip" label="Postcode" required>
                <Input autoComplete="postal-code" />
              </Field>
              <Field name="city" label="City" required>
                <Input autoComplete="address-level2" />
              </Field>
              <Field name="country" label="Country" required>
                <NativeSelect autoComplete="country" defaultValue="FR">
                  <option value="FR">France</option>
                  <option value="BE">Belgium</option>
                  <option value="DE">Germany</option>
                  <option value="GB">United Kingdom</option>
                </NativeSelect>
              </Field>
            </div>
          </Fieldset>
          <Fieldset legend="Delivery">
            <RadioGroup
              value={delivery}
              onValueChange={setDelivery}
              className="grid gap-3 sm:grid-cols-2"
            >
              <RadioCard
                value="standard"
                label={cart.subtotal >= FREE_SHIPPING ? "Standard — free" : "Standard — €6"}
                description="2–4 working days, carbon-neutral"
              />
              <RadioCard value="express" label="Express — €12" description="Next working day" />
            </RadioGroup>
          </Fieldset>
          <Fieldset legend="Payment">
            <Alert variant="info">
              <AlertDescription>Demo template — no payment is taken.</AlertDescription>
            </Alert>
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
            <Checkbox name="news" value="yes" label="Send me the monthly letter" />
          </Fieldset>
          <Button type="submit" size="lg">
            Pay{" "}
            {new Intl.NumberFormat("en", { style: "currency", currency: CURRENCY }).format(total)}
          </Button>
        </Form>
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle as="h2">Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid divide-y divide-border">
              {cart.lines.map((l) => (
                <li key={`${l.id}-${l.color}`} className="flex items-center gap-3 py-3">
                  <img
                    src={sized(l.product.photo, 500)}
                    alt=""
                    className="size-14 rounded-sm bg-muted object-cover"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">{l.product.name}</p>
                    <p className="text-muted-foreground">
                      {l.product.colors.find((c) => c.id === l.color)?.name} · Qty {l.qty}
                    </p>
                  </div>
                  <Currency
                    value={l.product.price * l.qty}
                    currency={CURRENCY}
                    className="text-sm text-foreground"
                  />
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <Currency value={cart.subtotal} currency={CURRENCY} />
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              {shipping ? <Currency value={shipping} currency={CURRENCY} /> : <span>Free</span>}
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-md font-semibold">
              <span>Total</span>
              <Currency value={total} currency={CURRENCY} />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
