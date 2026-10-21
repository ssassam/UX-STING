"use client";
import { Swatch, SwatchGroup } from "@ux-sting/react/swatch";
import { useState } from "react";

const colors = [
  { value: "sand", label: "Sand", color: "oklch(0.82 0.06 80)" },
  { value: "terracotta", label: "Terracotta", color: "oklch(0.6 0.13 40)" },
  { value: "indigo", label: "Indigo", color: "oklch(0.4 0.12 270)" },
  { value: "sage", label: "Sage", color: "oklch(0.72 0.05 150)", unavailable: true },
  { value: "charcoal", label: "Charcoal", color: "oklch(0.3 0 0)" },
];

export function Colors() {
  const [value, setValue] = useState("terracotta");
  const selected = colors.find((c) => c.value === value);
  return (
    <div className="grid gap-2">
      <p id="color-label" className="text-sm font-medium">
        Color: <span className="text-muted-foreground">{selected?.label}</span>
      </p>
      <SwatchGroup aria-labelledby="color-label" value={value} onValueChange={setValue}>
        {colors.map((c) => (
          <Swatch key={c.value} {...c} />
        ))}
      </SwatchGroup>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid gap-2">
      <p id="size-label" className="text-sm font-medium">
        Size
      </p>
      <SwatchGroup aria-labelledby="size-label" defaultValue="m" name="size">
        {["XS", "S", "M", "L", "XL"].map((s) => (
          <Swatch key={s} value={s.toLowerCase()} label={s} unavailable={s === "XS"} />
        ))}
      </SwatchGroup>
    </div>
  );
}
