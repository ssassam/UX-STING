"use client";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent } from "@ux-sting/react/card";
import { Field, Fieldset } from "@ux-sting/react/field";
import { Form, FormErrorSummary } from "@ux-sting/react/form";
import { Input } from "@ux-sting/react/input";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Currency } from "@ux-sting/react/price";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { SuccessState } from "@ux-sting/react/state";
import { Text } from "@ux-sting/react/typography";
import { useState } from "react";
import { finishes, WatchArt } from "./watch-art";

const models = [
  { id: "one", name: "Pulse One", price: 249, description: "Aluminium case, sport band" },
  {
    id: "pro",
    name: "Pulse One Pro",
    price: 349,
    description: "Titanium case, sapphire glass, LTE",
  },
];

export function Preorder() {
  const [model, setModel] = useState("one");
  const [size, setSize] = useState("44");
  const [finishId, setFinishId] = useState<string>(finishes[0].id);
  const [done, setDone] = useState<string | null>(null);
  const finish = finishes.find((f) => f.id === finishId)!;
  const price = models.find((m) => m.id === model)!.price + (size === "44" ? 20 : 0);

  if (done) {
    return (
      <SuccessState
        size="lg"
        headingLevel={3}
        title="You're on the list"
        description={`We've reserved your ${done}. We'll email you before it ships in November — you won't be charged until then.`}
        actions={
          <Button variant="outline" onClick={() => setDone(null)}>
            Reserve another
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="grid justify-items-center gap-4 lg:sticky lg:top-24">
        <WatchArt finish={finish} className="w-56 sm:w-72" />
        <Text variant="muted" size="sm">
          {models.find((m) => m.id === model)!.name} · {size} mm · {finish.name}
        </Text>
      </div>
      <Card>
        <CardContent className="p-5 sm:p-6">
          <Form
            onSubmit={async () => {
              await new Promise((r) => setTimeout(r, 800));
              setDone(`${models.find((m) => m.id === model)!.name} ${size} mm in ${finish.name}`);
            }}
          >
            <FormErrorSummary />
            <Fieldset legend="Model">
              <RadioGroup
                value={model}
                onValueChange={setModel}
                className="grid gap-3 sm:grid-cols-2"
              >
                {models.map((m) => (
                  <RadioCard
                    key={m.id}
                    value={m.id}
                    label={`${m.name} — €${m.price}`}
                    description={m.description}
                  />
                ))}
              </RadioGroup>
            </Fieldset>
            <Fieldset legend="Case size">
              <RadioGroup
                value={size}
                onValueChange={setSize}
                orientation="horizontal"
                className="grid grid-cols-2 gap-3"
              >
                <RadioCard value="40" label="40 mm" description="Fits wrists 130–200 mm" />
                <RadioCard value="44" label="44 mm · +€20" description="Fits wrists 140–220 mm" />
              </RadioGroup>
            </Fieldset>
            <Fieldset legend={`Finish: ${finish.name}`}>
              <div role="radiogroup" aria-label="Finish" className="flex gap-3">
                {finishes.map((f) => {
                  const on = f.id === finishId;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={f.name}
                      onClick={() => setFinishId(f.id)}
                      className={`ui-hit-area flex size-10 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${on ? "border-foreground" : "border-transparent"}`}
                    >
                      <span
                        className="size-8 rounded-full border border-border-strong"
                        style={{ background: f.caseColor }}
                      />
                    </button>
                  );
                })}
              </div>
            </Fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="email"
                label="Email"
                required
                description="We'll confirm your reservation."
              >
                <Input type="email" autoComplete="email" />
              </Field>
              <Field name="country" label="Country" required>
                <NativeSelect autoComplete="country" defaultValue="FR">
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="MA">Morocco</option>
                </NativeSelect>
              </Field>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div>
                <Currency
                  value={price}
                  currency="EUR"
                  fractionDigits={0}
                  className="text-2xl font-semibold text-foreground"
                />
                <p className="text-sm text-muted-foreground">Pay nothing today · ships November</p>
              </div>
              <Button type="submit" size="lg">
                Reserve mine
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
