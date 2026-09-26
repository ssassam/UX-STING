import { CONTRAST_PAIRS, contrastRatio } from "@ux-sting/tokens";
import { describe, expect, it } from "vitest";
import { createTheme, PRESET_NAMES, presets, themeToCss, themeToVars } from "./index.js";

describe("theme presets", () => {
  for (const name of PRESET_NAMES) {
    for (const mode of ["light", "dark"] as const) {
      it(`${name}/${mode} keeps AA text contrast`, () => {
        const colors = presets[name][mode];
        for (const [bg, fg] of CONTRAST_PAIRS) {
          expect(contrastRatio(colors[bg], colors[fg]), `${bg}/${fg}`).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }
});

describe("createTheme", () => {
  it("resolves radius, density and fonts", () => {
    const theme = createTheme({
      name: "brand",
      primary: "pink",
      radius: "1rem",
      density: "compact",
      fontFamily: { sans: "Inter" },
    });
    const vars = themeToVars(theme);
    expect(vars["--ui-radius"]).toBe("1rem");
    expect(vars["--ui-height-md"]).toBe("2rem");
    expect(vars["--ui-font-sans"]).toBe("Inter");
    expect(themeToCss(theme)).toContain('[data-ui-theme="brand"][data-theme="dark"]');
  });
});
