"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Reveal, RevealGroup } from "@ux-sting/react/reveal";

const features = [
  ["Tokens first", "Every color, radius and duration is a CSS variable."],
  ["Accessible by default", "Keyboard, screen readers and reduced motion are covered."],
  ["RTL ready", "Logical properties mirror every layout."],
  ["Tree-shakeable", "Import one component, ship one component."],
];

export function Group() {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2">
      {features.map(([title, text]) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{text}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </RevealGroup>
  );
}

export function Effects() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["fade", "slide-start", "scale"] as const).map((effect) => (
        <Reveal
          key={effect}
          effect={effect}
          className="rounded-lg bg-muted p-6 text-center text-sm"
        >
          {effect}
        </Reveal>
      ))}
    </div>
  );
}
