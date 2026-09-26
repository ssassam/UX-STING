"use client";
import { useState } from "react";
import { Combobox } from "@ux-sting/react/combobox";
import { Field } from "@ux-sting/react/field";
import { cities } from "./_data";

export function Basic() {
  const [value, setValue] = useState<string | null>("rabat");
  return (
    <Field label="City" description={`Selected: ${value ?? "none"}`} className="max-w-xs">
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
        placeholder="Choose a city"
        clearable
      />
    </Field>
  );
}

export function Async() {
  const [options, setOptions] = useState(cities.slice(0, 3));
  const [loading, setLoading] = useState(false);
  return (
    <Field label="Search cities (async)" className="max-w-xs">
      <Combobox
        options={options}
        loading={loading}
        onSearchChange={(q) => {
          setLoading(true);
          setTimeout(() => {
            setOptions(cities.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())));
            setLoading(false);
          }, 400);
        }}
      />
    </Field>
  );
}
