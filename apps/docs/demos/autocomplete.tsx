"use client";
import { Autocomplete } from "@ux-sting/react/autocomplete";
import { Field } from "@ux-sting/react/field";

const suggestions = [
  "Pizza",
  "Pizza napoletana",
  "Pasta",
  "Paella",
  "Pastries",
  "Poke bowl",
  "Pho",
  "Pad thai",
];

export function Basic() {
  return (
    <Field label="What are you craving?" className="max-w-sm">
      <Autocomplete
        suggestions={suggestions}
        placeholder="Try “pa”"
        emptyText="No suggestions — press Enter to search"
      />
    </Field>
  );
}
