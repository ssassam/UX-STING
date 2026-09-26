import {
  colorVars,
  createDarkColors,
  createHighContrastColors,
  createLightColors,
  cssVarName,
  defaultIntentScales,
  densityVars,
  palette,
  radiusBase,
  toCssBlock,
  type ColorScale,
  type CssVars,
  type Density,
  type IntentScales,
  type PaletteName,
  type RadiusPreset,
  type SemanticColors,
} from "@unified-ui/tokens";

export interface ThemeConfig {
  /** Unique theme name; used as `data-ui-theme="<name>"`. */
  name: string;
  /** Palette name or custom 11-step scale for the primary intent. */
  primary?: PaletteName | ColorScale;
  /** Palette name or custom scale for neutrals (text, borders, surfaces). */
  neutral?: PaletteName | ColorScale;
  /** Radius preset or any CSS length used as the base radius. */
  radius?: RadiusPreset | (string & {});
  density?: Density;
  fontFamily?: { sans?: string; serif?: string; mono?: string };
  /** Fine-grained semantic color overrides per mode. */
  colors?: {
    light?: Partial<SemanticColors>;
    dark?: Partial<SemanticColors>;
    highContrast?: Partial<SemanticColors>;
  };
}

export interface ResolvedTheme {
  name: string;
  light: SemanticColors;
  dark: SemanticColors;
  highContrast: SemanticColors;
  /** Mode-independent variables (radius, fonts, density). */
  vars: CssVars;
}

const scale = (value: PaletteName | ColorScale | undefined, fallback: ColorScale): ColorScale =>
  value === undefined ? fallback : typeof value === "string" ? palette[value] : value;

/** Resolves a theme config into concrete color sets and variables. */
export function createTheme(config: ThemeConfig): ResolvedTheme {
  const scales: IntentScales = {
    ...defaultIntentScales,
    primary: scale(config.primary, defaultIntentScales.primary),
    neutral: scale(config.neutral, defaultIntentScales.neutral),
  };

  const vars: CssVars = {};
  if (config.radius) {
    vars[cssVarName("radius")] =
      config.radius in radiusBase ? radiusBase[config.radius as RadiusPreset] : config.radius;
  }
  for (const [key, value] of Object.entries(config.fontFamily ?? {})) {
    if (value) vars[cssVarName(`font-${key}`)] = value;
  }
  if (config.density) Object.assign(vars, densityVars(config.density));

  return {
    name: config.name,
    light: { ...createLightColors(scales), ...config.colors?.light },
    dark: { ...createDarkColors(scales), ...config.colors?.dark },
    highContrast: { ...createHighContrastColors(scales), ...config.colors?.highContrast },
    vars,
  };
}

/** CSS variables for a theme in a given mode (for inline `style` usage). */
export function themeToVars(theme: ResolvedTheme, mode: "light" | "dark" | "high-contrast" = "light"): CssVars {
  const colors = mode === "dark" ? theme.dark : mode === "high-contrast" ? theme.highContrast : theme.light;
  return { ...theme.vars, ...colorVars(colors) };
}

/**
 * Serialises a theme to CSS scoped by `data-ui-theme`. Dark and
 * high-contrast selectors carry higher specificity than the light block so
 * `data-theme` always wins regardless of stylesheet order.
 */
export function themeToCss(theme: ResolvedTheme): string {
  const t = `[data-ui-theme="${theme.name}"]`;
  const dark = [`${t}[data-theme="dark"]`, `${t} [data-theme="dark"]`, `${t}.dark`, `${t} .dark`].join(", ");
  const hc = [`${t}[data-theme="high-contrast"]`, `${t} [data-theme="high-contrast"]`].join(", ");
  const system = [`${t}[data-theme="system"]`, `${t} [data-theme="system"]`].join(", ");
  return [
    toCssBlock(t, { ...theme.vars, ...colorVars(theme.light) }),
    toCssBlock(dark, { "color-scheme": "dark", ...colorVars(theme.dark) }),
    toCssBlock(hc, colorVars(theme.highContrast)),
    `@media (prefers-color-scheme: dark) {\n${toCssBlock(system, { "color-scheme": "dark", ...colorVars(theme.dark) }, "  ")}\n}`,
  ].join("\n\n");
}
