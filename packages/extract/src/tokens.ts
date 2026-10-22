import { contrast, deltaE, parseColor, rgbToOklch, type Rgb } from "./color.js";
import type { RawExtraction } from "./collect.js";
import type { DtcgDocument } from "./dtcg.js";

/** Namespace for UX-STING metadata inside DTCG `$extensions`. */
export const EXT = "dev.ux-sting";

export interface TokenProvenance {
  source: "observed" | "inferred";
  confidence: number;
  evidence: string;
}

const rgb = (hex: string) => parseColor(hex) as Rgb;
const chroma = (hex: string) => rgbToOklch(rgb(hex)).c;

/** DTCG 2025.10 color value with a hex fallback for older tools. */
export function dtcgColor(hex: string) {
  const c = rgb(hex);
  const r3 = (n: number) => Math.round((n / 255) * 1000) / 1000;
  return { colorSpace: "srgb", components: [r3(c.r), r3(c.g), r3(c.b)], hex };
}
const dim = (px: number) => ({ value: Math.round(px * 100) / 100, unit: "px" });
const token = (type: string, value: unknown, p?: TokenProvenance, description?: string) => ({
  $type: type,
  $value: value,
  ...(description ? { $description: description } : {}),
  ...(p ? { $extensions: { [EXT]: p } } : {}),
});

const EASINGS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};
/** cubic-bezier array for a CSS easing; null for steps()/linear() lists. */
export function cubicBezier(easing: string): [number, number, number, number] | null {
  const e = easing.trim();
  if (EASINGS[e]) return EASINGS[e]!;
  const m = /^cubic-bezier\(([^)]+)\)$/.exec(e);
  if (!m) return null;
  const v = m[1]!.split(",").map(Number);
  return v.length === 4 && v.every(Number.isFinite)
    ? (v as [number, number, number, number])
    : null;
}

/** Parses the first layer of a CSS box-shadow into a DTCG shadow value. */
export function parseShadow(css: string) {
  const layers = css.split(/,(?![^(]*\))/).map((l) => l.trim());
  return layers
    .map((layer) => {
      const color = /(rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|#[0-9a-f]{3,8})/i.exec(
        layer,
      )?.[0];
      const lengths = layer
        .replace(color ?? "", "")
        .replace("inset", "")
        .trim()
        .split(/\s+/)
        .map((v) => parseFloat(v))
        .filter(Number.isFinite);
      if (lengths.length < 2) return null;
      const c = parseColor(color ?? "rgba(0,0,0,1)");
      if (!c) return null;
      const hex = `#${[c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
      return {
        color: { ...dtcgColor(hex), alpha: Math.round(c.a * 1000) / 1000 },
        offsetX: dim(lengths[0]!),
        offsetY: dim(lengths[1]!),
        blur: dim(lengths[2] ?? 0),
        spread: dim(lengths[3] ?? 0),
        ...(/\binset\b/.test(layer) ? { inset: true } : {}),
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);
}

/** Merges colors closer than `threshold` ΔE, keeping the heavier one. */
function cluster<T extends { color: string }>(items: T[], weight: (t: T) => number, threshold = 3) {
  const out: Array<T & { weight: number }> = [];
  for (const item of items) {
    const near = out.find((o) => deltaE(rgb(o.color), rgb(item.color)) < threshold);
    if (near) near.weight += weight(item);
    else out.push({ ...item, weight: weight(item) });
  }
  return out.sort((a, b) => b.weight - a.weight);
}

/** Base spacing unit: the largest of 8/4/2 that divides most observed values. */
export function spacingUnit(values: Array<{ px: number; count: number }>): number | null {
  const total = values.reduce((n, v) => n + v.count, 0);
  if (!total) return null;
  for (const unit of [8, 4, 2]) {
    const fit = values.filter((v) => v.px % unit === 0).reduce((n, v) => n + v.count, 0);
    if (fit / total >= 0.7) return unit;
  }
  return 1;
}

/**
 * Turns raw measurements into a DTCG document. Semantic roles carry their
 * provenance in `$extensions["dev.ux-sting"]`; measurements the page did not
 * provide are omitted and listed under `$extensions["dev.ux-sting"].missing`
 * — never invented.
 */
export function extractionToDtcg(raw: RawExtraction): DtcgDocument {
  const missing: string[] = [];
  const obs = (evidence: string, confidence = 0.95): TokenProvenance => ({
    source: "observed",
    confidence,
    evidence,
  });
  const inf = (evidence: string, confidence = 0.7): TokenProvenance => ({
    source: "inferred",
    confidence,
    evidence,
  });
  const color: Record<string, unknown> = {};

  const bg = raw.pageBackground;
  color.background = token("color", dtcgColor(bg), obs("body background, composited"));

  const texts = cluster(raw.textColors, (t) => t.chars);
  const fg = texts[0]?.color;
  if (fg)
    color.foreground = token(
      "color",
      dtcgColor(fg),
      obs(`text color of ${texts[0]!.weight} characters`),
    );
  else missing.push("color.foreground");

  const muted = texts.find(
    (t) =>
      t.color !== fg &&
      chroma(t.color) < 0.06 &&
      fg &&
      contrast(rgb(t.color), rgb(bg)) < contrast(rgb(fg), rgb(bg)),
  );
  if (muted)
    color["muted-foreground"] = token(
      "color",
      dtcgColor(muted.color),
      inf("most-used lower-contrast neutral text color"),
    );
  else missing.push("color.muted-foreground");

  const heading = raw.headings.h1?.color ?? raw.headings.h2?.color;
  if (heading && fg && deltaE(rgb(heading), rgb(fg)) > 3)
    color.heading = token("color", dtcgColor(heading), obs("h1/h2 computed color"));

  const surfaces = cluster(raw.backgrounds, (b) => b.area).filter(
    (b) => deltaE(rgb(b.color), rgb(bg)) > 2 && chroma(b.color) < 0.05,
  );
  if (surfaces[0])
    color.surface = token(
      "color",
      dtcgColor(surfaces[0].color),
      inf("largest painted neutral area besides the page background"),
    );
  else missing.push("color.surface");

  const border = cluster(raw.borderColors, (b) => b.count).find(
    (b) => deltaE(rgb(b.color), rgb(bg)) > 2,
  );
  if (border)
    color.border = token(
      "color",
      dtcgColor(border.color),
      obs(`border color on ${border.weight} edges`, 0.85),
    );
  else missing.push("color.border");

  // Primary: the most frequent chromatic color on buttons (×3) and links.
  const chromatic = raw.interactive.filter((i) => chroma(i.color) >= 0.06);
  const primary = cluster(chromatic, (i) => i.count)[0];
  if (primary) {
    color.primary = token(
      "color",
      dtcgColor(primary.color),
      inf(
        `${primary.kind === "fill" ? "button fill" : "link text"} color, weight ${primary.weight}`,
        0.8,
      ),
    );
    if (primary.kind === "fill")
      color["primary-foreground"] = token(
        "color",
        dtcgColor(primary.on),
        obs("text color on that button"),
      );
  } else missing.push("color.primary");

  const palette = cluster(
    [
      ...raw.backgrounds.map((b) => ({ color: b.color, w: b.area / 1000 })),
      ...raw.textColors.map((t) => ({ color: t.color, w: t.chars })),
      ...raw.interactive.map((i) => ({ color: i.color, w: i.count * 50 })),
    ],
    (x) => x.w,
  ).slice(0, 12);
  color.palette = Object.fromEntries(
    palette.map((p, i) => [String(i + 1), token("color", dtcgColor(p.color))]),
  );

  // Typography.
  const firstFamily = (stack: string) =>
    stack
      .split(",")[0]!
      .trim()
      .replace(/^["']|["']$/g, "");
  const list = (stack: string) => stack.split(",").map((f) => f.trim().replace(/^["']|["']$/g, ""));
  const font: Record<string, unknown> = {};
  const bodyStack = raw.body?.family ?? raw.fonts[0]?.stack;
  const headingStack =
    raw.headings.h1?.family ?? [...raw.fonts].sort((a, b) => b.heading - a.heading)[0]?.stack;
  if (bodyStack)
    font.body = token("fontFamily", list(bodyStack), obs("computed font-family of body text"));
  else missing.push("font.body");
  if (headingStack && (!bodyStack || firstFamily(headingStack) !== firstFamily(bodyStack)))
    font.heading = token("fontFamily", list(headingStack), obs("computed font-family of h1"));
  const mono = raw.fonts.find((f) =>
    /mono|code|courier|consolas|menlo/i.test(firstFamily(f.stack)),
  );
  if (mono) font.mono = token("fontFamily", list(mono.stack), obs("monospace family in use"));

  const fontSize: Record<string, unknown> = {};
  const fontWeight: Record<string, unknown> = {};
  const lineHeight: Record<string, unknown> = {};
  if (raw.body) {
    fontSize.body = token("dimension", dim(raw.body.sizePx), obs("body paragraph font-size"));
    fontWeight.body = token("fontWeight", raw.body.weight, obs("body paragraph font-weight"));
    lineHeight.body = token(
      "number",
      raw.body.lineHeight,
      obs("body paragraph line-height ÷ font-size"),
    );
  } else missing.push("fontSize.body", "lineHeight.body");
  for (const tag of ["h1", "h2", "h3"] as const) {
    const h = raw.headings[tag];
    if (!h) {
      missing.push(`fontSize.${tag}`);
      continue;
    }
    fontSize[tag] = token(
      "dimension",
      dim(h.sizePx),
      obs(`${tag} font-size at ${raw.viewport.width}px`),
    );
    if (tag === "h1") {
      fontWeight.heading = token("fontWeight", h.weight, obs("h1 font-weight"));
      lineHeight.heading = token("number", h.lineHeight, obs("h1 line-height ÷ font-size"));
    }
  }
  const scale = raw.fontSizes.filter((s) => s.chars >= 8).map((s) => s.px);
  if (scale.length)
    fontSize.scale = Object.fromEntries(scale.map((v) => [String(v), token("dimension", dim(v))]));

  // Space, shape, depth.
  const unit = spacingUnit(raw.spacing);
  const spacing: Record<string, unknown> = {};
  if (unit) {
    spacing.unit = token(
      "dimension",
      dim(unit),
      inf("largest of 8/4/2 dividing ≥ 70% of paddings, gaps and margins"),
    );
    const steps = [...new Set(raw.spacing.filter((s) => s.count >= 2).map((s) => s.px))]
      .sort((a, b) => a - b)
      .slice(0, 12);
    spacing.scale = Object.fromEntries(steps.map((v) => [String(v), token("dimension", dim(v))]));
  } else missing.push("spacing.unit");
  if (raw.container)
    spacing.container = token(
      "dimension",
      dim(raw.container),
      obs("most common centered container width"),
    );
  else missing.push("spacing.container");

  const radius: Record<string, unknown> = {};
  const radii = raw.radii.filter((r) => r.px !== 9999);
  if (radii.length) {
    radius.default = token(
      "dimension",
      dim(radii[0]!.px),
      obs(`most common corner radius (${radii[0]!.count} elements)`),
    );
    for (const r of [...radii].sort((a, b) => a.px - b.px))
      radius[String(r.px)] = token("dimension", dim(r.px));
  } else missing.push("radius.default");
  if (raw.radii.some((r) => r.px === 9999))
    radius.full = token("dimension", dim(9999), obs("pill-shaped elements"));

  const shadow: Record<string, unknown> = {};
  raw.shadows.slice(0, 4).forEach((s, i) => {
    const layers = parseShadow(s.value);
    if (layers.length)
      shadow[String(i + 1)] = token(
        "shadow",
        layers.length === 1 ? layers[0] : layers,
        obs(`box-shadow on ${s.count} elements`),
      );
  });
  if (!Object.keys(shadow).length) missing.push("shadow");

  // Motion.
  const motionAll = [...raw.motion.transitions, ...raw.motion.animations];
  const duration: Record<string, unknown> = {};
  const easing: Record<string, unknown> = {};
  if (motionAll.length) {
    const ds = [...new Set(motionAll.map((m) => m.durationMs))].sort((a, b) => a - b);
    // UI feedback speed comes from transitions; entrances from animations.
    const top = (xs: typeof motionAll) => [...xs].sort((a, b) => b.count - a.count)[0];
    const common = top(raw.motion.transitions) ?? top(raw.motion.animations)!;
    duration.default = token(
      "duration",
      { value: common.durationMs, unit: "ms" },
      obs(`most common ${raw.motion.transitions.length ? "transition" : "animation"} duration`),
    );
    const entrance = top(raw.motion.animations.filter((a) => !a.easing.startsWith("steps")));
    if (entrance)
      duration.entrance = token(
        "duration",
        { value: entrance.durationMs, unit: "ms" },
        obs(`most common animation duration (${entrance.count} elements)`),
      );
    for (const d of ds.slice(0, 8))
      duration[String(d)] = token("duration", { value: d, unit: "ms" });
    const eases = new Map<string, number>();
    for (const m of motionAll) eases.set(m.easing, (eases.get(m.easing) ?? 0) + m.count);
    [...eases.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([e], i) => {
        const bez = cubicBezier(e);
        if (bez)
          easing[i === 0 ? "default" : String(i)] = token("cubicBezier", bez, obs(`easing "${e}"`));
      });
  } else missing.push("duration", "easing");

  const breakpoint: Record<string, unknown> = {};
  const bps = [...new Set([...raw.breakpoints.minWidth, ...raw.breakpoints.maxWidth])].sort(
    (a, b) => a - b,
  );
  for (const b of bps.slice(0, 8))
    breakpoint[String(b)] = token("dimension", dim(b), obs("@media width condition"));
  if (!bps.length) missing.push("breakpoint");

  const doc: DtcgDocument = {
    $description: `Design tokens extracted from ${raw.url} at ${raw.viewport.width}px`,
    $extensions: {
      [EXT]: {
        source: raw.url,
        capturedAt: raw.capturedAt,
        viewport: raw.viewport,
        scheme: rgbToOklch(rgb(bg)).l < 0.5 ? "dark" : "light",
        missing,
        unreadableStylesheets: raw.breakpoints.unreadableSheets,
      },
    },
    color,
  };
  const groups = {
    font,
    fontSize,
    fontWeight,
    lineHeight,
    spacing,
    radius,
    shadow,
    duration,
    easing,
    breakpoint,
  };
  for (const [k, v] of Object.entries(groups)) if (Object.keys(v).length) doc[k] = v;
  return doc;
}
