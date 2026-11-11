"use client";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { measures } from "../content/site";

/** The measured strip: every count from the README, set like readings on a spec sheet. */
export function Measures() {
  return (
    <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
      {measures.map((m, i) => (
        <div
          key={m.label}
          className={`grid content-start gap-1 border-border p-4 sm:p-6 ${i % 2 ? "border-s" : ""} ${i % 4 ? "sm:border-s" : "sm:border-s-0"} ${i >= 2 ? "max-sm:border-t" : ""} ${i >= 4 ? "sm:border-t" : ""}`}
        >
          <dt className="spec-label order-2 text-muted-foreground">{m.label}</dt>
          <dd className="measure order-1 text-4xl font-semibold sm:text-5xl">
            <AnimatedNumber value={m.value} duration={1100} />
          </dd>
          <dd className="order-3 text-xs text-muted-foreground">{m.note}</dd>
        </div>
      ))}
    </dl>
  );
}
