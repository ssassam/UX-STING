"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ux-sting/react/card";
import { DatePicker } from "@ux-sting/react/date-picker";
import { Field } from "@ux-sting/react/field";
import { LeadForm } from "@ux-sting/react/lead-form";
import type { Place } from "../lib/data";

export function LeadCard({ place }: { place: Place }) {
  const isService = place.categoryId === "services";
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle as="h2" className="text-md">
          {isService ? "Request a quote" : "Contact the business"}
        </CardTitle>
        <CardDescription>Usually replies within a few hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <LeadForm
          hidePhone={!isService}
          labels={{
            message: isService ? "Describe the job" : "Your message",
            submit: isService ? "Request quote" : "Send message",
          }}
          extraFields={
            <Field label={isService ? "Preferred date" : "Visit date"}>
              <DatePicker name="date" min={new Date()} />
            </Field>
          }
          onSubmit={() => new Promise((r) => setTimeout(r, 700))}
        />
      </CardContent>
    </Card>
  );
}
