"use client";
import { Marquee } from "@ux-sting/react/marquee";

const logos = ["Wayfare", "Drivo", "Maison Nord", "Ember", "Atlas", "Northwind", "Lumen", "Kasbah"];

export function Logos() {
  return (
    <Marquee label="Teams building with UX-STING" duration={30} className="py-4">
      {logos.map((name) => (
        <span key={name} className="text-xl font-semibold tracking-tight text-muted-foreground">
          {name}
        </span>
      ))}
    </Marquee>
  );
}

export function Reverse() {
  return (
    <Marquee label="Topics" reverse duration={45} className="py-2">
      {["Accessibility", "RTL", "Dark mode", "Density", "Tokens", "Forms", "Motion"].map((t) => (
        <span key={t} className="rounded-full border border-border px-3 py-1 text-sm">
          {t}
        </span>
      ))}
    </Marquee>
  );
}
