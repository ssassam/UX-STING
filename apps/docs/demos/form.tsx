"use client";
import { Button } from "@ux-sting/react/button";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary, useFormState } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { PasswordInput } from "@ux-sting/react/password-input";
import { toast } from "@ux-sting/react/toast";

function SubmitButton() {
  const { submitting } = useFormState();
  return (
    <Button
      type="submit"
      loading={submitting}
      loadingText="Creating account…"
      className="justify-self-start"
    >
      Create account
    </Button>
  );
}

export function Validation() {
  return (
    <Form
      className="max-w-md"
      validate={(values) =>
        String(values.email).endsWith("@example.com")
          ? { email: "Use your work email, not example.com." }
          : undefined
      }
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 800));
        toast.success("Account created", { description: String(values.email) });
      }}
    >
      <FormErrorSummary />
      <Field name="name" label="Full name" required>
        <Input autoComplete="name" />
      </Field>
      <Field name="email" label="Work email" description="We'll send a confirmation link." required>
        <Input type="email" autoComplete="email" />
      </Field>
      <Field name="password" label="Password" description="At least 8 characters." required>
        <PasswordInput minLength={8} autoComplete="new-password" />
      </Field>
      <SubmitButton />
    </Form>
  );
}

export function Grouped() {
  return (
    <Form className="max-w-lg">
      <Fieldset legend="Billing address" description="Used on invoices.">
        <Field name="street" label="Street" required>
          <Input autoComplete="street-address" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="city" label="City" required>
            <Input autoComplete="address-level2" />
          </Field>
          <Field name="postal" label="Postal code">
            <Input autoComplete="postal-code" inputMode="numeric" />
          </Field>
        </div>
      </Fieldset>
    </Form>
  );
}
