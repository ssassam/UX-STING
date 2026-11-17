import { describe, expect, it } from "vitest";
import { presets } from "./presets.js";
import { themeToDesignMd, importDesignMd } from "./design-md.js";
describe("DESIGN.md", () => {
  for (const [name, theme] of Object.entries(presets))
    it(`round trips ${name}`, () => {
      expect(importDesignMd(themeToDesignMd(theme))).toEqual({ theme, warnings: [] });
    });
  it("imports external frontmatter and reports defaults", () => {
    const result = importDesignMd(
      '---\nname: Example\ncolors:\n  primary: "#123456"\n---\n## Rationale',
    );
    expect(result.theme.light.primary).toBe("#123456");
    expect(result.warnings).toHaveLength(2);
  });
  it("rejects invalid and incomplete input", () => {
    expect(() => importDesignMd("# Plain prose")).toThrow("frontmatter");
    expect(() => importDesignMd("---\nname: X\nuxSting:\n  version: 1\n---\n")).toThrow(
      "Incomplete",
    );
  });
});
