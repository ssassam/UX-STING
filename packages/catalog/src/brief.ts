import { dtcgToTheme, hexOf, type DtcgDocument, type ThemeImport } from "@ux-sting/extract";
import {
  load,
  type FontPairing,
  type Guideline,
  type LandingPattern,
  type Palette,
  type Product,
  type Reasoning,
  type StackGuideline,
  type Style,
} from "./data.js";
import { search } from "./search.js";

export interface DesignBrief {
  query: string;
  product: Product;
  /** Other close product matches, best first. */
  alternatives: string[];
  reasoning?: Reasoning;
  style?: Style;
  secondaryStyles: Style[];
  palette?: Palette;
  typography?: FontPairing;
  landing?: LandingPattern;
  effects: string[];
  antiPatterns: string[];
  decisionRules: Record<string, string[]>;
  guidelines: Guideline[];
  stackGuidelines: StackGuideline[];
  radius?: string;
  /** The UX-STING theme generated from the palette, AA-enforced. */
  theme?: ThemeImport;
}

export interface BriefOptions {
  /** Theme name (default: slug of the product type). */
  name?: string;
  /** Force a style by name, overriding the industry recommendation. */
  style?: string;
  /** Add stack-specific guidelines (react, nextjs, vue, svelte, flutter, swiftui…). */
  stack?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "brief";
const parts = (s?: string) =>
  (s ?? "")
    .split(/\s*\+\s*|\s*,\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

export function findStyle(name: string): Style | undefined {
  const n = norm(name);
  if (!n) return undefined;
  const styles = load("styles");
  const exact =
    styles.find((s) => norm(s.styleCategory) === n) ??
    styles.find((s) => s.styleId && norm(s.styleId) === n) ??
    styles.find((s) => parts(s.aliases).some((a) => norm(a) === n));
  if (exact) return exact;
  return search("styles", name, { limit: 1 })[0]?.record;
}

function findProduct(query: string) {
  const products = load("products");
  const n = norm(query);
  const exact = products.find((p) => norm(p.productType) === n);
  const hits = search("products", query, { limit: 6 });
  const viaReasoning = search("reasoning", query, { limit: 1 })[0];
  let product = exact ?? hits[0]?.record;
  if (!product && viaReasoning)
    product = products.find((p) => p.productType === viaReasoning.record.uiCategory);
  return {
    product: product ?? products[0]!,
    alternatives: hits
      .map((h) => h.record.productType)
      .filter((t) => t !== product?.productType)
      .slice(0, 4),
  };
}

function parseRules(raw?: string): Record<string, string[]> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : [String(v)]]),
    );
  } catch {
    return {};
  }
}

/** First radius the style's own variables declare, e.g. `--border-radius: 14px`. */
export function styleRadius(style?: Style): string | undefined {
  const text = `${style?.designSystemVariables ?? ""} ${style?.cssTechnicalKeywords ?? ""}`;
  const m = /radius[^:]*:\s*(\d+(?:\.\d+)?)(px|rem)/i.exec(text);
  return m ? `${m[1]}${m[2]}` : undefined;
}

/** Palette + fonts + radius as a W3C DTCG document UX-STING can import. */
export function briefToDtcg(
  brief: Pick<DesignBrief, "palette" | "typography" | "radius">,
): DtcgDocument {
  const p = brief.palette;
  const color = (value?: string) => (value ? { $type: "color", $value: value } : undefined);
  const doc: Record<string, unknown> = {};
  if (p)
    doc.color = Object.fromEntries(
      Object.entries({
        background: color(p.background),
        foreground: color(p.foreground),
        surface: color(p.card),
        "muted-foreground": color(p.mutedForeground),
        border: color(p.border),
        primary: color(p.primary),
        "primary-foreground": color(p.onPrimary),
      }).filter(([, v]) => v),
    );
  if (brief.typography)
    doc.font = {
      family: {
        body: { $type: "fontFamily", $value: brief.typography.bodyFont },
        heading: { $type: "fontFamily", $value: brief.typography.headingFont },
      },
    };
  if (brief.radius) doc.radius = { base: { $type: "dimension", $value: brief.radius } };
  return doc as DtcgDocument;
}

/**
 * Industry-aware design-system generation: product type → page pattern,
 * style, palette, type pairing, effects and anti-patterns — then a real,
 * contrast-checked UX-STING theme built from the palette.
 */
export function brief(query: string, options: BriefOptions = {}): DesignBrief {
  const { product, alternatives } = findProduct(query);
  const reasoning = load("reasoning").find((r) => r.uiCategory === product.productType);
  const palette = load("colors").find((c) => c.productType === product.productType);

  const styleNames = options.style
    ? [options.style]
    : parts(reasoning?.stylePriority ?? product.primaryStyleRecommendation);
  const styles = [...styleNames, ...parts(product.secondaryStyles)]
    .map(findStyle)
    .filter(
      (s, i, all): s is Style =>
        Boolean(s) && all.findIndex((x) => x?.styleCategory === s!.styleCategory) === i,
    );
  const style = styles[0];

  const typography = search(
    "typography",
    `${query} ${product.productType} ${reasoning?.typographyMood ?? ""} ${style?.styleCategory ?? ""}`,
    { limit: 1 },
  )[0]?.record;

  // The product row names a catalog pattern; the reasoning row may use a
  // looser label ("Hero-Centric + Trust"), so it is searched by name only.
  const patterns = [product.landingPagePattern, reasoning?.recommendedPattern].filter(
    Boolean,
  ) as string[];
  const byName = (name: string) =>
    load("landing").find(
      (l) =>
        norm(l.patternName) === norm(name) || parts(l.keywords).some((k) => norm(k) === norm(name)),
    );
  const landing =
    patterns.map(byName).find(Boolean) ??
    patterns
      .flatMap((p) => parts(p))
      .map(byName)
      .find(Boolean) ??
    search("landing", patterns.join(" "), { limit: 1 })[0]?.record ??
    search("landing", query, { limit: 1 })[0]?.record;

  const guidelines = search(
    "ux",
    `${query} ${product.productType} ${style?.styleCategory ?? ""} accessibility contrast focus`,
    { limit: 12 },
  )
    .map((h) => h.record)
    .sort((a, b) => Number(b.severity === "High") - Number(a.severity === "High"))
    .slice(0, 6);

  const stackGuidelines = options.stack
    ? search("stacks", `${query} ${style?.styleCategory ?? ""} performance accessibility`, {
        stack: options.stack,
        limit: 6,
      }).map((h) => h.record)
    : [];

  const result: DesignBrief = {
    query,
    product,
    alternatives,
    reasoning,
    style,
    secondaryStyles: styles.slice(1, 3),
    palette,
    typography,
    landing,
    effects: parts(reasoning?.keyEffects),
    antiPatterns: parts(reasoning?.antiPatterns),
    decisionRules: parseRules(reasoning?.decisionRules),
    guidelines,
    stackGuidelines,
    radius: styleRadius(style),
  };
  if (palette)
    result.theme = dtcgToTheme(briefToDtcg(result), {
      name: options.name ?? slug(product.productType),
    });
  return result;
}

const line = (label: string, value?: string) => (value ? `- **${label}:** ${value}` : "");

/** The brief as Markdown — printed by the CLI and saved as design-system.md. */
export function renderBrief(b: DesignBrief): string {
  const out: string[] = [];
  const name = b.theme?.config.name;
  out.push(`# Design system — ${b.product.productType}`, "");
  out.push(
    `> Generated by \`ux-sting brief "${b.query}"\`. Edit freely; this file is the source of truth for the build.`,
    "",
  );
  if (b.alternatives.length) out.push(`Close matches: ${b.alternatives.join(" · ")}`, "");

  out.push(
    "## Page pattern",
    line("Pattern", b.landing?.patternName ?? b.reasoning?.recommendedPattern),
  );
  if (b.landing?.sectionOrder) out.push(line("Sections", b.landing.sectionOrder));
  out.push(
    line("Primary CTA", b.landing?.primaryCtaPlacement),
    line("Conversion", b.landing?.conversionOptimization),
    line("Dashboard", b.product.dashboardStyle),
    "",
  );

  out.push("## Style", line("Primary", b.style?.styleCategory));
  if (b.secondaryStyles.length)
    out.push(line("Also fits", b.secondaryStyles.map((s) => s.styleCategory).join(", ")));
  out.push(
    line("Keywords", b.style?.keywords),
    line("Effects", b.style?.effectsAnimation),
    line("Accessibility", b.style?.accessibility),
    line("Performance", b.style?.performance),
    line("Avoid for", b.style?.doNotUseFor),
    line("Radius", b.radius),
    "",
  );

  if (b.palette) {
    const p = b.palette;
    out.push("## Colors", "", "| Role | Value |", "| --- | --- |");
    for (const [role, v] of Object.entries({
      Primary: p.primary,
      "On primary": p.onPrimary,
      Secondary: p.secondary,
      Accent: p.accent,
      Background: p.background,
      Foreground: p.foreground,
      Card: p.card,
      Muted: p.muted,
      "Muted foreground": p.mutedForeground,
      Border: p.border,
      Destructive: p.destructive,
      Ring: p.ring,
    }))
      if (v) out.push(`| ${role} | \`${v}\` |`);
    out.push(
      "",
      line("Mood", b.reasoning?.colorMood ?? b.product.colorPaletteFocus),
      line("Notes", p.notes),
    );
    for (const a of b.theme?.adjustments ?? [])
      out.push(
        `- Adjusted **${a.changed}** for WCAG AA: ${a.pair.join(" / ")} ${a.before}:1 → ${a.after}:1`,
      );
    out.push("");
  }

  if (b.typography) {
    const t = b.typography;
    out.push(
      "## Typography",
      line("Pairing", `${t.fontPairingName} — ${t.headingFont} / ${t.bodyFont}`),
      line("Mood", t.moodStyleKeywords),
      line("Google Fonts", t.googleFontsUrl),
      "",
    );
  }

  if (b.effects.length) out.push("## Key effects", ...b.effects.map((e) => `- ${e}`), "");
  if (b.antiPatterns.length) out.push("## Avoid", ...b.antiPatterns.map((e) => `- ${e}`), "");
  const rules = Object.entries(b.decisionRules);
  if (rules.length)
    out.push("## Decision rules", ...rules.map(([k, v]) => `- \`${k}\` → ${v.join(", ")}`), "");
  if (b.product.keyConsiderations)
    out.push("## Key considerations", b.product.keyConsiderations, "");

  if (b.guidelines.length) {
    out.push("## UX rules that apply");
    for (const g of b.guidelines)
      out.push(`- **${g.issue}** (${g.severity ?? "—"}): ${g.do ?? g.description ?? ""}`);
    out.push("");
  }
  if (b.stackGuidelines.length) {
    out.push(`## ${b.stackGuidelines[0]!.stack} guidelines`);
    for (const g of b.stackGuidelines)
      out.push(`- **${g.guideline}**: ${g.do ?? g.description ?? ""}`);
    out.push("");
  }

  if (name) {
    out.push(
      "## Use it in UX-STING",
      "```tsx",
      `import { ${camel(name)} } from "./${name}.theme";`,
      `<UIProvider theme={${camel(name)}}>…</UIProvider>`,
      "```",
      `Or import \`${name}.css\` and set \`data-ui-theme="${name}"\` on <html>.`,
      "",
    );
  }

  out.push(
    "## Pre-delivery checklist",
    "- [ ] `npx ux-sting qa <url>` passes: axe, contrast, overflow, cramped text at 375 / 768 / 1440",
    "- [ ] SVG icons (`@ux-sting/icons`), never emoji as icons",
    "- [ ] Visible focus on every interactive element; full keyboard path",
    "- [ ] `prefers-reduced-motion` respected (UX-STING motion presets do this)",
    "- [ ] Dark mode and RTL checked with the theme switcher",
    "- [ ] Real, credited images (`npx ux-sting images <query>`), no placeholder stock",
  );
  return out.filter((l, i, all) => !(l === "" && all[i - 1] === "")).join("\n") + "\n";
}

export const camel = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
export { hexOf };
