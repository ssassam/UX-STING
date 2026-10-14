import { ensureContrast } from "./color.js";
import type { DnaFidelity } from "./compare.js";
import { validateDna } from "./validate.js";
import type { DesignDNA } from "./types.js";

/** Findings from rendering the generated page in a browser. */
export interface PageQa {
  viewport: number;
  /** Horizontal overflow in px (0 = none). */
  overflowX: number;
  /** Elements wider than the viewport, as selectors. */
  overflowing: string[];
  /** Text squeezed into very narrow boxes (wrapping onto 3+ lines). */
  cramped?: string[];
  /** axe-core violations by id and impact. */
  a11y: Array<{ id: string; impact: string | null; nodes: number }>;
  /** Pixel comparison against the reference, when there is one. */
  mismatch?: number;
}

export interface Fix {
  kind: "accessibility" | "layout" | "fidelity";
  path: string;
  from: unknown;
  to: unknown;
  reason: string;
}

const get = (obj: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>(
      (o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined),
      obj,
    );

function set(obj: unknown, path: string, value: unknown) {
  const keys = path.split(".");
  let o = obj as Record<string, unknown>;
  for (const k of keys.slice(0, -1)) o = o[k] as Record<string, unknown>;
  o[keys.at(-1)!] = value;
}

/**
 * Deterministic corrections, in priority order:
 *  1. accessibility (contrast) — always applied, even if the reference fails;
 *  2. layout (overflow) — never trade responsiveness for fidelity;
 *  3. fidelity — move measured values towards the reference.
 */
export function proposeFixes(
  dna: DesignDNA,
  {
    reference,
    measured,
    fidelity,
    qa = [],
  }: { reference?: DesignDNA; measured?: DesignDNA; fidelity?: DnaFidelity; qa?: PageQa[] },
): Fix[] {
  const fixes: Fix[] = [];

  for (const issue of validateDna(dna).filter(
    (i) => i.code === "contrast" && i.severity === "error",
  )) {
    const c = dna.color;
    if (issue.path === "color.muted")
      fixes.push({
        kind: "accessibility",
        path: "color.muted",
        from: c.muted,
        to: ensureContrast(c.muted, c.background),
        reason: issue.message,
      });
    if (issue.path === "color.foreground" || issue.path === "color.foreground/surface")
      fixes.push({
        kind: "accessibility",
        path: "color.foreground",
        from: c.foreground,
        to: ensureContrast(ensureContrast(c.foreground, c.background), c.surface),
        reason: issue.message,
      });
    if (issue.path === "color.accentForeground")
      fixes.push({
        kind: "accessibility",
        path: "color.accentForeground",
        from: c.accentForeground,
        to: ensureContrast(c.accentForeground, c.accent),
        reason: issue.message,
      });
  }
  if (
    qa.some((q) => q.a11y.some((v) => v.id === "color-contrast")) &&
    !fixes.some((f) => f.path === "color.muted")
  )
    fixes.push({
      kind: "accessibility",
      path: "color.muted",
      from: dna.color.muted,
      to: ensureContrast(dna.color.muted, dna.color.surface),
      reason: "axe reported color-contrast; muted text checked against the surface color too.",
    });

  const mobileOverflow = qa.find((q) => q.viewport < 768 && q.overflowX > 0);
  if (mobileOverflow) {
    const display = dna.typography.scale.steps.display;
    fixes.push({
      kind: "layout",
      path: "typography.scale.steps.display",
      from: display,
      to: Math.round(display * 0.85),
      reason: `Horizontal overflow of ${mobileOverflow.overflowX}px at ${mobileOverflow.viewport}px (${mobileOverflow.overflowing.slice(0, 3).join(", ")}).`,
    });
  }

  const crampedHeading = qa.find(
    (q) => q.viewport < 768 && q.cramped?.some((c) => c.startsWith("h1")),
  );
  if (crampedHeading) {
    const current =
      dna.typography.scale.mobileDisplay ?? Math.round(dna.typography.scale.steps.display * 0.55);
    const target = Math.min(current - 2, Math.round(crampedHeading.viewport * 0.105));
    fixes.push({
      kind: "layout",
      path: "typography.scale.mobileDisplay",
      from: current,
      to: target,
      reason: `The h1 wraps to a few characters per line at ${crampedHeading.viewport}px (${current}px type).`,
    });
  }

  if (reference && measured && fidelity) {
    // Type sizes: scale our DNA by reference / measured so the rendered value lands on the reference.
    for (const k of ["body", "h3", "h2", "h1", "display"] as const) {
      const r = reference.typography.scale.steps[k];
      const m = measured.typography.scale.steps[k];
      const cur = dna.typography.scale.steps[k];
      if (m > 0 && Math.abs(r - m) / r > 0.06)
        fixes.push({
          kind: "fidelity",
          path: `typography.scale.steps.${k}`,
          from: cur,
          to: Math.round(cur * (r / m)),
          reason: `Rendered ${k} is ${m}px; the reference is ${r}px.`,
        });
    }
    const containerDelta = reference.layout.container - measured.layout.container;
    if (Math.abs(containerDelta) > 16) {
      // When the page padding caps the width, widening the container changes nothing.
      const cappedByPadding = measured.layout.container < dna.layout.container;
      if (cappedByPadding)
        fixes.push({
          kind: "fidelity",
          path: "layout.pagePadding",
          from: dna.layout.pagePadding,
          to: Math.max(16, Math.round(dna.layout.pagePadding - containerDelta / 2)),
          reason: `Rendered container ${measured.layout.container}px (limited by page padding) vs reference ${reference.layout.container}px.`,
        });
      else
        fixes.push({
          kind: "fidelity",
          path: "layout.container",
          from: dna.layout.container,
          to: dna.layout.container + containerDelta,
          reason: `Rendered container ${measured.layout.container}px vs reference ${reference.layout.container}px.`,
        });
    }
    // Section heights: adjust padding per section where height differs by > 15%.
    dna.layout.sections.forEach((spec, i) => {
      const r = reference.layout.sections[i]?.heightPx;
      const m = measured.layout.sections.find(
        (s) => s.role === spec.role && Math.abs(measured.layout.sections.indexOf(s) - i) <= 1,
      )?.heightPx;
      if (
        !r ||
        !m ||
        Math.abs(r - m) / r <= 0.15 ||
        spec.role === "navigation" ||
        spec.role === "footer"
      )
        return;
      const current = spec.paddingBlock ?? dna.layout.sectionGap / 2;
      // Spacing may close part of the gap, never all of it: a much taller
      // reference section has more content or bigger components, and padding
      // it out would game the metric with empty space.
      const next = Math.min(dna.layout.sectionGap, Math.max(16, Math.round(current + (r - m) / 2)));
      if (Math.abs(next - current) < 4) return;
      fixes.push({
        kind: "fidelity",
        path: `layout.sections.${i}.paddingBlock`,
        from: spec.paddingBlock,
        to: next,
        reason: `Section ${spec.id} renders ${m}px tall; the reference is ${r}px.`,
      });
    });
  }
  // Drop no-ops and keep the first fix per path (higher priority wins).
  const seen = new Set<string>();
  return fixes.filter(
    (f) => f.from !== f.to && (seen.has(f.path) ? false : (seen.add(f.path), true)),
  );
}

/** Applies fixes to a copy of the DNA and records them in provenance. */
export function applyFixes(dna: DesignDNA, fixes: Fix[]): DesignDNA {
  const next = structuredClone(dna);
  for (const f of fixes) {
    if (get(next, f.path) === f.to) continue;
    set(next, f.path, f.to);
    next.provenance[f.path] = {
      source: "edited",
      confidence: 0.8,
      evidence: `${f.kind}: ${f.reason}`,
    };
  }
  return next;
}
