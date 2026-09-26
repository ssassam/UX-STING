"use client";
import { Highlight } from "@unified-ui/react/highlight";

export function Basic() {
  return (
    <p className="text-sm">
      <Highlight text="Crème brûlée at Café Atlas — the best café in town" query="cafe creme" />
    </p>
  );
}
