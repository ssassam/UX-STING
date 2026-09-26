"use client";
import { Separator } from "@ux-sting/react/separator";

export function Basic() {
  return (
    <div className="grid gap-4 text-sm">
      <p>Account</p>
      <Separator />
      <div className="flex h-5 items-center gap-3">
        <span>Profile</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
        <Separator orientation="vertical" />
        <span>Team</span>
      </div>
      <Separator label="or" />
    </div>
  );
}
