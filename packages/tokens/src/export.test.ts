import { describe, expect, it } from "vitest";
import {
  buildDtcgDocument,
  generateScss,
  palette,
  SCALE_STEPS,
  SEMANTIC_COLORS,
  type DtcgDocument,
} from "./index.js";

type Token = { $type?: string; $value?: unknown; $extensions?: Record<string, unknown> };

const asDoc = (doc: DtcgDocument) => doc as Record<string, Record<string, Record<string, Token>>>;

describe("DTCG export", () => {
  const doc = buildDtcgDocument();

  it("is valid JSON and carries a schema", () => {
    expect(() => JSON.parse(JSON.stringify(doc))).not.toThrow();
    expect(doc.$schema).toContain("design-tokens");
  });

  it("emits every palette color at every step as a color token", () => {
    const pal = asDoc(doc).color.palette;
    for (const name of Object.keys(palette)) {
      for (const step of SCALE_STEPS) {
        const token = pal[name]?.[String(step)];
        expect(token?.$type).toBe("color");
        expect(typeof token?.$value).toBe("string");
      }
    }
  });

  it("emits every semantic role with dark + high-contrast modes", () => {
    const sem = asDoc(doc).color.semantic;
    for (const role of SEMANTIC_COLORS) {
      const token = sem[role];
      expect(token?.$type).toBe("color");
      const modes = token?.$extensions?.["com.ux-sting"] as Record<string, string> | undefined;
      expect(typeof modes?.dark).toBe("string");
      expect(typeof modes?.["high-contrast"]).toBe("string");
    }
  });

  it("uses resolved values only (no var()/calc() leakage)", () => {
    const flat = JSON.stringify(doc);
    expect(flat).not.toContain("var(--ui");
    expect(flat).not.toContain("calc(");
  });

  it("includes dimension, typography and motion groups", () => {
    expect(asDoc(doc).dimension.spacing["4"]?.$value).toBe("1rem");
    expect(asDoc(doc).typography.fontFamily.sans?.$type).toBe("fontFamily");
    expect(asDoc(doc).motion.duration.normal?.$value).toBe("200ms");
  });
});

describe("SCSS export", () => {
  const scss = generateScss();

  it("declares semantic colors and static scales as $variables", () => {
    expect(scss).toContain("$ui-primary:");
    expect(scss).toContain("$ui-background:");
    expect(scss).toContain("$ui-space-4: 1rem;");
  });

  it("mirrors the CSS custom-property names", () => {
    expect(scss).toContain("$ui-font-sans:");
    expect(scss).toContain("$ui-shadow-md:");
  });
});
