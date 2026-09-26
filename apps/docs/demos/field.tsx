"use client";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ux-sting/react/field";
import { Input } from "@ux-sting/react/input";

export function Basic() {
  return (
    <Field
      label="Business name"
      description="As it appears on your storefront."
      required
      className="max-w-sm"
    >
      <Input placeholder="e.g. Café Atlas" />
    </Field>
  );
}

export function ErrorState() {
  return (
    <Field error="This handle is already taken." className="max-w-sm">
      <FieldLabel>Handle</FieldLabel>
      <Input defaultValue="atlas" />
      <FieldDescription>Letters, numbers and dashes only.</FieldDescription>
      <FieldError />
    </Field>
  );
}

export function Horizontal() {
  return (
    <Field label="Website" orientation="horizontal" description="Optional" className="max-w-xl">
      <Input type="url" placeholder="https://" />
    </Field>
  );
}
