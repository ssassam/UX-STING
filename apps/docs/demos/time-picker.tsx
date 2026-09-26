"use client";
import { Field } from "@unified-ui/react/field";
import { TimePicker } from "@unified-ui/react/time-picker";

export function Basic() {
  return (
    <Field label="Opening time" className="max-w-40">
      <TimePicker defaultValue="09:00" step={15} min="06:00" max="23:00" />
    </Field>
  );
}
