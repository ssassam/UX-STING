import { palette, SCALE_STEPS } from "./palette.js";
import {
  borderWidth,
  breakpoints,
  containers,
  duration,
  durationExit,
  easing,
  fontFamily,
  fontSize,
  fontWeight,
  iconSize,
  lineHeight,
  letterSpacing,
  radiusBase,
  shadow,
  spacing,
  zIndex,
} from "./scales.js";
import {
  createDarkColors,
  createHighContrastColors,
  createLightColors,
  SEMANTIC_COLORS,
  type SemanticColors,
} from "./semantic.js";

/**
 * W3C Design Tokens (DTCG) representation of the UX-STING base system.
 *
 * This is the framework-agnostic interchange format: any design tool, Style
 * Dictionary pipeline or non-web platform can consume it. Values are emitted
 * resolved (no `var()`/`calc()`), so only literal tokens are included — the
 * derived radius scale lives in the CSS/SCSS output where it resolves.
 *
 * Dark and high-contrast modes ride along under `$extensions["com.ux-sting"]`
 * so a single file carries the whole colour system.
 */

const EXT_KEY = "com.ux-sting";

type DtcgGroup = Record<string, unknown>;
export interface DtcgDocument {
  $schema?: string;
  $extensions?: Record<string, unknown>;
  [group: string]: unknown;
}

const colorToken = (value: string): { $type: string; $value: string } => ({
  $type: "color",
  $value: value,
});

const dimToken = (value: string): { $type: string; $value: string } => ({
  $type: "dimension",
  $value: value,
});

function semanticGroup(light: SemanticColors, dark: SemanticColors, hc: SemanticColors): DtcgGroup {
  const group: DtcgGroup = {};
  for (const role of SEMANTIC_COLORS) {
    group[role] = {
      ...colorToken(light[role]),
      $extensions: { [EXT_KEY]: { dark: dark[role], "high-contrast": hc[role] } },
    };
  }
  return group;
}

/** Builds the full DTCG document for the base (default-theme) token set. */
export function buildDtcgDocument(): DtcgDocument {
  const light = createLightColors();
  const dark = createDarkColors();
  const hc = createHighContrastColors();

  const paletteGroup: DtcgGroup = {};
  for (const [name, scale] of Object.entries(palette)) {
    const steps: DtcgGroup = {};
    for (const step of SCALE_STEPS) steps[String(step)] = colorToken(scale[step]);
    paletteGroup[name] = steps;
  }

  const dimension: DtcgGroup = {
    spacing: Object.fromEntries(
      Object.entries(spacing).map(([k, v]) => [k.replace(".", "_"), dimToken(v)]),
    ),
    "border-width": Object.fromEntries(
      Object.entries(borderWidth).map(([k, v]) => [k, dimToken(v)]),
    ),
    "icon-size": Object.fromEntries(Object.entries(iconSize).map(([k, v]) => [k, dimToken(v)])),
    breakpoint: Object.fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, dimToken(v)])),
    container: Object.fromEntries(Object.entries(containers).map(([k, v]) => [k, dimToken(v)])),
    "radius-base": Object.fromEntries(Object.entries(radiusBase).map(([k, v]) => [k, dimToken(v)])),
  };

  const typography: DtcgGroup = {
    fontFamily: Object.fromEntries(
      Object.entries(fontFamily).map(([k, v]) => [k, { $type: "fontFamily", $value: v }]),
    ),
    fontWeight: Object.fromEntries(
      Object.entries(fontWeight).map(([k, v]) => [k, { $type: "fontWeight", $value: Number(v) }]),
    ),
    lineHeight: Object.fromEntries(
      Object.entries(lineHeight).map(([k, v]) => [k, { $type: "number", $value: Number(v) }]),
    ),
    letterSpacing: Object.fromEntries(
      Object.entries(letterSpacing).map(([k, v]) => [k, dimToken(v)]),
    ),
    fontSize: Object.fromEntries(
      Object.entries(fontSize).map(([k, [size, leading]]) => [
        k,
        { $type: "dimension", $value: size, $description: `line-height ${leading}` },
      ]),
    ),
  };

  const motion: DtcgGroup = {
    duration: Object.fromEntries(Object.entries(duration).map(([k, v]) => [k, dimToken(v)])),
    "duration-exit": Object.fromEntries(
      Object.entries(durationExit).map(([k, v]) => [k, dimToken(v)]),
    ),
    easing: Object.fromEntries(
      Object.entries(easing).map(([k, v]) => [k, { $type: "cubicBezier", $value: v }]),
    ),
  };

  const effect: DtcgGroup = {
    shadow: Object.fromEntries(
      Object.entries(shadow).map(([k, v]) => [k, { $type: "shadow", $value: v }]),
    ),
  };

  const other: DtcgGroup = {
    zIndex: Object.fromEntries(
      Object.entries(zIndex).map(([k, v]) => [k, { $type: "number", $value: Number(v) }]),
    ),
  };

  return {
    $schema: "https://design-tokens.github.io/community-group/format/",
    $extensions: { [EXT_KEY]: { prefix: "ui", generator: "ux-sting tokens export" } },
    color: { palette: paletteGroup, semantic: semanticGroup(light, dark, hc) },
    dimension,
    typography,
    motion,
    effect,
    other,
  };
}
