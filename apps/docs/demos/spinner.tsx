"use client";
import { Spinner } from "@ux-sting/react/spinner";

export function Sizes() {
  return (
    <div className="flex items-center gap-4 text-primary">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Spinner key={s} size={s} />
      ))}
    </div>
  );
}
