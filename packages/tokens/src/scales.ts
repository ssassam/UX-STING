/**
 * Non-color design tokens. Values are CSS-ready strings so they can be emitted
 * as custom properties or consumed directly from TypeScript.
 */

export const spacing = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
} as const;

export const fontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Noto Sans Arabic", Arial, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", "Noto Serif", serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as const;

/** Font size + matching line height pairs. */
export const fontSize = {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.25rem"],
  md: ["1rem", "1.5rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"],
  "3xl": ["1.875rem", "2.25rem"],
  "4xl": ["2.25rem", "2.5rem"],
  "5xl": ["3rem", "1.1"],
  "6xl": ["3.75rem", "1.05"],
} as const satisfies Record<string, readonly [string, string]>;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.2",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.65",
} as const;

export const letterSpacing = {
  tight: "-0.02em",
  snug: "-0.01em",
  normal: "0",
  wide: "0.02em",
} as const;

/** Radius scale derived from a single `--ui-radius` base value. */
export const radius = {
  none: "0px",
  xs: "calc(var(--ui-radius) * 0.25)",
  sm: "calc(var(--ui-radius) * 0.5)",
  md: "calc(var(--ui-radius) * 0.75)",
  lg: "var(--ui-radius)",
  xl: "calc(var(--ui-radius) * 1.5)",
  "2xl": "calc(var(--ui-radius) * 2)",
  full: "9999px",
} as const;

export const radiusBase = {
  none: "0px",
  small: "0.375rem",
  medium: "0.625rem",
  large: "0.875rem",
} as const;

export type RadiusPreset = keyof typeof radiusBase;

export const shadow = {
  none: "none",
  xs: "0 1px 2px 0 oklch(0.2 0.02 260 / 0.05)",
  sm: "0 1px 3px 0 oklch(0.2 0.02 260 / 0.08), 0 1px 2px -1px oklch(0.2 0.02 260 / 0.06)",
  md: "0 4px 8px -2px oklch(0.2 0.02 260 / 0.08), 0 2px 4px -2px oklch(0.2 0.02 260 / 0.05)",
  lg: "0 12px 24px -6px oklch(0.2 0.02 260 / 0.12), 0 4px 8px -4px oklch(0.2 0.02 260 / 0.06)",
  xl: "0 24px 48px -12px oklch(0.2 0.02 260 / 0.2)",
} as const;

export const borderWidth = {
  "0": "0px",
  "1": "1px",
  "2": "2px",
} as const;

export const zIndex = {
  base: "0",
  raised: "10",
  sticky: "1100",
  header: "1200",
  overlay: "1300",
  modal: "1400",
  popover: "1500",
  toast: "1700",
  tooltip: "1800",
} as const;

export const duration = {
  instant: "0ms",
  fast: "120ms",
  normal: "200ms",
  slow: "300ms",
  slower: "450ms",
} as const;

/**
 * Exit durations are ~65% of their enter counterparts so dismissals feel
 * responsive ("exit faster than enter").
 */
export const durationExit = {
  fast: "80ms",
  normal: "130ms",
  slow: "200ms",
  slower: "300ms",
} as const;

/** Icon sizes as tokens so icon rhythm stays consistent across components. */
export const iconSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
} as const;

/** Default icon stroke width; one value keeps the icon family visually coherent. */
export const iconStroke = "1.75";

/**
 * Minimum pointer target sizes. WCAG 2.2 (2.5.8) requires 24×24 CSS px; on
 * coarse pointers (touch) components expand hit areas to 44×44 px.
 */
export const targetSize = {
  min: "1.5rem",
  touch: "2.75rem",
} as const;

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1.2)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

export const containers = {
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  prose: "65ch",
} as const;

export const DENSITIES = ["compact", "comfortable", "spacious"] as const;
export type Density = (typeof DENSITIES)[number];

export const CONTROL_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
export type ControlSize = (typeof CONTROL_SIZES)[number];

/**
 * Density-dependent tokens: control heights, paddings and gaps used by
 * buttons, inputs, tables, cards, navigation and lists.
 */
export const density: Record<Density, Record<string, string>> = {
  compact: {
    "height-xs": "1.5rem",
    "height-sm": "1.75rem",
    "height-md": "2rem",
    "height-lg": "2.25rem",
    "height-xl": "2.75rem",
    "control-px": "0.625rem",
    "control-gap": "0.375rem",
    "cell-px": "0.5rem",
    "cell-py": "0.375rem",
    "card-p": "1rem",
    "nav-item-h": "2rem",
    "list-item-py": "0.375rem",
    "stack-gap": "0.75rem",
  },
  comfortable: {
    "height-xs": "1.75rem",
    "height-sm": "2rem",
    "height-md": "2.5rem",
    "height-lg": "2.75rem",
    "height-xl": "3.25rem",
    "control-px": "0.875rem",
    "control-gap": "0.5rem",
    "cell-px": "0.75rem",
    "cell-py": "0.625rem",
    "card-p": "1.5rem",
    "nav-item-h": "2.25rem",
    "list-item-py": "0.625rem",
    "stack-gap": "1rem",
  },
  spacious: {
    "height-xs": "2rem",
    "height-sm": "2.25rem",
    "height-md": "2.75rem",
    "height-lg": "3rem",
    "height-xl": "3.5rem",
    "control-px": "1.125rem",
    "control-gap": "0.625rem",
    "cell-px": "1rem",
    "cell-py": "0.875rem",
    "card-p": "2rem",
    "nav-item-h": "2.75rem",
    "list-item-py": "0.875rem",
    "stack-gap": "1.25rem",
  },
};
