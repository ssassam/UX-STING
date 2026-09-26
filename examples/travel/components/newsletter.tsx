"use client";
import { SendIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Field } from "@ux-sting/react/field";
import { Form } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { toast } from "@ux-sting/react/toast";

export function Newsletter() {
  return (
    <Form
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
      onSubmit={async (values, event) => {
        const form = event.currentTarget;
        await new Promise((r) => setTimeout(r, 600));
        toast.success("You're on the list", {
          description: `Travel deals will go to ${String(values.email)}.`,
        });
        form.reset();
      }}
    >
      <Field name="email" label="Email address" required>
        <Input type="email" autoComplete="email" placeholder="you@example.com" size="lg" />
      </Field>
      <Button type="submit" size="lg" startIcon={<SendIcon />} className="sm:mt-7">
        Subscribe
      </Button>
    </Form>
  );
}
