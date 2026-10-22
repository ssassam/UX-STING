"use client";
import { ScrollTrigger, gsap, useMotion } from "@ux-sting/motion/gsap";
import { useRef } from "react";
import { qaRuns } from "../lib/data";
import { Section } from "./section";

const steps = [
  ["Read the brief", "Five lines: what, for whom, where, the one action, the constraints."],
  [
    "List what is unique",
    "Specifics no competitor shares. If a line could describe a rival, it goes.",
  ],
  [
    "Deal three directions",
    "Researched in the client's own world, different in type, palette or layout.",
  ],
  [
    "Pick one, write the concept",
    "“[Client] as [image], because [specific].” Everything serves that sentence.",
  ],
  [
    "Use real images",
    "From open archives, credited automatically. Never stock, never fake screenshots.",
  ],
  [
    "Prove it in the browser",
    "QA at three widths, fix the top three, critique the screenshots, fix again.",
  ],
];

export function TasteSection() {
  const scope = useRef<HTMLDivElement>(null);
  // Steps settle into place as the list scrolls through the viewport (no pin:
  // a short grid does not earn a screen of dead scroll).
  useMotion(
    ({ reduced }) => {
      // On one-column phones the list is long; faded steps would just be hard to read.
      if (reduced || !window.matchMedia("(min-width: 768px)").matches) return;
      gsap.from("[data-step]", {
        opacity: 0.35,
        y: 16,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 85%", end: "top 40%", scrub: 0.6 },
      });
      ScrollTrigger.refresh();
    },
    { scope },
  );
  const slop = qaRuns.find((r) => r.key === "slop")!;
  const checks = slop.findings.filter((f) => f.category === "taste");
  return (
    <Section
      id="taste"
      number="04"
      kicker="Art direction"
      title="A direction first, then the page."
      intro={
        <p>
          The <code>ux-sting-taste</code> skill makes the agent work like an art director. This page
          went through it: the concept is &ldquo;UX-STING as a draughtsman&rsquo;s instrument case,
          because every tool measures before it draws&rdquo;. That chose the editorial theme, the
          hairline index and the museum drawings.
        </p>
      }
    >
      <div ref={scope} className="grid gap-12">
        <div className="grid gap-6">
          <ol data-steps className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map(([t, d], i) => (
              <li
                key={t}
                data-step
                className="pipeline-step grid gap-2 border-t border-border pt-4"
              >
                <span className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl">{t}</span>
                <span className="text-sm text-muted-foreground">{d}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3">
          <h3 className="font-display text-2xl">And it checks for the usual tells</h3>
          <p className="text-muted-foreground">
            QA runs anti-slop checks next to accessibility. On the generic test page it named:
          </p>
          <ul className="flex flex-wrap gap-2">
            {checks.map((f) => (
              <li
                key={f.id}
                className="rounded-sm border border-border px-3 py-1.5 font-mono text-sm"
                title={f.message}
              >
                {f.id}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Taste findings never fail a run on their own; they go to the person as judgment, not
            measurement.
          </p>
        </div>
      </div>
    </Section>
  );
}
