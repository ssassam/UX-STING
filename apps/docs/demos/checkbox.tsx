"use client";
import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@unified-ui/react/checkbox";

export function Basic() {
  return (
    <div className="grid gap-3">
      <Checkbox label="Accept terms and conditions" />
      <Checkbox label="Send me offers" description="At most one email per month." defaultChecked />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}

export function Group() {
  return (
    <CheckboxGroup legend="Amenities" defaultValue={["wifi"]} orientation="horizontal">
      <Checkbox value="wifi" label="Wi-Fi" />
      <Checkbox value="parking" label="Parking" />
      <Checkbox value="terrace" label="Terrace" />
      <Checkbox value="accessible" label="Wheelchair accessible" />
    </CheckboxGroup>
  );
}

export function Indeterminate() {
  const [items, setItems] = useState({ a: true, b: false });
  const all = items.a && items.b;
  const some = items.a || items.b;
  return (
    <div className="grid gap-2">
      <Checkbox
        label="Select all"
        checked={all ? true : some ? "indeterminate" : false}
        onCheckedChange={(v) => setItems({ a: v === true, b: v === true })}
      />
      <div className="grid gap-2 ps-6">
        <Checkbox
          label="Breakfast"
          checked={items.a}
          onCheckedChange={(v) => setItems({ ...items, a: v === true })}
        />
        <Checkbox
          label="Dinner"
          checked={items.b}
          onCheckedChange={(v) => setItems({ ...items, b: v === true })}
        />
      </div>
    </div>
  );
}
