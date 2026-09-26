"use client";
import { Field } from "@ux-sting/react/field";
import { Radio, RadioCard, RadioGroup } from "@ux-sting/react/radio-group";

export function Basic() {
  return (
    <Field label="Delivery">
      <RadioGroup defaultValue="standard">
        <Radio value="standard" label="Standard" description="3–5 business days" />
        <Radio value="express" label="Express" description="Next day" />
        <Radio value="pickup" label="Pick up in store" disabled />
      </RadioGroup>
    </Field>
  );
}

export function Cards() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="pro" className="grid gap-3 sm:grid-cols-3">
      <RadioCard value="free" label="Free" description="1 listing" />
      <RadioCard value="pro" label="Pro" description="10 listings, analytics" />
      <RadioCard value="business" label="Business" description="Unlimited, priority" />
    </RadioGroup>
  );
}
