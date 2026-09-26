"use client";
import { Field } from "@ux-sting/react/field";
import { RangeSlider, Slider } from "@ux-sting/react/slider";

const eur = (v: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

export function Basic() {
  return (
    <div className="grid max-w-sm gap-8">
      <Field label="Distance">
        <Slider
          aria-label="Distance"
          defaultValue={[5]}
          max={50}
          formatValue={(v) => `${v} km`}
          showValue
        />
      </Field>
      <Field label="Price range">
        <RangeSlider
          defaultValue={[40, 160]}
          min={0}
          max={300}
          step={5}
          thumbLabels={["Minimum price", "Maximum price"]}
          formatValue={eur}
          showValue
        />
      </Field>
    </div>
  );
}
