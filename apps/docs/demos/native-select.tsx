"use client";
import { Field } from "@unified-ui/react/field";
import { NativeSelect } from "@unified-ui/react/native-select";

export function Basic() {
  return (
    <Field label="Country" className="max-w-xs">
      <NativeSelect defaultValue="ma" autoComplete="country">
        <option value="fr">France</option>
        <option value="ma">Morocco</option>
        <option value="es">Spain</option>
      </NativeSelect>
    </Field>
  );
}
