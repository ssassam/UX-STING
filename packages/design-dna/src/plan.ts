import { contrast, ensureContrast, hsl, hueOf, mix } from "./color.js";
import type {
  Composition,
  DesignDNA,
  FontSpec,
  Provenance,
  SectionRole,
  SectionSpec,
} from "./types.js";

/**
 * Original-design planning. A brief is reasoned along independent axes —
 * typography, palette strategy and composition — and every combination is
 * scored against the brief. The top directions must differ on at least two
 * axes, so the result is a real choice and not three variants of one look.
 *
 * This planner is deterministic and explainable. An AI design director can
 * propose directions in the same `DesignDirection` shape; `scoreDirection()`
 * then evaluates them with the same criteria.
 */

export interface Brief {
  name: string;
  /** e.g. "beauty salon", "B2B logistics SaaS", "independent bookshop". */
  industry: string;
  audience: string;
  /** e.g. ["bookings", "trust"], ["read", "subscribe"], ["sign up"]. */
  goals: string[];
  /** Brand adjectives, e.g. ["warm", "crafted", "calm"]. */
  tone: string[];
  language: string;
  dir?: "ltr" | "rtl";
  brandColor?: string;
  density?: "airy" | "balanced" | "dense";
  /** Things to avoid, e.g. ["dark", "rounded", "serif"]. */
  avoid?: string[];
  /** The content the site must carry, in order. Drives the sections. */
  sections: Array<{ id: string; role: SectionRole; items?: number; media?: boolean }>;
}

interface Axis {
  id: string;
  label: string;
  tags: string[];
}

interface TypeAxis extends Axis {
  display: FontSpec;
  body: FontSpec;
  tracking: number;
  leading: number;
  uppercaseLabels: boolean;
}

interface PaletteAxis extends Axis {
  build: (hue: number) => DesignDNA["color"];
}

interface CompositionAxis extends Axis {
  alignment: DesignDNA["layout"]["alignment"];
  hero: Composition;
  repeated: Composition;
  cta: Composition;
  density: "airy" | "balanced" | "dense";
  radius: number;
  shadow: DesignDNA["shape"]["shadow"];
}

const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';

export const TYPE_AXES: TypeAxis[] = [
  {
    id: "editorial-serif",
    label: "Serif display over a neutral sans",
    tags: [
      "editorial",
      "heritage",
      "crafted",
      "warm",
      "food",
      "restaurant",
      "hospitality",
      "culture",
      "publishing",
      "books",
      "calm",
      "travel",
    ],
    display: {
      family: '"Fraunces", "Iowan Old Style", Georgia, serif',
      classification: "serif",
      weight: 500,
    },
    body: { family: SANS, classification: "sans", weight: 400 },
    tracking: -0.02,
    leading: 1.04,
    uppercaseLabels: true,
  },
  {
    id: "grotesk-tight",
    label: "Tight grotesk, heavy and confident",
    tags: [
      "bold",
      "tech",
      "agency",
      "modern",
      "confident",
      "sport",
      "startup",
      "saas",
      "energetic",
    ],
    display: {
      family: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
      classification: "sans",
      weight: 700,
    },
    body: { family: SANS, classification: "sans", weight: 400 },
    tracking: -0.035,
    leading: 0.98,
    uppercaseLabels: false,
  },
  {
    id: "mono-technical",
    label: "Monospace display, technical and precise",
    tags: [
      "developer",
      "technical",
      "precise",
      "data",
      "infrastructure",
      "terminal",
      "security",
      "api",
    ],
    display: {
      family: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
      classification: "mono",
      weight: 600,
    },
    body: {
      family: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
      classification: "sans",
      weight: 400,
    },
    tracking: -0.01,
    leading: 1.1,
    uppercaseLabels: true,
  },
  {
    id: "humanist-soft",
    label: "Rounded humanist sans, friendly",
    tags: [
      "friendly",
      "community",
      "wellness",
      "family",
      "care",
      "playful",
      "kids",
      "health",
      "education",
      "approachable",
    ],
    display: {
      family: '"Nunito", "Avenir Next", "Segoe UI", sans-serif',
      classification: "sans",
      weight: 800,
    },
    body: {
      family: '"Nunito Sans", "Avenir Next", "Segoe UI", sans-serif',
      classification: "sans",
      weight: 400,
    },
    tracking: -0.01,
    leading: 1.08,
    uppercaseLabels: false,
  },
  {
    id: "refined-serif",
    label: "Light classical serif, refined",
    tags: [
      "luxury",
      "beauty",
      "salon",
      "fashion",
      "wedding",
      "refined",
      "quiet",
      "premium",
      "jewelry",
      "spa",
    ],
    display: {
      family: '"Cormorant Garamond", Garamond, "Times New Roman", serif',
      classification: "serif",
      weight: 500,
    },
    body: {
      family: '"Jost", "Futura", "Helvetica Neue", sans-serif',
      classification: "sans",
      weight: 400,
    },
    tracking: 0,
    leading: 1.02,
    uppercaseLabels: true,
  },
];

export const PALETTE_AXES: PaletteAxis[] = [
  {
    id: "paper-ink",
    label: "Warm paper, ink text, one strong accent",
    tags: ["editorial", "warm", "crafted", "heritage", "calm", "food", "books", "quiet"],
    build: (h) =>
      accentPalette({
        background: hsl(40, 33, 95),
        surface: hsl(40, 28, 90),
        foreground: hsl(30, 12, 10),
        muted: hsl(30, 8, 34),
        hue: h,
        sat: 72,
        light: 40,
      }),
  },
  {
    id: "dark-field",
    label: "Near-black field with a luminous accent",
    tags: ["tech", "developer", "night", "bold", "premium", "cinematic", "terminal", "music"],
    build: (h) =>
      accentPalette({
        background: hsl(h, 14, 7),
        surface: hsl(h, 12, 11),
        foreground: hsl(h, 10, 94),
        muted: hsl(h, 8, 70),
        hue: h,
        sat: 85,
        light: 62,
      }),
  },
  {
    id: "tinted-calm",
    label: "Pale brand tint with deep brand-colored text",
    tags: ["wellness", "care", "beauty", "spa", "friendly", "health", "calm", "family"],
    build: (h) =>
      accentPalette({
        background: hsl(h, 30, 96),
        surface: hsl(h, 32, 91),
        foreground: hsl(h, 35, 14),
        muted: hsl(h, 18, 32),
        hue: h,
        sat: 45,
        light: 34,
      }),
  },
  {
    id: "stark-mono",
    label: "Stark white and black with a signal color",
    tags: ["bold", "agency", "confident", "sport", "fashion", "modern", "energetic", "brutalist"],
    build: (h) =>
      accentPalette({
        background: "#ffffff",
        surface: hsl(0, 0, 95),
        foreground: "#0a0a0a",
        muted: hsl(0, 0, 32),
        hue: h,
        sat: 90,
        light: 46,
      }),
  },
];

export const COMPOSITION_AXES: CompositionAxis[] = [
  {
    id: "editorial-asymmetric",
    label: "Asymmetric editorial grid with indexed lists",
    tags: [
      "editorial",
      "read",
      "explore",
      "crafted",
      "culture",
      "books",
      "portfolio",
      "quiet",
      "luxury",
      "refined",
    ],
    alignment: "asymmetric",
    hero: "asymmetric",
    repeated: "index",
    cta: "stack",
    density: "airy",
    radius: 2,
    shadow: "none",
  },
  {
    id: "immersive-bands",
    label: "Full-bleed color bands and alternating splits",
    tags: [
      "immersive",
      "hospitality",
      "travel",
      "restaurant",
      "cinematic",
      "bookings",
      "bold",
      "music",
      "spa",
    ],
    alignment: "start",
    hero: "full-bleed",
    repeated: "split",
    cta: "full-bleed",
    density: "airy",
    radius: 0,
    shadow: "none",
  },
  {
    id: "clear-conversion",
    label: "Clear split hero and scannable grids",
    tags: [
      "conversion",
      "sign up",
      "buy",
      "bookings",
      "contact",
      "saas",
      "friendly",
      "trust",
      "health",
    ],
    alignment: "start",
    hero: "split",
    repeated: "grid",
    cta: "centered",
    density: "balanced",
    radius: 12,
    shadow: "soft",
  },
  {
    id: "dense-utility",
    label: "Dense, ruled and information-first",
    tags: ["data", "developer", "technical", "directory", "dense", "infrastructure", "news"],
    alignment: "start",
    hero: "stack",
    repeated: "index",
    cta: "stack",
    density: "dense",
    radius: 4,
    shadow: "none",
  },
];

function accentPalette(o: {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  hue: number;
  sat: number;
  light: number;
}): DesignDNA["color"] {
  const dark = contrast(o.background, "#000000") < contrast(o.background, "#ffffff");
  const accent = ensureContrast(hsl(o.hue, o.sat, o.light), o.background, 3);
  const accentForeground = ensureContrast(
    contrast(accent, "#ffffff") >= contrast(accent, "#111111") ? "#ffffff" : "#111111",
    accent,
  );
  return {
    scheme: dark ? "dark" : "light",
    background: o.background,
    surface: o.surface,
    foreground: ensureContrast(o.foreground, o.surface, 7),
    muted: ensureContrast(o.muted, o.surface),
    border: mix(o.background, o.foreground, dark ? 0.2 : 0.14),
    accent,
    accentForeground,
    inverse: dark ? o.surface : o.foreground,
  };
}

const INDUSTRY_HUES: Array<[RegExp, number]> = [
  [/restaurant|food|bistro|bakery|kitchen|grill|tagine|pizza/, 16],
  [/coffee|cafe|café|tea/, 28],
  [/beauty|salon|hair|nail|spa|cosmetic/, 345],
  [/wellness|yoga|health|clinic|care|therapy/, 150],
  [/finance|bank|insurance|account|legal|law/, 218],
  [/travel|hotel|riad|tour|stay|hospitality/, 192],
  [/developer|api|infrastructure|security|devops/, 160],
  [/saas|software|startup|platform|app/, 232],
  [/kids|school|education|learning/, 42],
  [/book|publish|magazine|journal|news/, 8],
  [/fashion|jewel|wedding/, 330],
  [/construction|architecture|interior|furniture/, 30],
];

export function hueForBrief(brief: Brief): number {
  if (brief.brandColor) return hueOf(brief.brandColor);
  const text = `${brief.industry} ${brief.tone.join(" ")}`.toLowerCase();
  return INDUSTRY_HUES.find(([re]) => re.test(text))?.[1] ?? 205;
}

export interface DesignDirection {
  id: string;
  type: string;
  palette: string;
  composition: string;
  hue: number;
  score: number;
  /** Why this direction fits, one line per criterion. */
  rationale: string[];
  /** Known risks for this brief. */
  risks: string[];
}

const words = (brief: Brief) =>
  new Set(
    [brief.industry, brief.audience, ...brief.tone, ...brief.goals]
      .join(" ")
      .toLowerCase()
      .split(/[^a-zÀ-ɏ]+/)
      .filter(Boolean),
  );

const overlap = (tags: string[], set: Set<string>) =>
  tags.filter((t) => t.split(" ").every((w) => set.has(w))).length;

/** Scores one direction against the brief (0–100) and explains the score. */
export function scoreDirection(
  brief: Brief,
  typeId: string,
  paletteId: string,
  compositionId: string,
): DesignDirection {
  const t = TYPE_AXES.find((x) => x.id === typeId)!;
  const p = PALETTE_AXES.find((x) => x.id === paletteId)!;
  const c = COMPOSITION_AXES.find((x) => x.id === compositionId)!;
  const set = words(brief);
  const avoid = (brief.avoid ?? []).map((a) => a.toLowerCase());
  const rationale: string[] = [];
  const risks: string[] = [];
  let score = 40;

  for (const [axis, label] of [
    [t, "Type"],
    [p, "Palette"],
    [c, "Composition"],
  ] as const) {
    const fit = overlap(axis.tags, set);
    score += Math.min(3, fit) * 6;
    if (fit)
      rationale.push(
        `${label}: ${axis.label} — matches ${axis.tags.filter((tag) => tag.split(" ").every((w) => set.has(w))).join(", ")}.`,
      );
  }
  const wantsConversion = brief.goals.some((g) =>
    /book|buy|sign|contact|order|reserve|quote|call/.test(g.toLowerCase()),
  );
  const wantsReading = brief.goals.some((g) =>
    /read|explore|subscribe|learn|browse/.test(g.toLowerCase()),
  );
  if (wantsConversion && (c.id === "clear-conversion" || c.id === "immersive-bands")) {
    score += 6;
    rationale.push("Composition keeps the primary action prominent for a conversion goal.");
  }
  if (wantsReading && (c.id === "editorial-asymmetric" || c.id === "dense-utility")) {
    score += 6;
    rationale.push("Composition favours reading and scanning.");
  }
  if (brief.density && brief.density === c.density) score += 5;
  if (
    brief.density &&
    brief.density !== c.density &&
    (brief.density === "dense" || c.density === "dense")
  ) {
    score -= 8;
    risks.push(`Density ${c.density} conflicts with the requested ${brief.density}.`);
  }
  const hit = (k: string, test: boolean) => {
    if (avoid.includes(k) && test) {
      score -= 25;
      risks.push(`The brief asks to avoid "${k}".`);
    }
  };
  hit("dark", p.id === "dark-field");
  hit("serif", t.display.classification === "serif");
  hit("rounded", c.radius >= 12 || t.id === "humanist-soft");
  hit("mono", t.id === "mono-technical");
  // The generic AI look: tight grotesk + split hero + card grid + violet-blue.
  const hue = hueForBrief(brief);
  if (t.id === "grotesk-tight" && c.id === "clear-conversion" && hue >= 225 && hue <= 290) {
    score -= 12;
    risks.push(
      "Close to the generic AI landing page (grotesk, split hero, card grid, violet-blue).",
    );
  }
  if (
    t.id === "mono-technical" &&
    !set.has("developer") &&
    !set.has("technical") &&
    !set.has("data")
  ) {
    score -= 10;
    risks.push("Monospace display reads as technical; the audience is not technical.");
  }
  if (p.id === "dark-field" && (set.has("health") || set.has("care") || set.has("kids"))) {
    score -= 8;
    risks.push("Dark fields feel cold for care, health or family audiences.");
  }
  return {
    id: `${t.id}+${p.id}+${c.id}`,
    type: t.id,
    palette: p.id,
    composition: c.id,
    hue,
    score: Math.max(0, Math.min(100, score)),
    rationale,
    risks,
  };
}

/**
 * Returns `count` directions, best first, that differ from each other on at
 * least two of the three axes.
 */
export function planDirections(brief: Brief, count = 3): DesignDirection[] {
  const all: DesignDirection[] = [];
  for (const t of TYPE_AXES)
    for (const p of PALETTE_AXES)
      for (const c of COMPOSITION_AXES) all.push(scoreDirection(brief, t.id, p.id, c.id));
  all.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const picked: DesignDirection[] = [];
  for (const d of all) {
    const distinct = picked.every(
      (x) =>
        Number(x.type !== d.type) +
          Number(x.palette !== d.palette) +
          Number(x.composition !== d.composition) >=
        2,
    );
    if (distinct) picked.push(d);
    if (picked.length === count) break;
  }
  return picked;
}

function sectionFor(
  spec: Brief["sections"][number],
  c: CompositionAxis,
  index: number,
): SectionSpec {
  const repeated = (spec.items ?? 0) >= 3;
  let composition: Composition;
  if (spec.role === "hero" || spec.role === "intro") composition = c.hero;
  else if (spec.role === "cta") composition = c.cta;
  else if (spec.role === "navigation" || spec.role === "footer") composition = "stack";
  else if (repeated) composition = c.repeated === "split" ? "grid" : c.repeated;
  else if (spec.media) composition = c.repeated === "index" ? "asymmetric" : "split";
  else composition = c.alignment === "asymmetric" ? "asymmetric" : "stack";
  const surface: SectionSpec["surface"] =
    (spec.role === "hero" && c.hero === "full-bleed") ||
    (spec.role === "cta" && c.cta === "full-bleed")
      ? "inverse"
      : index % 3 === 2 && c.id !== "dense-utility"
        ? "surface"
        : "background";
  return {
    id: spec.id,
    role: spec.role,
    composition,
    columns:
      composition === "grid"
        ? Math.min(3, spec.items ?? 3)
        : composition === "split" || composition === "asymmetric"
          ? 2
          : 1,
    surface,
    ...(spec.items ? { itemCount: spec.items } : {}),
    ...(spec.media ? { media: true } : {}),
  };
}

/** Builds an editable Design DNA from a direction. Every value is marked `brief`. */
export function dnaFromDirection(brief: Brief, direction: DesignDirection): DesignDNA {
  const t = TYPE_AXES.find((x) => x.id === direction.type)!;
  const p = PALETTE_AXES.find((x) => x.id === direction.palette)!;
  const c = COMPOSITION_AXES.find((x) => x.id === direction.composition)!;
  const density = brief.density ?? c.density;
  const base = density === "dense" ? 16 : 17;
  const ratio = density === "dense" ? 1.2 : t.display.classification === "serif" ? 1.33 : 1.28;
  const step = (n: number) => Math.round(base * ratio ** n);
  const why = (evidence: string): Provenance => ({ source: "brief", confidence: 0.7, evidence });
  const provenance: Record<string, Provenance> = {
    typography: why(`${t.label} (${direction.type})`),
    color: why(
      `${p.label}, hue ${direction.hue}° from ${brief.brandColor ? "the brand color" : "the industry"}`,
    ),
    layout: why(`${c.label} (${direction.composition})`),
    "layout.sections": why("one section per content block in the brief, in brief order"),
  };
  const sectionGap = density === "airy" ? 160 : density === "dense" ? 72 : 112;
  return {
    version: 1,
    name: `${brief.name} — ${direction.id}`,
    mode: "original",
    sources: [{ kind: "brief", ref: brief.name }],
    personality: {
      keywords: [
        ...new Set([
          ...brief.tone,
          t.display.classification === "serif"
            ? "serif display"
            : `${t.display.classification} display`,
          c.alignment === "asymmetric" ? "asymmetric grid" : "left-aligned",
        ]),
      ],
      density,
      contrast: "high",
    },
    color: p.build(direction.hue),
    typography: {
      display: t.display,
      body: t.body,
      ...(t.id === "mono-technical" ? { mono: t.display } : {}),
      scale: {
        base,
        ratio,
        steps: {
          small: Math.round(base * 0.85),
          body: base,
          h3: step(1),
          h2: step(3),
          h1: step(5),
          display: step(c.id === "dense-utility" ? 5 : 7),
        },
      },
      headingTracking: t.tracking,
      headingLeading: t.leading,
      bodyLeading: density === "dense" ? 1.5 : 1.62,
      uppercaseLabels: t.uppercaseLabels,
      measure: 66,
    },
    layout: {
      container: density === "dense" ? 1280 : 1200,
      pagePadding: density === "dense" ? 24 : 48,
      columns: 12,
      gutter: density === "dense" ? 20 : 32,
      sectionGap,
      spacingUnit: 8,
      alignment: c.alignment,
      sections: brief.sections.map((s, i) => sectionFor(s, c, i)),
    },
    shape: {
      radius: c.radius,
      controlRadius: c.radius >= 12 ? 9999 : c.radius,
      borderWidth: 1,
      shadow: c.shadow,
    },
    imagery: {
      treatment: c.hero === "full-bleed" ? "full-bleed" : "framed",
      aspect: c.id === "editorial-asymmetric" ? 0.8 : 1.5,
    },
    motion: { level: "subtle", durationMs: 200 },
    navigation: {
      pattern: c.alignment === "asymmetric" ? "split" : "top-bar",
      sticky: c.id !== "editorial-asymmetric",
      itemCount: 4,
    },
    provenance,
  };
}
