"use client";
import { Container } from "@unified-ui/react/container";

export function Sizes() {
  return (
    <div className="grid gap-3">
      {(["sm", "md", "prose"] as const).map((size) => (
        <Container key={size} size={size} className="rounded-md bg-muted py-3 text-center text-sm">
          Container size=&quot;{size}&quot;
        </Container>
      ))}
    </div>
  );
}
