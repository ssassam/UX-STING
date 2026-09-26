"use client";
import { SkipLink } from "@ux-sting/react/skip-link";

export function Basic() {
  return (
    <div className="relative h-24 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground [transform:translateZ(0)]">
      Press Tab inside this example to reveal the skip link.
      <SkipLink href="#main" className="absolute">
        Skip to content
      </SkipLink>
    </div>
  );
}
