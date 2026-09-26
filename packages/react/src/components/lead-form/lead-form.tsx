"use client";
import { CheckCircle2Icon, Building2Icon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { useState, type ReactNode } from "react";
import { Button } from "../button/button.js";
import { Card } from "../card/card.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Field } from "../field/field.js";
import { Form, FormErrorSummary, type FormValues } from "../form/form.js";
import { Input } from "../input/input.js";
import { Textarea } from "../textarea/textarea.js";
import { SuccessState } from "../state/state.js";

export interface LeadFormLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: ReactNode;
  submit: string;
  submitting: string;
  successTitle: string;
  successDescription?: ReactNode;
}

const defaultLabels: LeadFormLabels = {
  name: "Full name",
  email: "Email",
  phone: "Phone (optional)",
  message: "How can we help?",
  consent: "I agree to be contacted about my request.",
  submit: "Send request",
  submitting: "Sending…",
  successTitle: "Request sent",
  successDescription: "We'll get back to you shortly.",
};

export interface LeadFormProps {
  onSubmit: (values: FormValues) => void | Promise<void>;
  labels?: Partial<LeadFormLabels>;
  /** Hide the phone field. */
  hidePhone?: boolean;
  /** Extra fields (service type, date…). */
  extraFields?: ReactNode;
  className?: string;
}

/**
 * Contact/quote request form with visible labels, autocomplete hints,
 * inline validation, error summary and a success state.
 */
export function LeadForm({
  onSubmit,
  labels: labelOverrides,
  hidePhone,
  extraFields,
  className,
}: LeadFormProps) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  if (done)
    return (
      <SuccessState
        title={labels.successTitle}
        description={labels.successDescription}
        icon={<CheckCircle2Icon />}
        className={className}
      />
    );
  return (
    <Form
      className={className}
      onSubmit={async (values) => {
        setSubmitting(true);
        try {
          await onSubmit(values);
          setDone(true);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <FormErrorSummary />
      <Field name="name" label={labels.name} required>
        <Input autoComplete="name" />
      </Field>
      <div className={cn("grid gap-(--ui-stack-gap)", !hidePhone && "sm:grid-cols-2")}>
        <Field name="email" label={labels.email} required>
          <Input type="email" autoComplete="email" inputMode="email" />
        </Field>
        {hidePhone ? null : (
          <Field name="phone" label={labels.phone}>
            <Input type="tel" autoComplete="tel" inputMode="tel" />
          </Field>
        )}
      </div>
      {extraFields}
      <Field name="message" label={labels.message} required>
        <Textarea rows={4} />
      </Field>
      <Checkbox name="consent" value="yes" required label={labels.consent} />
      <Button
        type="submit"
        loading={submitting}
        loadingText={labels.submitting}
        className="justify-self-start"
      >
        {labels.submit}
      </Button>
    </Form>
  );
}

export interface ClaimBusinessProps {
  businessName: string;
  href?: string;
  onClaim?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  className?: string;
}

/** Call-to-action inviting owners to claim an unverified listing. */
export function ClaimBusiness({
  businessName,
  href,
  onClaim,
  title,
  description,
  actionLabel = "Claim this business",
  className,
}: ClaimBusinessProps) {
  return (
    <Card variant="filled" className={cn("flex-row items-start gap-4 p-card-p", className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs [&_svg]:size-5">
        <Building2Icon aria-hidden />
      </span>
      <div className="grid gap-2">
        <p className="font-semibold">{title ?? `Is this your business?`}</p>
        <p className="text-sm text-muted-foreground">
          {description ??
            `Claim ${businessName} to update information, reply to reviews and reach more customers.`}
        </p>
        {href ? (
          <Button asChild variant="outline" size="sm" className="justify-self-start">
            <a href={href}>{actionLabel}</a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onClaim} className="justify-self-start">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
