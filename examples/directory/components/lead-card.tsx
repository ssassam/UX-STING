"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unified-ui/react/card";
import { DatePicker } from "@unified-ui/react/date-picker";
import { Field } from "@unified-ui/react/field";
import { LeadForm } from "@unified-ui/react/lead-form";
import type { Place } from "../lib/data";

export function LeadCard({ place }: { place: Place }) {
  const isService = place.categoryId === "services";
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle as="h2" className="text-md">{isService ? "Request a quote" : "Contact the business"}</CardTitle>
        <CardDescription>Usually replies within a few hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <LeadForm
          hidePhone={!isService}
          labels={{ message: isService ? "Describe the job" : "Your message", submit: isService ? "Request quote" : "Send message" }}
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
