"use client";
import { useState } from "react";
import { Field } from "@ux-sting/react/field";
import { Textarea } from "@ux-sting/react/textarea";

export function AutoResize() {
  const [value, setValue] = useState("");
  return (
    <Field label="Your review" description="Share details of your experience." className="max-w-md">
      <Textarea
        autoResize
        maxLength={500}
        showCount
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Field>
  );
}
