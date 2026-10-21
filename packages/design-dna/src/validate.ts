import { contrast } from "./color.js";
import type { DesignDNA } from "./types.js";

export interface DnaIssue {
  severity: "error" | "warning" | "info";
  code: string;
  path: string;
  message: string;
  /** Measured value, when the check is numeric. */
  actual?: number;
  expected?: string;
}

/**
 * Deterministic checks a DNA must pass before it is used to generate code.
 * Accessibility checks are errors: a reconstruction never copies a
 * contrast failure from its reference.
 */
export function validateDna(dna: DesignDNA): DnaIssue[] {
  const issues: DnaIssue[] = [];
  const c = dna.color;
  const pair = (
    path: string,
    fg: string,
    bg: string,
    min: number,
    severity: DnaIssue["severity"] = "error",
  ) => {
    const ratio = Math.round(contrast(fg, bg) * 100) / 100;
    if (ratio < min)
      issues.push({
        severity,
        code: "contrast",
        path,
        message: `Contrast ${ratio}:1 is below ${min}:1.`,
        actual: ratio,
        expected: `≥ ${min}`,
      });
  };
  pair("color.foreground", c.foreground, c.background, 4.5);
  pair("color.foreground/surface", c.foreground, c.surface, 4.5);
  pair("color.muted", c.muted, c.background, 4.5);
  if (c.heading) pair("color.heading", c.heading, c.background, 4.5);
  pair("color.accentForeground", c.accentForeground, c.accent, 4.5);
  pair("color.accent", c.accent, c.background, 3, "warning");
  if (c.inverse) pair("color.inverse", c.background, c.inverse, 4.5);

  const t = dna.typography;
  if (t.scale.steps.body < 16)
    issues.push({
      severity: "warning",
      code: "small-body",
      path: "typography.scale.steps.body",
      message: "Body text below 16px is hard to read on phones.",
      actual: t.scale.steps.body,
      expected: "≥ 16",
    });
  if (t.bodyLeading < 1.4)
    issues.push({
      severity: "warning",
      code: "tight-leading",
      path: "typography.bodyLeading",
      message: "Body line-height below 1.4.",
      actual: t.bodyLeading,
      expected: "≥ 1.4",
    });
  if (t.measure > 90 || t.measure < 40)
    issues.push({
      severity: "info",
      code: "measure",
      path: "typography.measure",
      message: "Body measure outside 40–90 characters.",
      actual: t.measure,
      expected: "45–75",
    });
  const s = t.scale.steps;
  if (!(s.small <= s.body && s.body < s.h3 && s.h3 <= s.h2 && s.h2 <= s.h1 && s.h1 <= s.display))
    issues.push({
      severity: "warning",
      code: "scale-order",
      path: "typography.scale.steps",
      message: "Type steps are not in ascending order.",
    });

  const l = dna.layout;
  if (l.container < 320 || l.container > 2400)
    issues.push({
      severity: "error",
      code: "container",
      path: "layout.container",
      message: "Container width must be 320–2400px.",
      actual: l.container,
    });
  if (!l.sections.length)
    issues.push({
      severity: "error",
      code: "no-sections",
      path: "layout.sections",
      message: "No sections.",
    });
  if (!l.sections.some((x) => x.role === "hero" || x.role === "intro"))
    issues.push({
      severity: "info",
      code: "no-hero",
      path: "layout.sections",
      message: "No opening section; the first content section will carry the h1.",
    });
  return issues;
}
