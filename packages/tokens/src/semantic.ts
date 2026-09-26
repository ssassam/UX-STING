import { palette, white, type ColorScale } from "./palette.js";

/**
 * Semantic color roles. Components must only reference these — never raw
 * palette values — so that themes and color modes work without per-component
 * overrides.
 */
export const SEMANTIC_COLORS = [
  "background",
  "foreground",
  "surface",
  "surface-foreground",
  "muted",
  "muted-foreground",
  "subtle",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "overlay",
  "primary",
  "primary-hover",
  "primary-foreground",
  "primary-subtle",
  "primary-subtle-foreground",
  "secondary",
  "secondary-hover",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-hover",
  "destructive-foreground",
  "destructive-subtle",
  "destructive-subtle-foreground",
  "success",
  "success-hover",
  "success-foreground",
  "success-subtle",
  "success-subtle-foreground",
  "warning",
  "warning-hover",
  "warning-foreground",
  "warning-subtle",
  "warning-subtle-foreground",
  "info",
  "info-hover",
  "info-foreground",
  "info-subtle",
  "info-subtle-foreground",
  "border",
  "border-strong",
  "input",
  "ring",
] as const;

export type SemanticColor = (typeof SEMANTIC_COLORS)[number];
export type SemanticColors = Record<SemanticColor, string>;

export interface IntentScales {
  neutral: ColorScale;
  primary: ColorScale;
  destructive: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}

export const defaultIntentScales: IntentScales = {
  neutral: palette.gray,
  primary: palette.blue,
  destructive: palette.red,
  success: palette.green,
  warning: palette.amber,
  info: palette.sky,
};

/** Builds the light-mode semantic colors from a set of scales. */
export function createLightColors(s: IntentScales = defaultIntentScales): SemanticColors {
  const n = s.neutral;
  return {
    background: white,
    foreground: n[950],
    surface: n[50],
    "surface-foreground": n[950],
    muted: n[100],
    "muted-foreground": n[600],
    subtle: n[50],
    card: white,
    "card-foreground": n[950],
    popover: white,
    "popover-foreground": n[950],
    overlay: "oklch(0.2 0.01 260 / 0.45)",
    primary: s.primary[600],
    "primary-hover": s.primary[700],
    "primary-foreground": white,
    "primary-subtle": s.primary[50],
    "primary-subtle-foreground": s.primary[800],
    secondary: n[100],
    "secondary-hover": n[200],
    "secondary-foreground": n[900],
    accent: n[100],
    "accent-foreground": n[900],
    destructive: s.destructive[600],
    "destructive-hover": s.destructive[700],
    "destructive-foreground": white,
    "destructive-subtle": s.destructive[50],
    "destructive-subtle-foreground": s.destructive[800],
    success: s.success[700],
    "success-hover": s.success[800],
    "success-foreground": white,
    "success-subtle": s.success[50],
    "success-subtle-foreground": s.success[800],
    warning: s.warning[400],
    "warning-hover": s.warning[500],
    "warning-foreground": s.warning[950],
    "warning-subtle": s.warning[50],
    "warning-subtle-foreground": s.warning[900],
    info: s.info[700],
    "info-hover": s.info[800],
    "info-foreground": white,
    "info-subtle": s.info[50],
    "info-subtle-foreground": s.info[800],
    border: n[200],
    "border-strong": n[300],
    input: n[500],
    ring: s.primary[500],
  };
}

/** Builds the dark-mode semantic colors from a set of scales. */
export function createDarkColors(s: IntentScales = defaultIntentScales): SemanticColors {
  const n = s.neutral;
  return {
    background: n[950],
    foreground: n[50],
    surface: n[900],
    "surface-foreground": n[50],
    muted: n[900],
    "muted-foreground": n[400],
    subtle: n[900],
    card: n[900],
    "card-foreground": n[50],
    popover: n[900],
    "popover-foreground": n[50],
    overlay: "oklch(0.1 0.01 260 / 0.65)",
    primary: s.primary[400],
    "primary-hover": s.primary[300],
    "primary-foreground": s.primary[950],
    "primary-subtle": s.primary[950],
    "primary-subtle-foreground": s.primary[200],
    secondary: n[800],
    "secondary-hover": n[700],
    "secondary-foreground": n[50],
    accent: n[800],
    "accent-foreground": n[50],
    destructive: s.destructive[400],
    "destructive-hover": s.destructive[300],
    "destructive-foreground": s.destructive[950],
    "destructive-subtle": s.destructive[950],
    "destructive-subtle-foreground": s.destructive[200],
    success: s.success[400],
    "success-hover": s.success[300],
    "success-foreground": s.success[950],
    "success-subtle": s.success[950],
    "success-subtle-foreground": s.success[200],
    warning: s.warning[400],
    "warning-hover": s.warning[300],
    "warning-foreground": s.warning[950],
    "warning-subtle": s.warning[950],
    "warning-subtle-foreground": s.warning[200],
    info: s.info[400],
    "info-hover": s.info[300],
    "info-foreground": s.info[950],
    "info-subtle": s.info[950],
    "info-subtle-foreground": s.info[200],
    border: n[800],
    "border-strong": n[700],
    input: n[600],
    ring: s.primary[400],
  };
}

/** High-contrast light colors: stronger text, borders and focus rings. */
export function createHighContrastColors(s: IntentScales = defaultIntentScales): SemanticColors {
  const base = createLightColors(s);
  const n = s.neutral;
  return {
    ...base,
    foreground: "oklch(0 0 0)",
    "surface-foreground": "oklch(0 0 0)",
    "card-foreground": "oklch(0 0 0)",
    "popover-foreground": "oklch(0 0 0)",
    "muted-foreground": n[800],
    primary: s.primary[800],
    "primary-hover": s.primary[900],
    "primary-subtle-foreground": s.primary[900],
    secondary: n[200],
    "secondary-foreground": "oklch(0 0 0)",
    "accent-foreground": "oklch(0 0 0)",
    destructive: s.destructive[800],
    "destructive-hover": s.destructive[900],
    success: s.success[800],
    "success-hover": s.success[900],
    info: s.info[800],
    "info-hover": s.info[900],
    border: n[600],
    "border-strong": n[800],
    input: n[700],
    ring: s.primary[800],
  };
}

/** Pairs of (background, foreground) that must meet WCAG AA (4.5:1). */
export const CONTRAST_PAIRS: ReadonlyArray<readonly [SemanticColor, SemanticColor]> = [
  ["background", "foreground"],
  ["background", "muted-foreground"],
  ["muted", "muted-foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["surface", "surface-foreground"],
  ["primary", "primary-foreground"],
  ["primary-hover", "primary-foreground"],
  ["primary-subtle", "primary-subtle-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["destructive-subtle", "destructive-subtle-foreground"],
  ["success", "success-foreground"],
  ["success-subtle", "success-subtle-foreground"],
  ["warning", "warning-foreground"],
  ["warning-subtle", "warning-subtle-foreground"],
  ["info", "info-foreground"],
  ["info-subtle", "info-subtle-foreground"],
];

/** Pairs that must meet the 3:1 non-text contrast requirement (WCAG 1.4.11). */
export const NON_TEXT_CONTRAST_PAIRS: ReadonlyArray<readonly [SemanticColor, SemanticColor]> = [
  ["background", "ring"],
  ["background", "primary"],
  ["background", "input"],
];
