import { createScale, palette, white } from "@ux-sting/tokens";
import { createTheme, type ThemeConfig } from "./theme.js";

const g = palette.gray;

/*
 * Company-style presets approximate the public visual language (color,
 * shape, type, density) of well-known design systems. They are unofficial,
 * not affiliated with or endorsed by those companies, and ship no assets —
 * fonts are referenced by name with system fallbacks.
 */
const materialPurple = createScale(293, 0.16);
const materialNeutral = createScale(293, 0.012);
const fluentBlue = createScale(252, 0.15);
const carbonBlue = createScale(264, 0.21);
const appleBlue = createScale(257, 0.2);
const stripeBlurple = createScale(281, 0.2);
const stripeSlate = createScale(255, 0.04);
const polarisGreen = createScale(165, 0.12);

/** Monochrome (near-black) primary used by the Polaris and Base Web styles. */
const inkPrimary = {
  light: {
    primary: g[900],
    "primary-hover": g[800],
    "primary-foreground": white,
    "primary-subtle": g[100],
    "primary-subtle-foreground": g[900],
    ring: g[600],
  },
  dark: {
    primary: g[50],
    "primary-hover": g[200],
    "primary-foreground": g[950],
    "primary-subtle": g[800],
    "primary-subtle-foreground": g[100],
    ring: g[300],
  },
};

const flatShadows = {
  "shadow-xs": "none",
  "shadow-sm": "none",
  "shadow-md": "0 2px 6px oklch(0 0 0 / 0.2)",
  "shadow-lg": "0 2px 6px oklch(0 0 0 / 0.3)",
  "shadow-xl": "0 4px 12px oklch(0 0 0 / 0.3)",
};

export const presetConfigs = {
  default: { name: "default" },
  neutral: {
    name: "neutral",
    primary: "gray",
    colors: {
      light: {
        primary: g[900],
        "primary-hover": g[800],
        "primary-foreground": g[50],
        "primary-subtle": g[100],
        "primary-subtle-foreground": g[900],
        ring: g[500],
      },
      dark: {
        primary: g[50],
        "primary-hover": g[200],
        "primary-foreground": g[900],
        "primary-subtle": g[800],
        "primary-subtle-foreground": g[100],
        ring: g[400],
      },
    },
  },
  modern: {
    name: "modern",
    primary: "violet",
    neutral: "slate",
    radius: "large",
  },
  compact: {
    name: "compact",
    radius: "small",
    density: "compact",
  },
  soft: {
    name: "soft",
    primary: "teal",
    radius: "large",
    colors: {
      light: {
        primary: palette.teal[700],
        "primary-hover": palette.teal[800],
        ring: palette.teal[500],
        border: g[100],
        surface: palette.teal[50],
        muted: g[50],
        card: white,
      },
    },
  },
  "high-contrast": {
    name: "high-contrast",
    radius: "small",
    colors: {
      light: {
        foreground: "oklch(0 0 0)",
        "card-foreground": "oklch(0 0 0)",
        "popover-foreground": "oklch(0 0 0)",
        "muted-foreground": g[800],
        primary: palette.blue[800],
        "primary-hover": palette.blue[900],
        border: g[600],
        "border-strong": g[800],
        input: g[700],
        ring: palette.blue[800],
      },
      dark: {
        background: "oklch(0 0 0)",
        foreground: white,
        card: "oklch(0.12 0 0)",
        popover: "oklch(0.12 0 0)",
        "muted-foreground": g[200],
        border: g[400],
        "border-strong": g[200],
        input: g[300],
        primary: palette.blue[300],
        "primary-foreground": "oklch(0 0 0)",
        ring: palette.blue[200],
      },
    },
  },
  /** Material Design 3 style (Google): tonal purple, rounded shapes, Roboto. */
  material: {
    name: "material",
    primary: materialPurple,
    neutral: materialNeutral,
    radius: "large",
    fontFamily: { sans: 'Roboto, "Google Sans", system-ui, sans-serif' },
    colors: {
      light: { surface: materialPurple[50], "primary-subtle": materialPurple[100] },
    },
  },
  /** Fluent 2 style (Microsoft): communication blue, 4px corners, Segoe UI. */
  fluent: {
    name: "fluent",
    primary: fluentBlue,
    neutral: "gray",
    radius: "small",
    fontFamily: { sans: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif' },
  },
  /** Carbon style (IBM): square corners, flat surfaces, IBM Plex. */
  carbon: {
    name: "carbon",
    primary: carbonBlue,
    neutral: "gray",
    radius: "0px",
    fontFamily: {
      sans: '"IBM Plex Sans", system-ui, sans-serif',
      mono: '"IBM Plex Mono", ui-monospace, monospace',
    },
    vars: flatShadows,
  },
  /** Polaris style (Shopify): ink primary, green accents, compact admin density. */
  polaris: {
    name: "polaris",
    neutral: "gray",
    radius: "medium",
    density: "compact",
    fontFamily: { sans: 'Inter, -apple-system, "Segoe UI", system-ui, sans-serif' },
    colors: {
      light: { ...inkPrimary.light, success: polarisGreen[600], surface: g[50] },
      dark: inkPrimary.dark,
    },
  },
  /** Apple HIG style: system blue, generous rounding and spacing, SF system font. */
  apple: {
    name: "apple",
    primary: appleBlue,
    neutral: "gray",
    radius: "large",
    density: "spacious",
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", Menlo, monospace',
    },
  },
  /** Base Web style (Uber): black primary, tight corners, bold utilitarian look. */
  baseweb: {
    name: "baseweb",
    neutral: "gray",
    radius: "small",
    fontFamily: { sans: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif' },
    colors: inkPrimary,
    vars: flatShadows,
  },
  /** Stripe style: blurple primary, navy-slate text, soft layered shadows. */
  stripe: {
    name: "stripe",
    primary: stripeBlurple,
    neutral: stripeSlate,
    radius: "medium",
    fontFamily: { sans: 'Inter, -apple-system, "Segoe UI", system-ui, sans-serif' },
    vars: {
      "shadow-md":
        "0 6px 12px -2px oklch(0.25 0.06 255 / 0.12), 0 3px 7px -3px oklch(0 0 0 / 0.15)",
      "shadow-lg":
        "0 13px 27px -5px oklch(0.25 0.06 255 / 0.2), 0 8px 16px -8px oklch(0 0 0 / 0.25)",
    },
  },
} as const satisfies Record<string, ThemeConfig>;

export type PresetName = keyof typeof presetConfigs;
export const PRESET_NAMES = Object.keys(presetConfigs) as PresetName[];

export const presets = Object.fromEntries(
  PRESET_NAMES.map((name) => [name, createTheme(presetConfigs[name] as ThemeConfig)]),
) as Record<PresetName, ReturnType<typeof createTheme>>;
