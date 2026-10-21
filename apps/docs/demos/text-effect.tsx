"use client";
import { Button } from "@ux-sting/react/button";
import { TextEffect, TextShimmer } from "@ux-sting/react/text-effect";
import { useState } from "react";

export function Headline() {
  const [run, setRun] = useState(0);
  return (
    <div className="grid justify-items-start gap-4">
      <TextEffect
        key={run}
        as="h2"
        preset="blur"
        className="text-4xl font-semibold tracking-tight text-balance"
      >
        Interfaces that feel designed, not generated
      </TextEffect>
      <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  );
}

export function PerCharacter() {
  return (
    <TextEffect as="p" per="char" preset="slide" className="text-2xl font-medium">
      Hand-tuned motion
    </TextEffect>
  );
}

export function Shimmer() {
  return <TextShimmer className="text-sm font-medium">Generating your itinerary…</TextShimmer>;
}
