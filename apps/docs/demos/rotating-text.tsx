"use client";
import { RotatingText, Typewriter } from "@ux-sting/react/rotating-text";

export function Rotating() {
  return (
    <p className="text-3xl font-semibold tracking-tight">
      Build interfaces that are{" "}
      <RotatingText className="text-primary" words={["accessible", "fast", "themeable", "yours"]} />
    </p>
  );
}

export function TypewriterLoop() {
  return (
    <p className="font-mono text-lg">
      <span className="text-muted-foreground">$ </span>
      <Typewriter text={["npx ux-sting add dialog", "npx ux-sting add marquee", "pnpm ux-audit"]} />
    </p>
  );
}
