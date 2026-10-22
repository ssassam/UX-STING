"use client";
import { useSplitHeading } from "@ux-sting/motion/gsap";
import { useRef } from "react";
import { Command } from "./command";
import { CreditedFigure } from "./figure";

export function Hero() {
  const title = useRef<HTMLHeadingElement>(null);
  useSplitHeading(title, { type: "words" });
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:pt-16"
    >
      <div className="grid gap-6">
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          A design toolkit for AI coding agents
        </p>
        <h1
          id="hero-title"
          ref={title}
          className="font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl"
        >
          Measure before you draw.
        </h1>
        <p className="max-w-xl text-lg text-pretty text-muted-foreground">
          The instruments a designer keeps in the case, built for AI agents: a browser that checks
          the page, a tool that measures a design, an archive of free pictures, a way to choose a
          direction, and motion. Everything below is real tool output.
        </p>
        <div className="grid max-w-xl gap-2">
          <Command>npx ux-sting qa http://localhost:3000</Command>
        </div>
      </div>
      <CreditedFigure
        file="pocket-set-of-drawing-instruments-ca-1755-60.jpg"
        alt="An eighteenth-century green shagreen case standing open, with its brass and ivory rulers, dividers and ruling pens laid out beside it."
        priority
      />
    </section>
  );
}
