"use client";
import { Card, CardContent } from "@ux-sting/react/card";
import { Reveal } from "@ux-sting/react/reveal";
import { TextEffect } from "@ux-sting/react/text-effect";

export function StaggeredCards() {
  return (
    <Reveal stagger={90} className="grid gap-4 sm:grid-cols-3">
      {["Tokens", "Components", "Quality checks"].map((title) => (
        <Card key={title}>
          <CardContent className="pt-6">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">Scroll this into view to replay.</p>
          </CardContent>
        </Card>
      ))}
    </Reveal>
  );
}

export function WithTextEffect() {
  return (
    <Reveal preset="fade">
      <TextEffect as="h3" preset="slide" className="text-2xl font-semibold">
        The headline waits until you get here
      </TextEffect>
    </Reveal>
  );
}
