"use client";
import { useState } from "react";
import { Field } from "@ux-sting/react/field";
import { OTPInput } from "@ux-sting/react/otp-input";

export function Basic() {
  const [done, setDone] = useState<string | null>(null);
  return (
    <Field
      label="Verification code"
      description={done ? `Submitted ${done}` : "Enter the 6-digit code we sent you."}
    >
      <OTPInput aria-label="Verification code" groupAfter={3} onComplete={setDone} />
    </Field>
  );
}
