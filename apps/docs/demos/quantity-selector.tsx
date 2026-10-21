"use client";
import { Field } from "@ux-sting/react/field";
import { QuantitySelector } from "@ux-sting/react/quantity-selector";

export function Default() {
  return <QuantitySelector stock={8} defaultValue={1} />;
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <QuantitySelector size="sm" aria-label="Quantity, small" />
      <QuantitySelector size="md" aria-label="Quantity, medium" />
      <QuantitySelector size="lg" aria-label="Quantity, large" />
    </div>
  );
}

export function InField() {
  return (
    <Field label="Tickets" description="Up to 6 per order">
      <QuantitySelector max={6} name="tickets" />
    </Field>
  );
}
