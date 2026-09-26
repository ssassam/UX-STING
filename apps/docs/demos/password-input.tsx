"use client";
import { Field } from "@unified-ui/react/field";
import { PasswordInput } from "@unified-ui/react/password-input";

export function Basic() {
  return (
    <Field label="Password" className="max-w-sm">
      <PasswordInput />
    </Field>
  );
}
