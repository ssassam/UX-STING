"use client";
import { MailIcon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { Card } from "@unified-ui/react/card";
import { Field } from "@unified-ui/react/field";
import { Form } from "@unified-ui/react/form";
import { Input } from "@unified-ui/react/input";
import { SuccessState } from "@unified-ui/react/state";
import { useState } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <Card variant="filled" className="p-card-p">
      {done ? (
        <SuccessState
          size="sm"
          headingLevel={2}
          title="You're subscribed"
          description="The next issue arrives on Friday."
        />
      ) : (
        <Form
          aria-labelledby="newsletter-title"
          className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
          onSubmit={() =>
            new Promise<void>((r) =>
              setTimeout(() => {
                setDone(true);
                r();
              }, 600),
            )
          }
        >
          <div className="grid gap-1 sm:col-span-2">
            <h2
              id="newsletter-title"
              className="flex items-center gap-2 text-lg font-semibold [&_svg]:size-5"
            >
              <MailIcon aria-hidden /> The Friday letter
            </h2>
            <p className="text-sm text-muted-foreground">
              One email a week with our best stories. No spam, unsubscribe anytime.
            </p>
          </div>
          <Field name="email" label="Email address" required>
            <Input type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>
          <Button type="submit">Subscribe</Button>
        </Form>
      )}
    </Card>
  );
}
