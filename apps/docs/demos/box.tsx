"use client";
import { Box } from "@unified-ui/react/box";

export function Basic() {
  return (
    <Box
      as="section"
      aria-label="Example"
      className="rounded-lg border border-dashed border-border-strong p-6 text-sm text-muted-foreground"
    >
      A semantic &lt;section&gt; rendered by Box
    </Box>
  );
}
