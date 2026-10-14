import { chroma, contrast, ensureContrast, luminance, mix } from "./color.js";
import type {
  Composition,
  DesignDNA,
  FontSpec,
  Provenance,
  SectionRole,
  SectionSpec,
  SourceRef,
} from "./types.js";

/**
 * Raw measurements of one rendered page at one viewport, produced by a
 * browser collector (see scripts/design-dna/collect.ts). Every field is a
 * computed style or a geometry measurement — nothing here is guessed.
 * Colors are opaque `#rrggbb` (translucent colors are composited first).
 */
export interface PageObservation {
  url: string;
  viewport: { width: number; height: number };
  lang: string;
  dir: "ltr" | "rtl";
  title: string;
  description?: string;
  documentHeight: number;
  pageBackground: string;
  texts: ObservedText[];
  sections: ObservedSection[];
  buttons: Array<{ background: string; color: string; radius: number; borderWidth: number }>;
  linkColors: string[];
  borderColors: string[];
  radii: number[];
  /** Parsed box-shadows: blur radius and largest offset, in px. */
  shadows: Array<{ blur: number; offset: number }>;
  transitionsMs: number[];
  animations: number;
  nav: { itemCount: number; sticky: boolean; labels?: string[] };
  /** Computed color of the first h1/h2. */
  headingColor?: string;
  images: Array<{ width: number; height: number; fullBleed: boolean }>;
  /**
   * Text outline per section. Only collected when the user confirmed they
   * own or may reproduce the reference; otherwise empty.
   */
  outline: Array<{ heading?: string; text?: string; items: string[]; action?: string }>;
}

export interface ObservedText {
  role: "h1" | "h2" | "h3" | "body" | "small" | "label" | "button" | "link";
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  uppercase: boolean;
  textAlign: "start" | "center" | "end";
  color: string;
  chars: number;
  /** Left edge relative to the section's content box, in px. */
  left: number;
}

export interface ObservedSection {
  tag: string;
  top: number;
  height: number;
  width: number;
  /** Widest direct content box (the container), in px. */
  contentWidth: number;
  background: string | null;
  paddingBlock: number;
  /** Number of columns in the main row of children. */
  columns: number;
  /** Widths of those columns, in px. */
  columnWidths: number[];
  childCount: number;
  gap: number;
  hasMedia: boolean;
  /** Repeated, similarly sized children (cards, rows). */
  repeatedItems: number;
  /** Text-align of most text in the section. */
  textAlign: "start" | "center" | "end";
  /** Has numbered or ruled rows (ol, hr, border-top rows). */
  indexed: boolean;
}

const median = (xs: number[]) => {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!s.length) return NaN;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
};

function mode<T>(xs: T[], weight: (x: T) => number = () => 1): T | undefined {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + weight(x));
  let best: T | undefined;
  let max = -Infinity;
  for (const [k, v] of counts) if (v > max) [best, max] = [k, v];
  return best;
}

const round = (v: number, step = 1) => Math.round(v / step) * step;

export function classifyFont(family: string): FontSpec["classification"] {
  const f = family.toLowerCase();
  if (/mono|code|courier|consolas|menlo/.test(f)) return "mono";
  const first = f.split(",")[0] ?? "";
  if (/sans/.test(first)) return "sans";
  if (
    /serif|georgia|times|garamond|fraunces|playfair|cormorant|baskerville|didot|bodoni|merriweather|lora|caslon/.test(
      first,
    )
  )
    return "serif";
  return "sans";
}

/**
 * Turns measurements into Design DNA. Values read straight from computed
 * styles are marked `observed`; anything derived (roles, ratios, muted and
 * border colors, personality) is marked `inferred` with a lower confidence.
 */
export function dnaFromObservation(
  obs: PageObservation,
  { name, authorized = false }: { name?: string; authorized?: boolean } = {},
): DesignDNA {
  const provenance: Record<string, Provenance> = {};
  const seen = (path: string, evidence: string, confidence = 0.95) =>
    (provenance[path] = { source: "observed", confidence, evidence });
  const guessed = (path: string, evidence: string, confidence = 0.6) =>
    (provenance[path] = { source: "inferred", confidence, evidence });
  const fallback = (path: string, evidence: string) =>
    (provenance[path] = { source: "default", confidence: 0.3, evidence });

  const at = `${obs.viewport.width}px`;
  const body = obs.texts.filter((t) => t.role === "body");
  const byRole = (r: ObservedText["role"]) => obs.texts.filter((t) => t.role === r);

  // ── Color ──
  const background = obs.pageBackground;
  seen("color.background", `body background at ${at}`);
  const foreground =
    mode(body.length ? body : obs.texts, (t) => t.chars)?.color ??
    (luminance(background) > 0.4 ? "#111111" : "#f5f5f5");
  if (body.length) seen("color.foreground", "most common body text color, weighted by characters");
  else fallback("color.foreground", "no body text measured");

  const textColors = [...new Set(obs.texts.map((t) => t.color))];
  const mutedObserved = textColors
    .filter(
      (c) =>
        c !== foreground &&
        chroma(c) < 20 &&
        contrast(c, background) < contrast(foreground, background) &&
        contrast(c, background) >= 3,
    )
    .sort((a, b) => contrast(b, background) - contrast(a, background))[0];
  const muted = mutedObserved ?? mix(foreground, background, 0.35);
  if (mutedObserved) seen("color.muted", "secondary text color", 0.8);
  else guessed("color.muted", "mixed from foreground and background");

  const chromatic = (c: string) => chroma(c) > 15;
  const buttonBg = mode(
    obs.buttons.map((b) => b.background).filter((c) => c !== background && chromatic(c)),
  );
  const linkAccent = mode(obs.linkColors.filter(chromatic));
  const neutralButton = mode(obs.buttons.map((b) => b.background).filter((c) => c !== background));
  const accent = buttonBg ?? linkAccent ?? neutralButton ?? foreground;
  if (buttonBg) seen("color.accent", "most common colored button background");
  else if (linkAccent) seen("color.accent", "most common colored link", 0.75);
  else if (neutralButton) seen("color.accent", "button background (neutral)", 0.7);
  else guessed("color.accent", "no colored controls; using foreground", 0.4);

  const buttonText = obs.buttons.find((b) => b.background === accent)?.color;
  const accentForeground = ensureContrast(
    buttonText ?? (luminance(accent) > 0.4 ? "#111111" : "#ffffff"),
    accent,
  );
  if (buttonText) seen("color.accentForeground", "text color of accent buttons");
  else guessed("color.accentForeground", "chosen for 4.5:1 contrast on the accent");

  const sectionBgs = obs.sections
    .map((s) => s.background)
    .filter((c): c is string => !!c && c !== background);
  const surfaceObserved = mode(sectionBgs.filter((c) => contrast(c, background) < 1.6));
  const surface = surfaceObserved ?? mix(background, foreground, 0.04);
  if (surfaceObserved) seen("color.surface", "secondary section background");
  else guessed("color.surface", "tinted from background");
  const heading =
    obs.headingColor && obs.headingColor !== foreground ? obs.headingColor : undefined;
  if (heading) seen("color.heading", "computed color of the first h1/h2");
  const inverse = mode(sectionBgs.filter((c) => contrast(c, background) >= 7));
  if (inverse) seen("color.inverse", "high-contrast section band");

  const borderObserved = mode(obs.borderColors.filter((c) => c !== background));
  const border = borderObserved ?? mix(background, foreground, 0.14);
  if (borderObserved) seen("color.border", "most common border color", 0.85);
  else guessed("color.border", "tinted from foreground");

  // ── Typography ──
  const h1 = byRole("h1").sort((a, b) => b.fontSize - a.fontSize)[0];
  const sizeOf = (r: ObservedText["role"]) => median(byRole(r).map((t) => t.fontSize));
  const base = round(median(body.map((t) => t.fontSize)) || 16);
  const steps = {
    small: round(sizeOf("small") || base * 0.875),
    body: base,
    h3: round(sizeOf("h3") || base * 1.25),
    h2: round(sizeOf("h2") || base * 1.75),
    h1: round(sizeOf("h1") || base * 2.5),
    display: round(h1?.fontSize ?? base * 3),
  };
  seen(
    "typography.scale.steps",
    `median computed font-size per role at ${at}`,
    body.length && h1 ? 0.95 : 0.5,
  );
  const ratio = Math.round((steps.h1 / steps.body) ** (1 / 4) * 1000) / 1000;
  guessed("typography.scale.ratio", "geometric step between body and h1", 0.7);

  const family = (texts: ObservedText[]) =>
    mode(texts, (t) => t.chars)?.fontFamily ?? "system-ui, sans-serif";
  const displayFamily = h1?.fontFamily ?? family(byRole("h2"));
  const bodyFamily = family(body);
  const monoText = obs.texts.find((t) => classifyFont(t.fontFamily) === "mono");
  seen("typography.display", "h1 font family and weight");
  seen("typography.body", "body text font family");

  const headingTracking = h1 ? Math.round((h1.letterSpacing / h1.fontSize) * 1000) / 1000 : 0;
  const headingLeading = h1 ? Math.round((h1.lineHeight / h1.fontSize) * 100) / 100 : 1.15;
  const bodyLeading =
    Math.round(median(body.map((t) => t.lineHeight / t.fontSize)) * 100) / 100 || 1.5;
  seen("typography.headingTracking", "h1 letter-spacing ÷ font-size");
  seen("typography.bodyLeading", "body line-height ÷ font-size");

  const labels = [...byRole("label"), ...byRole("small")];
  const uppercaseLabels =
    labels.filter((t) => t.uppercase).length > labels.length / 3 && labels.length > 0;

  // ── Layout ──
  const content = obs.sections.filter(
    (s) => s.tag !== "nav" && s.tag !== "header" && s.tag !== "footer",
  );
  const container = Math.min(
    round(mode(obs.sections.map((s) => round(s.contentWidth, 8))) ?? 1200, 8),
    obs.viewport.width,
  );
  seen("layout.container", "most common section content width", 0.85);
  const pagePadding = Math.max(16, round((obs.viewport.width - container) / 2));
  guessed(
    "layout.pagePadding",
    "half the space left beside the container at the measured viewport",
    0.6,
  );
  const paddings = content.map((s) => s.paddingBlock).filter((p) => p > 0);
  const sectionGap = round(median(paddings) * 2 || 96, 4);
  seen("layout.sectionGap", "median vertical section padding × 2", 0.75);
  const spacingUnit =
    paddings.length && paddings.filter((p) => p % 8 === 0).length >= paddings.length * 0.6 ? 8 : 4;
  guessed("layout.spacingUnit", "share of paddings divisible by 8");
  const gutter = round(median(content.map((s) => s.gap).filter((g) => g > 0)) || 24, 4);
  seen("layout.gutter", "median gap between columns", 0.75);
  const centered = content.filter((s) => s.textAlign === "center").length;
  const asymmetricSections = content.filter((s) => isAsymmetric(s.columnWidths)).length;
  const alignment =
    asymmetricSections >= 2 ? "asymmetric" : centered > content.length / 2 ? "centered" : "start";
  guessed("layout.alignment", "text alignment and column proportions across sections", 0.7);

  const sections: SectionSpec[] = obs.sections.map((s, i) => {
    const role = sectionRole(s, i, obs.sections);
    return {
      id: `s${i + 1}-${role}`,
      role,
      composition: composition(s),
      columns: Math.max(1, s.columns),
      surface:
        !s.background || s.background === background
          ? "background"
          : contrast(s.background, background) >= 7
            ? "inverse"
            : chroma(s.background) > 20
              ? "accent"
              : "surface",
      heightPx: Math.round(s.height),
      ...(s.repeatedItems > 1 ? { itemCount: s.repeatedItems } : {}),
      ...(s.hasMedia ? { media: true } : {}),
    };
  });
  guessed(
    "layout.sections",
    "section roles and compositions inferred from tags, geometry and children",
    0.65,
  );

  // ── Shape, imagery, motion, navigation ──
  const cardRadii = obs.radii.filter((r) => r > 0 && r < 200);
  const radius = round(median(cardRadii) || 0);
  const controlRadiusRaw = median(obs.buttons.map((b) => b.radius));
  const controlRadius = controlRadiusRaw >= 100 ? 9999 : round(controlRadiusRaw || radius);
  seen(
    "shape.radius",
    "median corner radius of bordered or filled boxes",
    cardRadii.length ? 0.85 : 0.4,
  );
  const hard = obs.shadows.some((sh) => sh.blur === 0 && sh.offset > 0);
  const shadow = obs.shadows.length === 0 ? "none" : hard ? "hard" : "soft";
  guessed("shape.shadow", "box-shadow blur radii", 0.6);
  const borderWidth = round(median(obs.buttons.map((b) => b.borderWidth)) || 1);

  const full = obs.images.filter((im) => im.fullBleed).length;
  const treatment =
    obs.images.length === 0
      ? "none"
      : full === obs.images.length
        ? "full-bleed"
        : full === 0
          ? "framed"
          : "mixed";
  const aspect = median(obs.images.map((im) => im.width / im.height));

  const durationMs = round(median(obs.transitionsMs) || 0, 10);
  const level = obs.animations > 3 ? "expressive" : obs.transitionsMs.length ? "subtle" : "none";
  seen("motion", "computed transition durations and running animations", 0.7);

  // ── Personality (derived, never claimed as fact) ──
  const fgContrast = contrast(foreground, background);
  const density = sectionGap / base >= 9 ? "airy" : sectionGap / base <= 5 ? "dense" : "balanced";
  const keywords = [
    luminance(background) < 0.2 ? "dark" : "light",
    classifyFont(displayFamily) === "serif"
      ? "serif display"
      : classifyFont(displayFamily) === "mono"
        ? "mono display"
        : "sans display",
    headingTracking <= -0.015 ? "tight headings" : null,
    uppercaseLabels ? "uppercase labels" : null,
    radius >= 16 ? "rounded" : radius <= 2 ? "square" : null,
    chroma(accent) < 10 ? "monochrome" : "single accent",
    density === "airy" ? "generous whitespace" : density === "dense" ? "compact" : null,
    alignment === "asymmetric"
      ? "asymmetric grid"
      : alignment === "centered"
        ? "centered"
        : "left-aligned",
  ].filter((k): k is string => !!k);
  guessed("personality", "summarised from the measurements above", 0.5);

  const source: SourceRef = {
    kind: "url",
    ref: obs.url,
    authorized,
    capturedAt: new Date().toISOString(),
  };
  return {
    version: 1,
    name: name ?? (obs.title || "Reference"),
    mode: "reconstruct",
    sources: [source],
    personality: {
      keywords,
      density,
      contrast: fgContrast >= 12 ? "high" : fgContrast >= 7 ? "medium" : "soft",
    },
    color: {
      scheme: luminance(background) < 0.2 ? "dark" : "light",
      background,
      surface,
      foreground,
      muted,
      border,
      accent,
      accentForeground,
      ...(heading ? { heading } : {}),
      ...(inverse ? { inverse } : {}),
    },
    typography: {
      display: {
        family: displayFamily,
        classification: classifyFont(displayFamily),
        weight: h1?.fontWeight ?? 700,
      },
      body: {
        family: bodyFamily,
        classification: classifyFont(bodyFamily),
        weight: mode(body.map((t) => t.fontWeight)) ?? 400,
      },
      ...(monoText
        ? {
            mono: {
              family: monoText.fontFamily,
              classification: "mono" as const,
              weight: monoText.fontWeight,
            },
          }
        : {}),
      scale: { base, ratio, steps },
      headingTracking,
      headingLeading,
      bodyLeading,
      uppercaseLabels,
      measure: Math.min(
        90,
        Math.max(45, Math.round(median(content.map((s) => s.contentWidth)) / (base * 0.5) / 2)),
      ),
    },
    layout: {
      container,
      pagePadding,
      columns: 12,
      gutter,
      sectionGap,
      spacingUnit,
      alignment,
      sections,
    },
    shape: { radius, controlRadius, borderWidth, shadow },
    imagery: {
      treatment,
      ...(Number.isFinite(aspect) ? { aspect: Math.round(aspect * 100) / 100 } : {}),
    },
    motion: { level, durationMs },
    navigation: {
      pattern: obs.nav.itemCount <= 2 ? "minimal" : "top-bar",
      sticky: obs.nav.sticky,
      itemCount: obs.nav.itemCount,
    },
    provenance,
  };
}

function isAsymmetric(widths: number[]) {
  if (widths.length !== 2) return false;
  const [a, b] = widths as [number, number];
  return Math.max(a, b) / Math.max(1, Math.min(a, b)) >= 1.3;
}

function composition(s: ObservedSection): Composition {
  if (s.indexed) return "index";
  if (s.repeatedItems >= 3 && s.columns >= 2) return "grid";
  if (s.columns === 2) return isAsymmetric(s.columnWidths) ? "asymmetric" : "split";
  if (s.hasMedia && s.contentWidth >= s.width * 0.95) return "full-bleed";
  if (s.textAlign === "center") return "centered";
  return "stack";
}

function sectionRole(s: ObservedSection, i: number, all: ObservedSection[]): SectionRole {
  if (s.tag === "nav" || (s.tag === "header" && s.height < 160)) return "navigation";
  if (s.tag === "footer" || i === all.length - 1) return "footer";
  const firstContent = all.findIndex(
    (x) => x.tag !== "nav" && !(x.tag === "header" && x.height < 160),
  );
  if (i === firstContent) return "hero";
  if (s.indexed) return "list";
  if (s.repeatedItems >= 3) return s.hasMedia ? "gallery" : "features";
  if (s.columns === 2 && s.hasMedia) return "content";
  if (s.height < 360 && s.textAlign === "center") return "cta";
  return "content";
}
