import { mix } from "./color.js";
import type { DesignDNA } from "./types.js";

const FALLBACK: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Arabic", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", "Noto Serif", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  display: "ui-sans-serif, system-ui, sans-serif",
};

/** Appends a generic fallback stack when the family list does not end with one. */
export function fontStack(family: string, classification: keyof typeof FALLBACK): string {
  return /(sans-serif|serif|monospace|system-ui)\s*$/i.test(family.trim())
    ? family
    : `${family}, ${FALLBACK[classification]}`;
}

/**
 * CSS custom properties for a DNA: generic `--dna-*` variables used by the
 * generator, plus the matching UX-STING `--ui-*` semantic tokens so the
 * same DNA themes UX-STING components.
 */
export function dnaToCssVariables(dna: DesignDNA): Record<string, string> {
  const { color: c, typography: t, layout: l, shape: s } = dna;
  const px = (n: number) => `${n}px`;
  return {
    "--dna-bg": c.background,
    "--dna-surface": c.surface,
    "--dna-fg": c.foreground,
    "--dna-heading": c.heading ?? c.foreground,
    "--dna-muted": c.muted,
    "--dna-border": c.border,
    "--dna-accent": c.accent,
    "--dna-accent-fg": c.accentForeground,
    "--dna-inverse": c.inverse ?? c.foreground,
    "--dna-inverse-fg": c.background,
    "--dna-font-display": fontStack(t.display.family, t.display.classification),
    "--dna-font-body": fontStack(t.body.family, t.body.classification),
    "--dna-font-mono": fontStack(t.mono?.family ?? "ui-monospace", "mono"),
    "--dna-weight-display": String(t.display.weight),
    "--dna-weight-body": String(t.body.weight),
    "--dna-size-small": px(t.scale.steps.small),
    "--dna-size-body": px(t.scale.steps.body),
    "--dna-size-h3": px(t.scale.steps.h3),
    "--dna-size-h2": px(t.scale.steps.h2),
    "--dna-size-h1": px(t.scale.steps.h1),
    "--dna-size-display": px(t.scale.steps.display),
    "--dna-size-display-mobile": px(
      t.scale.mobileDisplay ?? Math.round(t.scale.steps.display * 0.55),
    ),
    "--dna-tracking-heading": `${t.headingTracking}em`,
    "--dna-leading-heading": String(t.headingLeading),
    "--dna-leading-body": String(t.bodyLeading),
    "--dna-measure": `${t.measure}ch`,
    "--dna-container": px(l.container),
    "--dna-page-padding": px(l.pagePadding),
    "--dna-gutter": px(l.gutter),
    "--dna-section-gap": px(l.sectionGap),
    "--dna-unit": px(l.spacingUnit),
    "--dna-radius": px(s.radius),
    "--dna-radius-control": px(s.controlRadius),
    "--dna-border-width": px(s.borderWidth),
    "--dna-duration": `${dna.motion.durationMs}ms`,
    // UX-STING semantic tokens
    "--ui-background": c.background,
    "--ui-foreground": c.foreground,
    "--ui-card": c.background,
    "--ui-card-foreground": c.foreground,
    "--ui-surface": c.surface,
    "--ui-muted": c.surface,
    "--ui-muted-foreground": c.muted,
    "--ui-border": c.border,
    "--ui-border-strong": mix(c.border, c.foreground, 0.35),
    "--ui-input": c.border,
    "--ui-primary": c.accent,
    "--ui-primary-hover": mix(c.accent, c.foreground, 0.15),
    "--ui-primary-foreground": c.accentForeground,
    "--ui-ring": c.accent,
    "--ui-radius": px(s.radius),
    "--ui-font-sans": fontStack(t.body.family, t.body.classification),
    "--ui-font-serif": fontStack(t.display.family, t.display.classification),
  };
}

export function dnaToCss(dna: DesignDNA, selector = ":root"): string {
  const vars = Object.entries(dnaToCssVariables(dna))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${vars}\n}`;
}

/** Design tokens in the W3C Design Tokens Community Group format. */
export function dnaToDtcg(dna: DesignDNA) {
  const color = (value: string) => ({ $type: "color", $value: value });
  const dim = (n: number) => ({ $type: "dimension", $value: `${n}px` });
  const { color: c, typography: t, layout: l, shape: s } = dna;
  return {
    $description: `Design DNA "${dna.name}" (${dna.mode})`,
    color: {
      background: color(c.background),
      surface: color(c.surface),
      foreground: color(c.foreground),
      muted: color(c.muted),
      border: color(c.border),
      accent: color(c.accent),
      "accent-foreground": color(c.accentForeground),
    },
    font: {
      display: { $type: "fontFamily", $value: t.display.family },
      body: { $type: "fontFamily", $value: t.body.family },
    },
    size: Object.fromEntries(Object.entries(t.scale.steps).map(([k, v]) => [k, dim(v)])),
    space: {
      page: dim(l.pagePadding),
      unit: dim(l.spacingUnit),
      gutter: dim(l.gutter),
      section: dim(l.sectionGap),
      container: dim(l.container),
    },
    radius: { default: dim(s.radius), control: dim(s.controlRadius) },
  };
}

/**
 * A UX-STING theme config (`createTheme()` input from `@ux-sting/themes`)
 * for the DNA's light colors, radius and fonts.
 */
export function dnaToUxStingTheme(
  dna: DesignDNA,
  name = dna.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
) {
  const { color: c, typography: t, shape: s } = dna;
  return {
    name,
    radius: `${s.radius}px`,
    fontFamily: {
      sans: fontStack(t.body.family, t.body.classification),
      serif: fontStack(t.display.family, t.display.classification),
    },
    colors: {
      light: {
        background: c.background,
        foreground: c.foreground,
        card: c.background,
        surface: c.surface,
        "muted-foreground": c.muted,
        border: c.border,
        primary: c.accent,
        "primary-foreground": c.accentForeground,
        ring: c.accent,
      },
    },
  };
}
