import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createTheme } from "@ux-sting/themes";
import { contrastRatio } from "@ux-sting/tokens";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contrast, deltaE, parseColor, rgbToOklch, toHex, toOklchString } from "./color.js";
import { mediaWidths, type RawExtraction } from "./collect.js";
import { themeCommand } from "./command.js";
import { dnaFromDtcg, nearestPresets, presetVector, vectorDistance } from "./dna.js";
import { flattenDtcg, toMs, toPx } from "./dtcg.js";
import { dtcgToTheme } from "./theme.js";
import { cubicBezier, EXT, extractionToDtcg, parseShadow, spacingUnit } from "./tokens.js";

/** Shaped like designlang output (primitive + semantic layers with aliases); values are made up. */
const layered = {
  primitive: {
    color: {
      brand: { primary: { $type: "color", $value: "#0f7b6c" } },
      neutral: {
        n100: { $type: "color", $value: "#1c1c1c" },
        n200: { $type: "color", $value: "#a0a0a0" },
        n400: { $type: "color", $value: "#fbfaf7" },
      },
    },
    radius: {
      r1: { $type: "dimension", $value: "6px" },
      r2: { $type: "dimension", $value: "999px" },
    },
    fontFamily: {
      f0: { $type: "fontFamily", $value: "Söhne" },
      f1: { $type: "fontFamily", $value: ["Tiempos Headline", "serif"] },
    },
  },
  semantic: {
    color: {
      action: { primary: { $type: "color", $value: "{primitive.color.brand.primary}" } },
      surface: { default: { $type: "color", $value: "{primitive.color.neutral.n400}" } },
      text: {
        body: { $type: "color", $value: "{primitive.color.neutral.n100}" },
        muted: { $type: "color", $value: "{primitive.color.neutral.n200}" },
      },
    },
    radius: { control: { $type: "dimension", $value: "{primitive.radius.r1}" } },
    font: { heading: { $type: "fontFamily", $value: "{primitive.fontFamily.f1}" } },
  },
};

const raw = (over: Partial<RawExtraction> = {}): RawExtraction => ({
  url: "https://example.com/",
  title: "Example",
  viewport: { width: 1440, height: 900 },
  capturedAt: "2026-01-01T00:00:00.000Z",
  pageBackground: "#ffffff",
  backgrounds: [
    { color: "#ffffff", area: 900000 },
    { color: "#f4f4f5", area: 300000 },
  ],
  textColors: [
    { color: "#18181b", chars: 4000 },
    { color: "#71717a", chars: 900 },
  ],
  borderColors: [{ color: "#e4e4e7", count: 40 }],
  interactive: [
    { color: "#e11d48", on: "#ffffff", kind: "fill", count: 12 },
    { color: "#18181b", on: "#ffffff", kind: "text", count: 30 },
  ],
  fonts: [{ stack: '"Inter", sans-serif', chars: 4000, heading: 200 }],
  fontSizes: [
    { px: 14, chars: 500, role: "small" },
    { px: 16, chars: 3000, role: "body" },
    { px: 48, chars: 40, role: "heading" },
  ],
  headings: {
    h1: {
      family: '"Fraunces", serif',
      sizePx: 48,
      weight: 600,
      lineHeight: 1.1,
      letterSpacingEm: -0.02,
      color: "#18181b",
    },
  },
  body: {
    family: '"Inter", sans-serif',
    sizePx: 16,
    weight: 400,
    lineHeight: 1.5,
    letterSpacingEm: 0,
    color: "#18181b",
  },
  spacing: [
    { px: 8, count: 50 },
    { px: 16, count: 40 },
    { px: 24, count: 30 },
    { px: 4, count: 5 },
  ],
  radii: [
    { px: 8, count: 20 },
    { px: 9999, count: 4 },
  ],
  shadows: [{ value: "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px", count: 6 }],
  motion: {
    transitions: [{ durationMs: 150, easing: "ease-out", count: 30 }],
    animations: [],
    live: 0,
  },
  breakpoints: { minWidth: [640, 1024], maxWidth: [], unreadableSheets: 0 },
  container: 1200,
  ...over,
});

afterEach(() => vi.restoreAllMocks());

describe("color", () => {
  it("parses CSS syntaxes and DTCG objects to the same color", () => {
    const hex = "#0f7b6c";
    expect(toHex(parseColor(hex)!)).toBe(hex);
    expect(toHex(parseColor("rgb(15 123 108)")!)).toBe(hex);
    expect(
      toHex(parseColor({ colorSpace: "srgb", components: [15 / 255, 123 / 255, 108 / 255] })!),
    ).toBe(hex);
    expect(deltaE(parseColor(toOklchString(hex)!)!, parseColor(hex)!)).toBeLessThan(0.5);
    expect(toHex(parseColor("hsl(0 100% 50%)")!)).toBe("#ff0000");
    expect(parseColor("var(--x)")).toBeNull();
  });
  it("matches known OKLCH values", () => {
    const white = rgbToOklch(parseColor("#ffffff")!);
    expect(white.l).toBeCloseTo(1, 3);
    expect(white.c).toBeLessThan(1e-3);
    expect(contrast(parseColor("#000")!, parseColor("#fff")!)).toBeCloseTo(21, 1);
  });
});

describe("flattenDtcg", () => {
  it("resolves aliases, inherits group $type and reads legacy value/type", () => {
    const tokens = flattenDtcg({
      ...layered,
      sd: { size: { value: "12px", type: "dimension" } },
      grouped: { $type: "color", a: { $value: "#000" }, cyc: { $value: "{grouped.cyc}" } },
    });
    const byPath = Object.fromEntries(tokens.map((t) => [t.path, t]));
    expect(byPath["semantic.color.action.primary"]).toMatchObject({
      type: "color",
      value: "#0f7b6c",
    });
    expect(byPath["sd.size"]).toMatchObject({ type: "dimension", value: "12px" });
    expect(byPath["grouped.a"]?.type).toBe("color");
    expect(byPath["grouped.cyc"]?.value).toBeUndefined();
  });
  it("converts dimensions and durations in both value styles", () => {
    expect(toPx("1.5rem")).toBe(24);
    expect(toPx({ value: 2, unit: "rem" })).toBe(32);
    expect(toMs("0.2s")).toBe(200);
    expect(toMs({ value: 150, unit: "ms" })).toBe(150);
  });
});

describe("extractionToDtcg", () => {
  it("emits semantic roles with provenance and DTCG 2025.10 values", () => {
    const doc = extractionToDtcg(raw());
    const color = doc.color as Record<
      string,
      { $value: { hex: string }; $extensions?: Record<string, { source: string }> }
    >;
    expect(color.background!.$value.hex).toBe("#ffffff");
    expect(color.foreground!.$value.hex).toBe("#18181b");
    expect(color["muted-foreground"]!.$value.hex).toBe("#71717a");
    expect(color.primary!.$value.hex).toBe("#e11d48");
    expect(color.primary!.$extensions![EXT]!.source).toBe("inferred");
    expect(color["primary-foreground"]!.$value.hex).toBe("#ffffff");
    expect(color.surface!.$value.hex).toBe("#f4f4f5");
    expect((doc.spacing as Record<string, { $value: unknown }>).unit!.$value).toEqual({
      value: 8,
      unit: "px",
    });
    expect((doc.duration as Record<string, { $value: unknown }>).default!.$value).toEqual({
      value: 150,
      unit: "ms",
    });
    expect((doc.easing as Record<string, { $value: unknown }>).default!.$value).toEqual([
      0, 0, 0.58, 1,
    ]);
    expect(Object.keys(doc.breakpoint as object)).toEqual(["640", "1024"]);
  });
  it("leaves out what it did not measure and lists it, instead of guessing", () => {
    const doc = extractionToDtcg(
      raw({
        interactive: [],
        shadows: [],
        motion: { transitions: [], animations: [], live: 0 },
        breakpoints: { minWidth: [], maxWidth: [], unreadableSheets: 3 },
        container: null,
      }),
    );
    const meta = (doc.$extensions as Record<string, { missing: string[] }>)[EXT]!;
    expect(meta.missing).toEqual(
      expect.arrayContaining([
        "color.primary",
        "shadow",
        "duration",
        "easing",
        "breakpoint",
        "spacing.container",
      ]),
    );
    expect((doc.color as Record<string, unknown>).primary).toBeUndefined();
    expect(doc.shadow).toBeUndefined();
    const v = dnaFromDtcg(doc);
    expect(v.primaryHue).toBeNull();
    expect(v.motionMs).toBeNull();
    expect(v.shadows).toBe(0);
  });
  it("parses shadows, easings, spacing units and media queries", () => {
    expect(parseShadow("0 1px 2px rgba(0,0,0,.2), inset 0 0 0 1px #000")).toHaveLength(2);
    expect(parseShadow("rgba(0, 0, 0, 0.1) 0px 4px 12px 0px")[0]).toMatchObject({
      offsetY: { value: 4, unit: "px" },
      blur: { value: 12, unit: "px" },
    });
    expect(cubicBezier("cubic-bezier(0.2, 0, 0, 1)")).toEqual([0.2, 0, 0, 1]);
    expect(cubicBezier("steps(4)")).toBeNull();
    expect(
      spacingUnit([
        { px: 12, count: 5 },
        { px: 6, count: 5 },
      ]),
    ).toBe(2);
    expect(spacingUnit([])).toBeNull();
    expect(
      mediaWidths(
        "@media (min-width: 40em){a{}} @media (width < 768px){b{}} @media screen and (max-width:1023px){c{}}",
      ),
    ).toEqual({
      minWidth: [640],
      maxWidth: [768, 1023],
    });
  });
});

describe("dtcgToTheme", () => {
  it("maps a layered external file to UX-STING semantic tokens in OKLCH", () => {
    const { config, mapping, missing, scheme } = dtcgToTheme(layered, { name: "Acme Brand" });
    expect(config.name).toBe("acme-brand");
    expect(scheme).toBe("light");
    const light = config.colors!.light!;
    expect(light.primary).toMatch(/^oklch\(/);
    expect(mapping.find((m) => m.role === "primary")?.path).toBe("semantic.color.action.primary");
    expect(mapping.find((m) => m.role === "background")?.path).toBe(
      "semantic.color.surface.default",
    );
    expect(config.radius).toBe("6px");
    expect(config.fontFamily?.sans).toContain("Söhne");
    expect(config.fontFamily?.serif).toContain('"Tiempos Headline"');
    expect(missing).toEqual(expect.arrayContaining(["border"]));
    // The result is a valid theme for every mode.
    const theme = createTheme(config);
    expect(theme.dark.background).toMatch(/^oklch\(/);
  });

  it("enforces AA on every imported pair and reports each change", () => {
    const doc = {
      color: {
        background: { $type: "color", $value: "#ffffff" },
        foreground: { $type: "color", $value: "#9a9a9a" },
        primary: { $type: "color", $value: "#ffd400" },
      },
    };
    const { config, adjustments } = dtcgToTheme(doc);
    const c = config.colors!.light!;
    expect(contrastRatio(c.background!, c.foreground!)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.primary!, c["primary-foreground"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.background!, c.primary!)).toBeGreaterThanOrEqual(3);
    expect(adjustments.map((a) => a.changed)).toEqual(
      expect.arrayContaining(["foreground", "primary"]),
    );
  });

  it("imports dark sources into the dark mode and infers roles from a bare palette", () => {
    const { scheme, config, mapping } = dtcgToTheme({
      palette: {
        $type: "color",
        night: { $value: "#0b0d12" },
        snow: { $value: "#f2f4f8" },
        violet: { $value: "#7c5cff" },
      },
    });
    expect(scheme).toBe("light"); // lightest neutral wins as background for a bare palette
    expect(mapping.find((m) => m.role === "primary")?.path).toMatch(/\(fallback\)$/);
    expect(config.colors!.light!.primary).toBeDefined();
    const dark = dtcgToTheme({
      color: {
        background: { $type: "color", $value: "#0b0d12" },
        foreground: { $type: "color", $value: "#f2f4f8" },
      },
    });
    expect(dark.scheme).toBe("dark");
    expect(dark.config.colors!.dark!.background).toBeDefined();
  });
});

describe("dna", () => {
  it("each preset is its own nearest match", () => {
    const v = presetVector("editorial");
    expect(vectorDistance(v, v).distance).toBe(0);
    expect(nearestPresets(v)[0]!.preset).toBe("editorial");
  });
  it("compares only measured dimensions", () => {
    const v = dnaFromDtcg(extractionToDtcg(raw()));
    expect(v).toMatchObject({
      scheme: "light",
      serifHeadings: 1,
      bodyPx: 16,
      headingRatio: 3,
      spacingUnit: 8,
      motionMs: 150,
    });
    const match = nearestPresets(v, 1)[0]!;
    expect(match.compared).not.toContain("bodyPx"); // presets do not define a type scale
    expect(match.compared.length).toBeGreaterThan(3);
  });
});

describe("theme import command", () => {
  it("writes .theme.json, .theme.ts and .css", async () => {
    const dir = mkdtempSync(join(tmpdir(), "uxth-"));
    try {
      const file = join(dir, "acme.tokens.json");
      writeFileSync(file, JSON.stringify(layered));
      const lines: string[] = [];
      expect(await themeCommand(["import", file, "--out", dir], (l) => lines.push(l))).toBe(0);
      expect(existsSync(join(dir, "acme.theme.json"))).toBe(true);
      expect(readFileSync(join(dir, "acme.theme.ts"), "utf8")).toContain("satisfies ThemeConfig");
      expect(readFileSync(join(dir, "acme.css"), "utf8")).toContain('[data-ui-theme="acme"]');
      expect(lines.join("\n")).toContain("semantic.color.action.primary");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
