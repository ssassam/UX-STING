"use client";
import { Button } from "@ux-sting/react/button";
import { Field } from "@ux-sting/react/field";
import { Form } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { toast } from "@ux-sting/react/toast";

export function Newsletter() {
  return (
    <Form
      className="flex max-w-sm items-start gap-2"
      onSubmit={async (values, event) => {
        const form = event.currentTarget;
        await new Promise((r) => setTimeout(r, 500));
        toast.success("Welcome to the letters", { description: String(values.email) });
        form.reset();
      }}
    >
      <Field name="email" label="Email for our monthly letter" required className="flex-1">
        <Input type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Button type="submit" className="mt-7">
        Join
      </Button>
    </Form>
  );
}
