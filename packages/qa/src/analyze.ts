import type { Finding, QaReport, Severity, TasteMeasurement, ViewportResult } from "./types.js";

const WEIGHT: Record<Severity, number> = { critical: 8, serious: 4, moderate: 2, minor: 1 };

/** Axe rules covered by UX-STING's own contrast check (reported once, with ratios). */
const COVERED_AXE = new Set(["color-contrast"]);

/** LCP / CLS thresholds from web.dev ("good" / "poor"). */
export const VITALS = { lcp: [2500, 4000], cls: [0.1, 0.25] } as const;

type Draft = Omit<Finding, "viewports" | "targets" | "count"> & {
  viewport?: number;
  targets?: string[];
  count?: number;
};

/**
 * Turns per-viewport measurements into findings. Pure and deterministic:
 * the same measurements always produce the same findings in the same order.
 * Identical rules at several viewports merge into one finding.
 */
export function analyze(
  viewports: ViewportResult[],
  console: QaReport["console"] = { errors: [], failedRequests: [] },
): Finding[] {
  const drafts: Draft[] = [];
  for (const v of viewports) {
    const { layout: l, width } = v;
    const at = { viewport: width };

    if (l.overflow.px > 1)
      drafts.push({
        ...at,
        id: "overflow-x",
        category: "layout",
        severity: "serious",
        message: `Page scrolls sideways by ${l.overflow.px}px.`,
        fix: "Constrain the offending element: `max-width: 100%`, `min-width: 0` on flex/grid children, or wrap long words with `overflow-wrap: anywhere`.",
        targets: l.overflow.offenders,
      });

    if (!l.title)
      drafts.push({
        ...at,
        id: "title-missing",
        category: "layout",
        severity: "serious",
        message: "No visible h1: the page has no title on screen.",
        fix: "Add one h1 that says what the page is, in the first screen.",
      });
    else if (!l.title.visible || l.title.top >= l.height || l.title.bottom <= 0)
      drafts.push({
        ...at,
        id: "title-below-fold",
        category: "layout",
        severity: "moderate",
        message: l.title.visible
          ? `Title "${l.title.text}" starts at ${l.title.top}px, below the first screen (${l.height}px).`
          : `Title "${l.title.text}" is hidden on load.`,
        fix: "Move the title into the first screen: shrink the header or hero media above it, and never hide it behind an entrance animation.",
        targets: [l.title.tag],
      });

    for (const s of l.sections) {
      const bothInset = s.marginStart >= 8 && s.marginEnd >= 8;
      const diff = Math.abs(s.marginStart - s.marginEnd);
      if (bothInset && diff > Math.max(24, 0.3 * Math.max(s.marginStart, s.marginEnd)))
        drafts.push({
          ...at,
          id: "unequal-margins",
          category: "layout",
          severity: "minor",
          message: `Content sits off-center: ${s.marginStart}px start vs ${s.marginEnd}px end.`,
          fix: "Use the same container (max-width + `margin-inline: auto` + symmetric `padding-inline`) for every band, or make the asymmetry deliberate and larger.",
          targets: [s.target],
        });
      if (
        !s.isNav &&
        s.textChars > 0 &&
        s.textChars < 60 &&
        s.childCount <= 1 &&
        !s.hasMedia &&
        !s.hasControls
      )
        drafts.push({
          ...at,
          id: "orphan-section",
          category: "layout",
          severity: "minor",
          message: `A band holds only ${s.textChars} characters with nothing else.`,
          fix: "Merge the stray heading or line into the neighbouring section, or give it the content it introduces.",
          targets: [s.target],
        });
    }

    for (const o of l.orphanItems)
      drafts.push({
        ...at,
        id: "orphan-grid-item",
        category: "layout",
        severity: "minor",
        message: `Grid ends with a single item under rows of ${o.perRow}.`,
        fix: "Change the item count or the column count so the last row is full, or let the last item span the row.",
        targets: [o.target],
      });

    if (l.emptyStretches.length) {
      const largest = [...l.emptyStretches].sort((a, b) => b.height - a.height)[0]!;
      const n = l.emptyStretches.length;
      drafts.push({
        ...at,
        id: "empty-stretch",
        category: "layout",
        severity: "moderate",
        message: `${n} blank stretch(es) taller than ¾ of a screen; largest ${largest.height}px at y=${largest.top}.`,
        fix: "Remove the dead space or check for content that stays invisible (scroll reveal that never fires, images that never load).",
        targets: l.emptyStretches.map((e) => `y=${e.top}`),
        count: n,
      });
    }

    if (l.contrast.failing.length) {
      const worst = Math.min(...l.contrast.failing.map((f) => f.ratio));
      drafts.push({
        ...at,
        id: "contrast",
        category: "contrast",
        severity: worst < 3 ? "serious" : "moderate",
        message: `${l.contrast.failing.length} text element(s) below WCAG AA (worst ${worst}:1).`,
        fix: "Use the theme's foreground / muted-foreground tokens on their matching surfaces instead of lightened text or custom grays.",
        targets: l.contrast.failing.map((f) => f.target),
        count: l.contrast.failing.length,
      });
    }

    for (const a of v.axe) {
      if (COVERED_AXE.has(a.id)) continue;
      drafts.push({
        ...at,
        id: `axe:${a.id}`,
        category: "a11y",
        severity: a.impact ?? "moderate",
        message: a.help,
        fix: `Fix per axe rule ${a.id}: ${a.help.replace(/\.$/, "")}.`,
        targets: a.targets,
        count: a.count,
        helpUrl: a.helpUrl,
      });
    }

    if (v.taste) drafts.push(...tasteDrafts(v.taste, width));

    const { lcp, cls } = v.vitals;
    if (lcp !== null && lcp > VITALS.lcp[0])
      drafts.push({
        ...at,
        id: "lcp",
        category: "performance",
        severity: lcp > VITALS.lcp[1] ? "serious" : "moderate",
        message: `LCP ${(lcp / 1000).toFixed(1)}s (good ≤ 2.5s, local lab run).`,
        fix: "Serve the hero image at its displayed size with `fetchpriority=high` and no lazy loading, and avoid render-blocking fonts/scripts above the fold.",
      });
    if (cls !== null && cls > VITALS.cls[0])
      drafts.push({
        ...at,
        id: "cls",
        category: "performance",
        severity: cls > VITALS.cls[1] ? "serious" : "moderate",
        message: `CLS ${cls} (good ≤ 0.1).`,
        fix: "Reserve space for images, embeds and late banners (width/height or aspect-ratio) and use `font-display: optional` or size-adjusted fallbacks.",
      });
  }

  if (console.errors.length)
    drafts.push({
      id: "console-error",
      category: "console",
      severity: "serious",
      message: `${console.errors.length} console error(s): ${console.errors[0]!.slice(0, 120)}`,
      fix: "Fix the first error in the browser console; later ones are often caused by it.",
      targets: console.errors.slice(0, 3).map((e) => e.slice(0, 80)),
      count: console.errors.length,
    });
  if (console.failedRequests.length)
    drafts.push({
      id: "failed-request",
      category: "console",
      severity: "moderate",
      message: `${console.failedRequests.length} request(s) failed: ${console.failedRequests[0]}`,
      fix: "Fix or remove the broken asset URLs.",
      targets: console.failedRequests.slice(0, 3),
      count: console.failedRequests.length,
    });

  return merge(drafts);
}

/**
 * Anti-slop rules. Taste findings are never serious: they ask for a reason,
 * not a fix at any cost (a brand may really be purple).
 */
function tasteDrafts(t: TasteMeasurement, viewport: number): Draft[] {
  const out: Draft[] = [];
  const add = (d: Omit<Draft, "category" | "viewport">) =>
    out.push({ ...d, category: "taste", viewport });
  if (t.purpleGradients.length)
    add({
      id: "slop:purple-gradient",
      severity: "moderate",
      message: "Violet/purple gradient — the most common AI-generated look.",
      fix: "Use the theme's flat surfaces and one accent; keep a gradient only if the brand truly owns it, and then from its own tokens.",
      targets: t.purpleGradients,
    });
  if (t.gradientText.length)
    add({
      id: "slop:gradient-text",
      severity: "minor",
      message: "Gradient-filled text.",
      fix: "Set headlines in solid color; get emphasis from size, weight, italics or one accent word.",
      targets: t.gradientText,
    });
  if (t.emojiIcons.length)
    add({
      id: "slop:emoji-icons",
      severity: "moderate",
      message: `Emoji used as icons (${t.emojiIcons.map((e) => e.text).join(" ")}).`,
      fix: "Replace with @ux-sting/icons (SVG, aria-hidden) or remove the icon row entirely.",
      targets: t.emojiIcons.map((e) => e.target),
      count: t.emojiIcons.length,
    });
  if (t.centeredHeroCards)
    add({
      id: "slop:centered-hero-3-cards",
      severity: "minor",
      message: "Centered hero followed by three identical cards — the default template.",
      fix: "Let the art direction pick the structure: an asymmetric split, an indexed list, a table, a full-bleed image or one strong proof point.",
      targets: [t.centeredHeroCards],
    });
  if (t.genericCopy.length)
    add({
      id: "slop:generic-copy",
      severity: "minor",
      message: `Stock phrases: ${t.genericCopy.map((g) => `“${g}”`).join(", ")}.`,
      fix: "Say what this client specifically does, for whom, with a concrete noun or number.",
      count: t.genericCopy.length,
    });
  if (t.fakeStats.length)
    add({
      id: "slop:unsourced-stats",
      severity: "minor",
      message: `Round, unsourced numbers: ${t.fakeStats.join(", ")}.`,
      fix: "Use real figures with a source and date, or remove them.",
      count: t.fakeStats.length,
    });
  if (t.lorem)
    add({
      id: "slop:lorem-ipsum",
      severity: "moderate",
      message: "Placeholder text (lorem ipsum) is on the page.",
      fix: "Write the real copy; content decides the layout.",
    });
  if (t.glass > 4)
    add({
      id: "slop:glass-everywhere",
      severity: "minor",
      message: `${t.glass} glass (backdrop-blur) surfaces.`,
      fix: "Keep blur for one floating layer (nav or overlay); use tonal surfaces and hairlines elsewhere.",
      count: t.glass,
    });
  if (t.numbers.cells >= 3 && t.numbers.misaligned + t.numbers.proportional >= 3)
    add({
      id: "data:numbers-misaligned",
      severity: "minor",
      message: `${t.numbers.misaligned} of ${t.numbers.cells} numeric cells not end-aligned, ${t.numbers.proportional} without tabular figures.`,
      fix: "Right-align (text-end) numeric columns and their headers and use `tabular-nums` so digits line up.",
      count: t.numbers.cells,
    });
  return out;
}

function merge(drafts: Draft[]): Finding[] {
  const byId = new Map<string, Finding>();
  for (const d of drafts) {
    const { viewport, targets = [], count, ...rest } = d;
    const existing = byId.get(d.id);
    if (!existing) {
      byId.set(d.id, {
        ...rest,
        viewports: viewport === undefined ? [] : [viewport],
        targets: [...new Set(targets)].slice(0, 5),
        count: count ?? Math.max(1, targets.length),
      });
      continue;
    }
    if (viewport !== undefined && !existing.viewports.includes(viewport))
      existing.viewports.push(viewport);
    existing.targets = [...new Set([...existing.targets, ...targets])].slice(0, 5);
    existing.count = Math.max(existing.count, count ?? targets.length);
    if (WEIGHT[d.severity] > WEIGHT[existing.severity]) {
      existing.severity = d.severity;
      existing.message = d.message;
    }
  }
  return rank([...byId.values()]);
}

/** Priority: severity first, then how many viewports and nodes it touches. */
export function priority(f: Finding): number {
  const breadth = 1 + 0.25 * Math.max(0, f.viewports.length - 1) + 0.1 * Math.log2(1 + f.count);
  const categoryBoost = f.category === "a11y" || f.category === "contrast" ? 1.1 : 1;
  return WEIGHT[f.severity] * breadth * categoryBoost;
}

export function rank(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => priority(b) - priority(a) || a.id.localeCompare(b.id));
}

/** 100 minus weighted findings, floored at 0. */
export function score(findings: Finding[]): number {
  const penalty = findings.reduce((sum, f) => sum + WEIGHT[f.severity] * 1.5, 0);
  return Math.max(0, Math.round(100 - penalty));
}

export const passed = (findings: Finding[]) =>
  !findings.some((f) => f.severity === "critical" || f.severity === "serious");
