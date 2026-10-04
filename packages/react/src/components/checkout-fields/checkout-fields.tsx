"use client";
import { LockIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { type ChangeEvent, type ReactNode } from "react";
import { Field, Fieldset } from "../field/field.js";
import { Input } from "../input/input.js";
import { NativeSelect } from "../native-select/native-select.js";

export interface AddressFieldsLabels {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneHint: string;
}

const addressDefaults: AddressFieldsLabels = {
  fullName: "Full name",
  line1: "Address",
  line2: "Apartment, suite, etc. (optional)",
  city: "City",
  region: "State / region",
  postalCode: "Postal code",
  country: "Country",
  phone: "Phone",
  phoneHint: "For delivery questions only.",
};

export interface AddressFieldsProps {
  /** Group legend, e.g. "Shipping address". */
  legend: ReactNode;
  /**
   * Autofill section and field-name prefix. Field names are `<section>.<field>`
   * (`shipping.line1`), so a shipping and a billing group can share one Form.
   */
  section?: "shipping" | "billing";
  /** Country options; when omitted the country is a text field. */
  countries?: Array<{ value: string; label: string }>;
  defaultCountry?: string;
  /** Hide the region field (countries without states). */
  hideRegion?: boolean;
  /** Hide the phone field. */
  hidePhone?: boolean;
  labels?: Partial<AddressFieldsLabels>;
  disabled?: boolean;
  className?: string;
}

/**
 * Address block for checkout: visible labels, the right `autoComplete`
 * tokens per section (so browsers and password managers fill it in one
 * tap), mobile keyboards per field and required validation through `Form`.
 * Adapted from the Storefront UI checkout address block (MIT).
 */
export function AddressFields({
  legend,
  section = "shipping",
  countries,
  defaultCountry,
  hideRegion,
  hidePhone,
  labels: overrides,
  disabled,
  className,
}: AddressFieldsProps) {
  const l = { ...addressDefaults, ...overrides };
  const n = (key: string) => `${section}.${key}`;
  const ac = (token: string) => `${section} ${token}`;
  return (
    <Fieldset legend={legend} disabled={disabled} className={className}>
      <Field name={n("fullName")} label={l.fullName} required>
        <Input autoComplete={ac("name")} />
      </Field>
      <Field name={n("country")} label={l.country} required>
        {countries ? (
          <NativeSelect autoComplete={ac("country")} defaultValue={defaultCountry}>
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </NativeSelect>
        ) : (
          <Input autoComplete={ac("country-name")} defaultValue={defaultCountry} />
        )}
      </Field>
      <Field name={n("line1")} label={l.line1} required>
        <Input autoComplete={ac("address-line1")} />
      </Field>
      <Field name={n("line2")} label={l.line2}>
        <Input autoComplete={ac("address-line2")} />
      </Field>
      <div
        className={cn("grid gap-(--ui-stack-gap) sm:grid-cols-2", !hideRegion && "md:grid-cols-3")}
      >
        <Field name={n("city")} label={l.city} required>
          <Input autoComplete={ac("address-level2")} />
        </Field>
        {hideRegion ? null : (
          <Field name={n("region")} label={l.region}>
            <Input autoComplete={ac("address-level1")} />
          </Field>
        )}
        <Field name={n("postalCode")} label={l.postalCode} required>
          <Input autoComplete={ac("postal-code")} autoCapitalize="characters" />
        </Field>
      </div>
      {hidePhone ? null : (
        <Field name={n("phone")} label={l.phone} description={l.phoneHint}>
          <Input type="tel" inputMode="tel" autoComplete={ac("tel")} />
        </Field>
      )}
    </Fieldset>
  );
}

export interface PaymentFieldsLabels {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  expiryHint: string;
  cvc: string;
  cvcHint: string;
  secure: ReactNode;
}

const paymentDefaults: PaymentFieldsLabels = {
  cardNumber: "Card number",
  nameOnCard: "Name on card",
  expiry: "Expiry date",
  expiryHint: "MM / YY",
  cvc: "Security code",
  cvcHint: "3 or 4 digits on the back of the card",
  secure: "Payments are encrypted and processed securely.",
};

/** Groups digits by four ("4242 4242 4242 4242") as the user types. */
function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Inserts the " / " between month and year ("0827" → "08 / 27"). */
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

const reformat = (format: (v: string) => string) => (e: ChangeEvent<HTMLInputElement>) => {
  e.currentTarget.value = format(e.currentTarget.value);
};

export interface PaymentFieldsProps {
  legend: ReactNode;
  /** Field-name prefix. Default `"payment"` → `payment.cardNumber`. */
  name?: string;
  labels?: Partial<PaymentFieldsLabels>;
  /** Accepted-card logos or a wallet button row, shown under the legend. */
  accepted?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Card payment fields with `cc-*` autofill, numeric keyboards, as-you-type
 * formatting and format validation. For real payments, render your payment
 * provider's hosted fields inside the same layout instead, so card data
 * never touches your servers (PCI DSS).
 */
export function PaymentFields({
  legend,
  name = "payment",
  labels: overrides,
  accepted,
  disabled,
  className,
}: PaymentFieldsProps) {
  const l = { ...paymentDefaults, ...overrides };
  const n = (key: string) => `${name}.${key}`;
  return (
    <Fieldset legend={legend} disabled={disabled} className={className}>
      {accepted ? <div className="-mt-2 flex flex-wrap items-center gap-2">{accepted}</div> : null}
      <Field name={n("cardNumber")} label={l.cardNumber} required>
        <Input
          autoComplete="cc-number"
          inputMode="numeric"
          pattern="[0-9 ]{14,23}"
          maxLength={23}
          className="tabular-nums"
          onChange={reformat(formatCardNumber)}
        />
      </Field>
      <Field name={n("nameOnCard")} label={l.nameOnCard} required>
        <Input autoComplete="cc-name" />
      </Field>
      <div className="grid gap-(--ui-stack-gap) sm:grid-cols-2">
        <Field name={n("expiry")} label={l.expiry} description={l.expiryHint} required>
          <Input
            autoComplete="cc-exp"
            inputMode="numeric"
            pattern="(0[1-9]|1[0-2]) ?/ ?[0-9]{2}"
            maxLength={7}
            className="tabular-nums"
            onChange={reformat(formatExpiry)}
          />
        </Field>
        <Field name={n("cvc")} label={l.cvc} description={l.cvcHint} required>
          <Input
            autoComplete="cc-csc"
            inputMode="numeric"
            pattern="[0-9]{3,4}"
            maxLength={4}
            className="tabular-nums"
          />
        </Field>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <LockIcon aria-hidden className="size-3.5 shrink-0" />
        {l.secure}
      </p>
    </Fieldset>
  );
}
