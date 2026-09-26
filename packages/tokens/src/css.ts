import { palette, SCALE_STEPS } from "./palette.js";
import {
  borderWidth,
  breakpoints,
  containers,
  density,
  duration,
  durationExit,
  easing,
  fontFamily,
  iconSize,
  iconStroke,
  targetSize,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  radiusBase,
  shadow,
  spacing,
  zIndex,
  type Density,
} from "./scales.js";
import {
  createDarkColors,
  createHighContrastColors,
  createLightColors,
  SEMANTIC_COLORS,
  type SemanticColors,
} from "./semantic.js";

/** CSS custom property prefix. Change here to rebrand every variable. */
export const PREFIX = "ui";

export type CssVars = Record<string, string>;

export const cssVarName = (name: string) => `--${PREFIX}-${name}`;
export const cssVar = (name: string, fallback?: string) =>
  fallback ? `var(${cssVarName(name)}, ${fallback})` : `var(${cssVarName(name)})`;

export function colorVars(colors: Partial<SemanticColors>): CssVars {
  const vars: CssVars = {};
  for (const [key, value] of Object.entries(colors)) {
    if (value) vars[cssVarName(key)] = value;
  }
  return vars;
}

export function densityVars(mode: Density): CssVars {
  const vars: CssVars = {};
  for (const [key, value] of Object.entries(density[mode])) vars[cssVarName(key)] = value;
  return vars;
}

function prefixed(group: string, values: Record<string, string>): CssVars {
  const vars: CssVars = {};
  for (const [key, value] of Object.entries(values)) {
    vars[cssVarName(`${group}-${key.replace(".", "_")}`)] = value;
  }
  return vars;
}

/** Tokens that do not change between color modes. */
export function staticVars(): CssVars {
  const vars: CssVars = {
    [cssVarName("radius")]: radiusBase.medium,
    ...prefixed("space", spacing),
    ...prefixed("font", fontFamily),
    ...prefixed("weight", fontWeight),
    ...prefixed("leading", lineHeight),
    ...prefixed("tracking", letterSpacing),
    ...prefixed("shadow", shadow),
    ...prefixed("border", borderWidth),
    ...prefixed("z", zIndex),
    ...prefixed("duration", duration),
    ...prefixed("duration-exit", durationExit),
    ...prefixed("icon", iconSize),
    [cssVarName("icon-stroke")]: iconStroke,
    ...prefixed("target", targetSize),
    ...prefixed("ease", easing),
    ...prefixed("breakpoint", breakpoints),
    ...prefixed("container", containers),
  };
  for (const [key, [size, leading]] of Object.entries(fontSize)) {
    vars[cssVarName(`text-${key}`)] = size;
    vars[cssVarName(`text-${key}-leading`)] = leading;
  }
  for (const [name, scale] of Object.entries(palette)) {
    for (const step of SCALE_STEPS) vars[cssVarName(`${name}-${step}`)] = scale[step];
  }
  return vars;
}

export function toCssBlock(selector: string, vars: CssVars, indent = ""): string {
  const body = Object.entries(vars)
    .map(([k, v]) => `${indent}  ${k}: ${v};`)
    .join("\n");
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

const DARK_SELECTOR = '[data-theme="dark"], .dark';

/**
 * Derived tokens (e.g. `--ui-radius-lg: var(--ui-radius)`) are resolved on the
 * element that declares them, so they are re-declared on every element that
 * can change their inputs: the root, themed scopes and explicit scopes.
 */
export const SCOPE_SELECTOR = ':root, [data-ui-theme], [data-ui-scope]';

export function derivedVars(): CssVars {
  return prefixed("radius", radius);
}
const HC_SELECTOR = '[data-theme="high-contrast"]';

/** Generates the complete `tokens.css` stylesheet. */
export function generateTokensCss(): string {
  const light = createLightColors();
  const dark = createDarkColors();
  const hc = createHighContrastColors();

  return [
    "/* unified-ui design tokens — generated file, do not edit by hand. */",
    toCssBlock(":root, [data-theme=\"light\"]", {
      "color-scheme": "light",
      ...staticVars(),
      ...colorVars(light),
      ...densityVars("comfortable"),
    }),
    toCssBlock(SCOPE_SELECTOR, derivedVars()),
    toCssBlock(DARK_SELECTOR, { "color-scheme": "dark", ...colorVars(dark) }),
    toCssBlock(HC_SELECTOR, { "color-scheme": "light", ...colorVars(hc) }),
    `@media (prefers-color-scheme: dark) {\n${toCssBlock('[data-theme="system"]', { "color-scheme": "dark", ...colorVars(dark) }, "  ")}\n}`,
    `@media (prefers-contrast: more) {\n${toCssBlock('[data-theme="system"]', colorVars(hc), "  ")}\n}`,
    toCssBlock('[data-density="compact"]', densityVars("compact")),
    toCssBlock('[data-density="comfortable"]', densityVars("comfortable")),
    toCssBlock('[data-density="spacious"]', densityVars("spacious")),
    `@media (prefers-reduced-motion: reduce) {\n${toCssBlock(":root", { ...prefixed("duration", { fast: "0ms", normal: "0ms", slow: "0ms", slower: "0ms" }), ...prefixed("duration-exit", { fast: "0ms", normal: "0ms", slow: "0ms", slower: "0ms" }) }, "  ")}\n}`,
    "",
  ].join("\n\n");
}

/**
 * Generates a Tailwind CSS v4 theme mapping semantic tokens to utilities,
 * e.g. `bg-primary`, `text-muted-foreground`, `rounded-lg`, `h-control-md`.
 */
export function generateTailwindCss(): string {
  const lines: string[] = [];
  for (const name of SEMANTIC_COLORS) lines.push(`  --color-${name}: var(${cssVarName(name)});`);
  for (const key of Object.keys(radius)) lines.push(`  --radius-${key}: var(${cssVarName(`radius-${key}`)});`);
  for (const key of Object.keys(shadow)) lines.push(`  --shadow-${key}: var(${cssVarName(`shadow-${key}`)});`);
  for (const key of Object.keys(fontFamily)) lines.push(`  --font-${key}: var(${cssVarName(`font-${key}`)});`);
  for (const key of Object.keys(fontSize)) {
    lines.push(`  --text-${key}: var(${cssVarName(`text-${key}`)});`);
    lines.push(`  --text-${key}--line-height: var(${cssVarName(`text-${key}-leading`)});`);
  }
  for (const key of Object.keys(easing)) lines.push(`  --ease-${key}: var(${cssVarName(`ease-${key}`)});`);
  for (const key of ["xs", "sm", "md", "lg", "xl"]) {
    lines.push(`  --spacing-control-${key}: var(${cssVarName(`height-${key}`)});`);
  }
  for (const key of Object.keys(density.comfortable)) {
    if (key.startsWith("height-")) continue;
    lines.push(`  --spacing-${key}: var(${cssVarName(key)});`);
  }
  for (const key of Object.keys(iconSize)) lines.push(`  --spacing-icon-${key}: var(${cssVarName(`icon-${key}`)});`);
  lines.push(`  --spacing-target-min: var(${cssVarName("target-min")});`);
  lines.push(`  --spacing-target-touch: var(${cssVarName("target-touch")});`);
  for (const [key, value] of Object.entries(zIndex)) lines.push(`  --z-index-${key}: ${value};`);

  return [
    "/* unified-ui Tailwind CSS v4 theme — generated file, do not edit by hand. */",
    '@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *, .dark, .dark *));',
    "",
    "@theme inline {",
    ...lines,
    "}",
    "",
  ].join("\n");
}
