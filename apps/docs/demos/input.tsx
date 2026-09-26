"use client";
import { Field } from "@unified-ui/react/field";
import { Input } from "@unified-ui/react/input";

export function Sizes() {
  return (
    <div className="grid max-w-sm gap-3">
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid max-w-sm gap-3">
      <Input aria-label="Default" placeholder="Default" />
      <Input variant="filled" aria-label="Filled" placeholder="Filled" />
    </div>
  );
}

export function States() {
  return (
    <div className="grid max-w-sm gap-3">
      <Field label="Disabled">
        <Input disabled defaultValue="Not editable" />
      </Field>
      <Field label="Read only">
        <Input readOnly defaultValue="INV-2024-0012" />
      </Field>
      <Field label="Invalid" error="Enter a valid phone number.">
        <Input type="tel" defaultValue="12" />
      </Field>
    </div>
  );
}
