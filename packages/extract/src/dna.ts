import { PRESET_NAMES, presetConfigs, presets, type PresetName } from "@ux-sting/themes";
import { radiusBase, type RadiusPreset } from "@ux-sting/tokens";
import { parseColor, rgbToOklch } from "./color.js";
import { flattenDtcg, fontList, toMs, toPx, type DtcgDocument } from "./dtcg.js";
import { dtcgToTheme, isSerif } from "./theme.js";
import { EXT } from "./tokens.js";

/**
 * A comparable summary of a design. Every field is a measurement or null —
 * a missing measurement stays null and is skipped when comparing, never
 * filled with a guess.
 */
export interface DnaVector {
  scheme: "light" | "dark" | null;
  /** OKLCH lightness of the page background, 0–1. */
  backgroundL: number | null;
  /** WCAG contrast of foreground on background. */
  textContrast: number | null;
  /** Hue (deg) and chroma of the primary color. */
  primaryHue: number | null;
  primaryChroma: number | null;
  /** Chroma of the neutrals (0 = pure gray). */
  neutralChroma: number | null;
  /** Card/control corner radius, px. */
  radiusPx: number | null;
  /** 1 when headings use a serif, 0 when sans. */
  serifHeadings: number | null;
  /** Body font size, px. */
  bodyPx: number | null;
  /** h1 ÷ body font size. */
  headingRatio: number | null;
  /** Base spacing unit, px. */
  spacingUnit: number | null;
  /** Typical motion duration, ms. */
  motionMs: number | null;
  /** 1 when elevation shadows are used. */
  shadows: number | null;
}

const KEYS: Array<{ key: keyof DnaVector; range: number; weight: number }> = [
  { key: "backgroundL", range: 1, weight: 3 },
  { key: "textContrast", range: 21, weight: 1 },
  { key: "primaryHue", range: 180, weight: 2 },
  { key: "primaryChroma", range: 0.25, weight: 1.5 },
  { key: "neutralChroma", range: 0.04, weight: 0.5 },
  { key: "radiusPx", range: 16, weight: 1.5 },
  { key: "serifHeadings", range: 1, weight: 1.5 },
  { key: "bodyPx", range: 8, weight: 0.5 },
  { key: "headingRatio", range: 3, weight: 0.5 },
  { key: "spacingUnit", range: 8, weight: 0.25 },
  { key: "motionMs", range: 400, weight: 0.25 },
  { key: "shadows", range: 1, weight: 0.5 },
];

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** True when an extraction looked for shadows and found none (absence was measured). */
const measuredNoShadow = (doc: DtcgDocument) => {
  const ext = (doc.$extensions as Record<string, { missing?: string[] }> | undefined)?.[EXT];
  return Boolean(ext?.missing?.includes("shadow"));
};

/** Builds a DNA vector from any DTCG document. */
export function dnaFromDtcg(doc: DtcgDocument): DnaVector {
  const tokens = flattenDtcg(doc);
  const theme = dtcgToTheme(doc);
  const colors = theme.config.colors?.[theme.scheme] ?? {};
  const o = (v?: string) => (v ? rgbToOklch(parseColor(v)!) : null);
  const bg = theme.missing.includes("background") ? null : o(colors.background);
  const fg = theme.missing.includes("foreground") ? null : o(colors.foreground);
  const primary = theme.missing.includes("primary") ? null : o(colors.primary);
  const contrastOf = () => {
    if (!colors.background || !colors.foreground || !bg || !fg) return null;
    const lum = (v: string) => {
      const c = parseColor(v)!;
      const f = (x: number) => ((x /= 255) <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const [a, b] = [lum(colors.background), lum(colors.foreground)].sort((x, y) => y - x) as [
      number,
      number,
    ];
    return r3((a + 0.05) / (b + 0.05));
  };

  const find = (re: RegExp) => tokens.find((t) => re.test(t.path));
  const px = (re: RegExp) => {
    const t = find(re);
    return t ? toPx(t.value) : null;
  };
  const headingFont =
    find(/(^|\.)(font|fontFamily)\.(heading|display|title)/i) ??
    tokens.find((t) => t.type === "fontFamily" && /heading|display/i.test(t.path));
  const bodyFont = find(/(^|\.)(font|fontFamily)\.(body|base|sans|text)/i);
  const bodyPx = px(/fontSize\.body$|font-size\.body$|typography\.body\.fontSize$/i);
  const h1 = px(/fontSize\.h1$|font-size\.h1$/i);
  const motion = find(/(^|\.)duration\.default$/) ?? tokens.find((t) => t.type === "duration");
  const radius = theme.config.radius ? toPx(theme.config.radius) : null;
  const headingFamilies = fontList(headingFont?.value ?? bodyFont?.value);
  const hasFonts = Boolean(headingFont ?? bodyFont);

  return {
    scheme: bg ? (bg.l < 0.5 ? "dark" : "light") : null,
    backgroundL: bg ? r3(bg.l) : null,
    textContrast: contrastOf(),
    primaryHue: primary ? Math.round(primary.h) : null,
    primaryChroma: primary ? r3(primary.c) : null,
    neutralChroma: bg && fg ? r3((bg.c + fg.c) / 2) : null,
    radiusPx: radius,
    serifHeadings: hasFonts && headingFamilies.length ? Number(isSerif(headingFamilies)) : null,
    bodyPx,
    headingRatio: bodyPx && h1 ? r3(h1 / bodyPx) : null,
    spacingUnit: px(/spacing\.unit$/),
    motionMs: motion ? toMs(motion.value) : null,
    shadows: tokens.some((t) => t.type === "shadow") ? 1 : measuredNoShadow(doc) ? 0 : null,
  };
}

/** DNA vectors of UX-STING's theme presets (only what a preset defines; the rest is null). */
export function presetVector(name: PresetName, scheme: "light" | "dark" = "light"): DnaVector {
  const theme = presets[name];
  const config = presetConfigs[name] as {
    radius?: string;
    fontFamily?: { sans?: string; serif?: string };
    vars?: Record<string, string>;
  };
  const colors = scheme === "dark" ? theme.dark : theme.light;
  const o = (v: string) => rgbToOklch(parseColor(v)!);
  const bg = o(colors.background);
  const fg = o(colors.foreground);
  const p = o(colors.primary);
  const radius = config.radius ?? "medium";
  const radiusPx = toPx(radius in radiusBase ? radiusBase[radius as RadiusPreset] : radius);
  // Presets that set a serif slot use it for display type (editorial, luxury).
  const serif = config.fontFamily?.serif ? 1 : 0;
  const shadowNone = config.vars?.["shadow-md"] === "none";
  return {
    scheme,
    backgroundL: r3(bg.l),
    textContrast: null,
    primaryHue: p.c < 0.02 ? null : Math.round(p.h),
    primaryChroma: r3(p.c),
    neutralChroma: r3((bg.c + fg.c) / 2),
    radiusPx,
    serifHeadings: serif,
    bodyPx: null,
    headingRatio: null,
    spacingUnit: null,
    motionMs: null,
    shadows: shadowNone ? 0 : 1,
  };
}

export interface PresetMatch {
  preset: PresetName;
  /** 0 = identical on every compared dimension; 1 ≈ far apart. */
  distance: number;
  /** Dimensions both vectors had. */
  compared: Array<keyof DnaVector>;
}

/** Weighted, normalised distance over the dimensions both vectors measured. */
export function vectorDistance(
  a: DnaVector,
  b: DnaVector,
): { distance: number; compared: Array<keyof DnaVector> } {
  let sum = 0;
  let weights = 0;
  const compared: Array<keyof DnaVector> = [];
  for (const { key, range, weight } of KEYS) {
    const x = a[key];
    const y = b[key];
    if (typeof x !== "number" || typeof y !== "number") continue;
    let d = Math.abs(x - y);
    if (key === "primaryHue") {
      d = Math.min(d, 360 - d);
      // Hue barely matters for near-gray primaries.
      const c = Math.min(a.primaryChroma ?? 0.1, b.primaryChroma ?? 0.1);
      if (c < 0.04) continue;
    }
    sum += weight * Math.min(1, d / range) ** 2;
    weights += weight;
    compared.push(key);
  }
  return { distance: weights ? r3(Math.sqrt(sum / weights)) : 1, compared };
}

/** Ranks UX-STING presets by closeness to `vector`, in the vector's own scheme. */
export function nearestPresets(vector: DnaVector, limit = 3): PresetMatch[] {
  const scheme = vector.scheme ?? "light";
  return PRESET_NAMES.map((preset) => ({
    preset,
    ...vectorDistance(vector, presetVector(preset, scheme)),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
