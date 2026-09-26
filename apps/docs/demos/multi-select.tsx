"use client";
import { Field } from "@ux-sting/react/field";
import { MultiSelect } from "@ux-sting/react/multi-select";
import { amenities } from "./_data";

export function Basic() {
  return (
    <Field label="Amenities" description="Choose up to 5." className="max-w-md">
      <MultiSelect
        options={amenities}
        defaultValue={["wi-fi", "terrace"]}
        maxSelected={5}
        placeholder="Add amenities"
      />
    </Field>
  );
}
