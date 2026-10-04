"use client";
import { Button } from "@ux-sting/react/button";
import { AddressFields, PaymentFields } from "@ux-sting/react/checkout-fields";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { useState } from "react";

const countries = [
  { value: "MA", label: "Morocco" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "GB", label: "United Kingdom" },
];

export function Checkout() {
  const [paid, setPaid] = useState(false);
  if (paid) return <p role="status">Thanks! This demo did not send anything.</p>;
  return (
    <Form className="max-w-xl" onSubmit={() => setPaid(true)}>
      <FormErrorSummary />
      <AddressFields legend="Shipping address" countries={countries} defaultCountry="MA" />
      <PaymentFields legend="Payment" />
      <Button type="submit" size="lg">
        Pay €429.30
      </Button>
    </Form>
  );
}
