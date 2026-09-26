"use client";
import { Field } from "@ux-sting/react/field";
import { PasswordInput } from "@ux-sting/react/password-input";

export function Basic() {
  return (
    <Field label="Password" className="max-w-sm">
      <PasswordInput />
    </Field>
  );
}
