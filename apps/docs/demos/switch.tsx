"use client";
import { Switch } from "@unified-ui/react/switch";

export function Basic() {
  return (
    <div className="grid max-w-sm gap-4">
      <Switch
        label="Email notifications"
        description="Receive booking confirmations."
        defaultChecked
      />
      <Switch label="Show on map" labelPosition="start" />
      <Switch label="Small" size="sm" />
      <Switch label="Disabled" disabled />
    </div>
  );
}
