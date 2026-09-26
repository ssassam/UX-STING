import { palette, white } from "@unified-ui/tokens";
import { createTheme, type ThemeConfig } from "./theme.js";

const g = palette.gray;

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
} as const satisfies Record<string, ThemeConfig>;

export type PresetName = keyof typeof presetConfigs;
export const PRESET_NAMES = Object.keys(presetConfigs) as PresetName[];

export const presets = Object.fromEntries(
  PRESET_NAMES.map((name) => [name, createTheme(presetConfigs[name] as ThemeConfig)]),
) as Record<PresetName, ReturnType<typeof createTheme>>;
