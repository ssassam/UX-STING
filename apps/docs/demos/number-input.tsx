"use client";
import { Field } from "@unified-ui/react/field";
import { NumberInput } from "@unified-ui/react/number-input";

export function Basic() {
  return (
    <Field label="Guests" className="max-w-40">
      <NumberInput defaultValue={2} min={1} max={12} />
    </Field>
  );
}

export function Currency() {
  return (
    <Field label="Budget per night" className="max-w-56">
      <NumberInput
        defaultValue={120}
        min={0}
        step={5}
        formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
      />
    </Field>
  );
}
