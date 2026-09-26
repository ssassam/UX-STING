import { describe, expect, it } from "vitest";
import {
  CONTRAST_PAIRS,
  NON_TEXT_CONTRAST_PAIRS,
  contrastRatio,
  createDarkColors,
  createHighContrastColors,
  createLightColors,
  generateTailwindCss,
  generateTokensCss,
  oklchToHex,
  SEMANTIC_COLORS,
} from "./index.js";

const modes = {
  light: createLightColors(),
  dark: createDarkColors(),
  "high-contrast": createHighContrastColors(),
};

describe("contrast", () => {
  it("computes known ratios", () => {
    expect(contrastRatio("oklch(1 0 0)", "oklch(0 0 0)")).toBeCloseTo(21, 0);
    expect(oklchToHex("oklch(1 0 0)")).toBe("#ffffff");
  });

  for (const [mode, colors] of Object.entries(modes)) {
    describe(mode, () => {
      it.each(CONTRAST_PAIRS)("%s / %s meets WCAG AA (4.5:1)", (bg, fg) => {
        expect(contrastRatio(colors[bg], colors[fg])).toBeGreaterThanOrEqual(4.5);
      });
      it.each(NON_TEXT_CONTRAST_PAIRS)("%s / %s meets non-text contrast (3:1)", (bg, fg) => {
        expect(contrastRatio(colors[bg], colors[fg])).toBeGreaterThanOrEqual(3);
      });
    });
  }

  it("high contrast mode meets AAA (7:1) for body text", () => {
    const hc = modes["high-contrast"];
    expect(contrastRatio(hc.background, hc.foreground)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(hc.background, hc["muted-foreground"])).toBeGreaterThanOrEqual(7);
  });
});

describe("css generation", () => {
  it("emits every semantic color for every mode", () => {
    const css = generateTokensCss();
    for (const name of SEMANTIC_COLORS) expect(css).toContain(`--ui-${name}:`);
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-density="compact"]');
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain(":root, [data-ui-theme], [data-ui-scope] {\n  --ui-radius-none");
  });

  it("maps tokens into a Tailwind v4 theme", () => {
    const css = generateTailwindCss();
    expect(css).toContain("@theme inline");
    expect(css).toContain("--color-primary: var(--ui-primary);");
    expect(css).toContain("--spacing-control-md: var(--ui-height-md);");
  });
});
