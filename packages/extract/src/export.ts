import { createTheme, type ResolvedTheme, type ThemeConfig } from "@ux-sting/themes";
import {
  defaultIntentScales,
  palette,
  parseOklch,
  SCALE_STEPS,
  type ColorScale,
  type IntentScales,
  type SemanticColors,
} from "@ux-sting/tokens";
import { parseColor, toHex } from "./color.js";
import type { DtcgDocument } from "./dtcg.js";
import { EXT } from "./tokens.js";

export type ExportMode = "light" | "dark" | "high-contrast";
export const EXPORT_MODES: ExportMode[] = ["light", "dark", "high-contrast"];

export interface ThemeExport {
  name: string;
  /** Layer 1: raw scales (`palette.<intent>.<step>`), radius and fonts. Mode-independent. */
  palette: DtcgDocument;
  /**
   * Layer 2, one document per mode: semantic roles (`color.<role>`). Values are
   * aliases into the palette (`{palette.primary.600}`) where the theme uses a
   * palette step, raw colors otherwise; `resolved: true` writes raw colors only.
   */
  modes: Record<ExportMode, DtcgDocument>;
  /** Semantic values per mode that are not a palette step (exported as raw colors). */
  unaliased: Record<ExportMode, string[]>;
}

const round = (n: number, d = 4) => Number(n.toFixed(d));

/** DTCG 2025.10 color value (OKLCH kept as OKLCH) with a hex fallback; null if unparseable. */
export function dtcgColorValue(css: string) {
  const rgb = parseColor(css);
  if (!rgb) return null;
  const hex = toHex(rgb);
  const alpha = rgb.a < 1 ? { alpha: round(rgb.a, 3) } : {};
  if (/^oklch\(/i.test(css.trim())) {
    // parseOklch ignores the alpha part, which `parseColor` already read.
    const { l, c, h } = parseOklch(css.replace(/\s*\/\s*[\d.]+%?\s*\)$/, ")"));
    return { colorSpace: "oklch", components: [round(l), round(c), round(h, 2)], ...alpha, hex };
  }
  const r3 = (n: number) => round(n / 255, 4);
  return { colorSpace: "srgb", components: [r3(rgb.r), r3(rgb.g), r3(rgb.b)], ...alpha, hex };
}

const scaleOf = (value: ThemeConfig["primary"], fallback: ColorScale): ColorScale =>
  value === undefined ? fallback : typeof value === "string" ? palette[value] : value;

/** The intent scales a config resolves to (mirrors `createTheme`). */
export function themeScales(config: ThemeConfig): IntentScales {
  return {
    ...defaultIntentScales,
    primary: scaleOf(config.primary, defaultIntentScales.primary),
    neutral: scaleOf(config.neutral, defaultIntentScales.neutral),
  };
}

const colorToken = (css: string, description?: string) => {
  const value = dtcgColorValue(css);
  return value
    ? { $type: "color", $value: value, ...(description ? { $description: description } : {}) }
    : null;
};

/**
 * Exports a UX-STING theme as W3C DTCG tokens in two layers, the structure
 * Figma variables and Tokens Studio expect: a palette collection and a
 * semantic collection with one file per mode. Re-importing the palette plus
 * one mode with `ux-sting theme import` gives back the same core roles.
 */
export function themeToDtcg(
  config: ThemeConfig,
  options: { resolved?: boolean } = {},
): ThemeExport {
  const theme: ResolvedTheme = createTheme(config);
  const scales = themeScales(config);

  // Layer 1: palette. Index every step's exact value so semantic roles can alias it.
  const paletteGroup: Record<string, Record<string, unknown>> = {};
  const index = new Map<string, string>();
  for (const [intent, scale] of Object.entries(scales) as Array<[string, ColorScale]>) {
    const group: Record<string, unknown> = {};
    for (const step of SCALE_STEPS) {
      const t = colorToken(scale[step]);
      if (!t) continue;
      group[step] = t;
      if (!index.has(scale[step])) index.set(scale[step], `palette.${intent}.${step}`);
    }
    paletteGroup[intent] = group;
  }
  paletteGroup.base = { white: colorToken("oklch(1 0 0)"), black: colorToken("oklch(0 0 0)") };
  index.set("oklch(1 0 0)", "palette.base.white");
  index.set("oklch(0 0 0)", "palette.base.black");

  const paletteDoc: DtcgDocument = {
    $description: `UX-STING theme "${theme.name}": palette (layer 1). Semantic tokens alias these.`,
    palette: paletteGroup,
  };
  const radius = theme.vars["--ui-radius"];
  if (radius) {
    const m = /^([\d.]+)(px|rem)$/.exec(radius.trim());
    paletteDoc.radius = {
      base: m
        ? { $type: "dimension", $value: { value: Number(m[1]), unit: m[2] } }
        : { $type: "dimension", $value: radius },
    };
  }
  const fonts = Object.entries(theme.vars).filter(([k]) => k.startsWith("--ui-font-"));
  if (fonts.length)
    paletteDoc.font = Object.fromEntries(
      fonts.map(([k, v]) => [
        k.replace("--ui-font-", ""),
        {
          $type: "fontFamily",
          $value: v
            .split(",")
            .map((f) => f.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean),
        },
      ]),
    );

  // Layer 2: semantic roles per mode.
  const sets: Record<ExportMode, SemanticColors> = {
    light: theme.light,
    dark: theme.dark,
    "high-contrast": theme.highContrast,
  };
  const modes = {} as Record<ExportMode, DtcgDocument>;
  const unaliased = {} as Record<ExportMode, string[]>;
  for (const mode of EXPORT_MODES) {
    const color: Record<string, unknown> = {};
    unaliased[mode] = [];
    for (const [role, css] of Object.entries(sets[mode])) {
      const alias = options.resolved ? undefined : index.get(css);
      if (alias) color[role] = { $type: "color", $value: `{${alias}}` };
      else {
        const t = colorToken(css);
        if (!t) continue;
        color[role] = t;
        if (!options.resolved) unaliased[mode].push(role);
      }
    }
    modes[mode] = {
      $description: `UX-STING theme "${theme.name}": semantic colors, ${mode} mode (layer 2).`,
      $extensions: { [EXT]: { theme: theme.name, mode } },
      color,
    };
  }
  return { name: theme.name, palette: paletteDoc, modes, unaliased };
}
