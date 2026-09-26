import { oklch } from "./color.js";

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];
export type ColorScale = Record<ScaleStep, string>;

/** Perceptual lightness for each step (OKLCH L). */
const LIGHTNESS: Record<ScaleStep, number> = {
  50: 0.985,
  100: 0.965,
  200: 0.925,
  300: 0.87,
  400: 0.78,
  500: 0.665,
  600: 0.535,
  700: 0.47,
  800: 0.39,
  900: 0.31,
  950: 0.225,
};

/** Relative chroma for each step; mid-tones are the most saturated. */
const CHROMA: Record<ScaleStep, number> = {
  50: 0.07,
  100: 0.14,
  200: 0.3,
  300: 0.5,
  400: 0.75,
  500: 0.92,
  600: 1,
  700: 0.95,
  800: 0.82,
  900: 0.66,
  950: 0.5,
};

/**
 * Generates an 11-step scale from a hue and peak chroma. Hue may drift slightly
 * across steps (`hueShift`) to keep darker shades from looking muddy.
 */
export function createScale(hue: number, peakChroma: number, hueShift = 0): ColorScale {
  const scale = {} as ColorScale;
  SCALE_STEPS.forEach((step, index) => {
    const t = index / (SCALE_STEPS.length - 1);
    scale[step] = oklch(LIGHTNESS[step], peakChroma * CHROMA[step], hue + hueShift * (t - 0.5));
  });
  return scale;
}

/**
 * The unified-ui base palette. Neutrals carry a faint cool tint; accents are
 * tuned so that step 600 passes WCAG AA against white text.
 */
export const palette = {
  gray: createScale(260, 0.018),
  slate: createScale(250, 0.03),
  blue: createScale(262, 0.2, -6),
  indigo: createScale(275, 0.2),
  violet: createScale(295, 0.21),
  pink: createScale(350, 0.19),
  red: createScale(25, 0.2, 4),
  orange: createScale(50, 0.18),
  amber: createScale(75, 0.17, 6),
  green: createScale(150, 0.16),
  teal: createScale(185, 0.12),
  sky: createScale(235, 0.15),
} as const satisfies Record<string, ColorScale>;

export type PaletteName = keyof typeof palette;

export const white = "oklch(1 0 0)";
export const black = "oklch(0 0 0)";
