import { createScale, type SemanticColor } from "@ux-sting/tokens";
import type { ThemeConfig } from "@ux-sting/themes";
import {
  contrast,
  ensureContrast,
  oklchString,
  oklchToRgb,
  parseColor,
  rgbToOklch,
  toHex,
  type Rgb,
} from "./color.js";
import { flattenDtcg, fontList, toPx, type DtcgDocument, type FlatToken } from "./dtcg.js";

export type Role =
  | "background"
  | "foreground"
  | "surface"
  | "muted-foreground"
  | "border"
  | "primary"
  | "primary-foreground";

/**
 * Name patterns per role, strongest first. Covers UX-STING's own export
 * (`color.background`), designlang-style semantic layers
 * (`semantic.color.surface.default`, `semantic.color.action.primary`) and
 * common Figma / Style Dictionary naming.
 */
const ROLE_PATTERNS: Record<Role, RegExp[]> = {
  background: [
    /^color\.background$/,
    /(^|\.)(background|bg|canvas|page)(\.(default|base|primary|page|bg0|0))?$/,
    /(^|\.)surface\.(default|base|page)$/,
  ],
  foreground: [
    /^color\.foreground$/,
    /(^|\.)(foreground|fg)(\.(default|base|primary))?$/,
    /(^|\.)text\.(body|default|primary|base)$/,
    /(^|\.)(text|ink)$/,
  ],
  surface: [
    /^color\.surface$/,
    /(^|\.)(surface|card|panel)\.(raised|subtle|secondary|alt|muted|1)$/,
    /(^|\.)(card|panel|muted)(\.default)?$/,
  ],
  "muted-foreground": [
    /^color\.muted-foreground$/,
    /(^|\.)text\.(muted|secondary|subtle|tertiary)$/,
    /(^|\.)(muted|subtle)[-.]?(foreground|fg|text)$/,
  ],
  border: [/^color\.border$/, /(^|\.)(border|divider|stroke|outline)(\.(default|base|subtle))?$/],
  primary: [
    /^color\.primary$/,
    /(^|\.)(action|interactive|cta)\.(primary|default)$/,
    /(^|\.)(primary|brand)(\.(default|base|primary|500|600))?$/,
    /(^|\.)accent(\.default)?$/,
  ],
  "primary-foreground": [
    /^color\.primary-foreground$/,
    /(^|\.)(on-primary|primary[-.](foreground|fg|text|on))$/,
  ],
};

export interface RoleMapping {
  role: SemanticColor;
  /** Token path it came from; null for derived values. */
  path: string | null;
  value: string;
  source: "named" | "fallback" | "derived" | "adjusted";
}

export interface ContrastAdjustment {
  pair: [SemanticColor, SemanticColor];
  before: number;
  after: number;
  changed: SemanticColor;
}

export interface ThemeImport {
  config: ThemeConfig;
  scheme: "light" | "dark";
  mapping: RoleMapping[];
  /** Pairs moved to reach WCAG AA — accessibility outranks fidelity. */
  adjustments: ContrastAdjustment[];
  /** Roles the file did not provide; UX-STING's scale-derived defaults apply. */
  missing: Role[];
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "imported";

function findRole(tokens: FlatToken[], role: Role): FlatToken | undefined {
  for (const re of ROLE_PATTERNS[role]) {
    const hits = tokens.filter((t) =>
      re.test(t.path.replace(/^(semantic|primitive|base|global|ref|sys)\./, "")),
    );
    if (hits.length)
      // Prefer a semantic layer over primitives when both match.
      return hits.sort(
        (a, b) => Number(/semantic|sys/.test(b.path)) - Number(/semantic|sys/.test(a.path)),
      )[0];
  }
  return undefined;
}

const GENERIC: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};
/** Serif when a named family looks like one or the stack falls back to generic `serif`. */
export const isSerif = (families: string[]) =>
  families.some(
    (f) =>
      /^serif$|georgia|times|garamond|fraunces|playfair|cormorant|baskerville|didot|bodoni|merriweather|lora|caslon|serif/i.test(
        f,
      ) && !/sans/i.test(f),
  );
function stack(families: string[], kind: keyof typeof GENERIC) {
  const named = families
    .filter((f) => !/^(sans-serif|serif|monospace|system-ui|ui-[a-z-]+|-apple-system)$/i.test(f))
    .map((f) => (/\s/.test(f) ? `"${f}"` : f));
  return [...named, GENERIC[kind]].join(", ");
}

/**
 * Maps a DTCG document (UX-STING's extractor, designlang, Figma exports…)
 * to a UX-STING `ThemeConfig`. Exact colors become OKLCH semantic
 * overrides for the document's own scheme; primary and neutral scales are
 * rebuilt from their hue and chroma so the other modes stay coherent.
 * Every contrast pair UX-STING tests is enforced at AA, and each change is
 * reported.
 */
export function dtcgToTheme(doc: DtcgDocument, options: { name?: string } = {}): ThemeImport {
  const tokens = flattenDtcg(doc);
  const colors = tokens.filter((t) => (t.type === "color" || !t.type) && parseColor(t.value));
  const mapping: RoleMapping[] = [];
  const missing: Role[] = [];
  const found: Partial<Record<Role, Rgb>> = {};
  const paths: Partial<Record<Role, string>> = {};

  for (const role of Object.keys(ROLE_PATTERNS) as Role[]) {
    const t = findRole(colors, role);
    if (t) {
      found[role] = { ...parseColor(t.value)!, a: 1 };
      paths[role] = t.path;
    }
  }

  // Palette-only files: infer from lightness and chroma, and say so.
  const fallback = (
    role: Role,
    pick: (c: Array<{ t: FlatToken; o: ReturnType<typeof rgbToOklch> }>) => FlatToken | undefined,
  ) => {
    if (found[role]) return;
    const pool = colors.map((t) => ({ t, o: rgbToOklch(parseColor(t.value)!) }));
    const t = pick(pool);
    if (t) {
      found[role] = { ...parseColor(t.value)!, a: 1 };
      paths[role] = `${t.path} (fallback)`;
    }
  };
  const neutrals = (p: Array<{ t: FlatToken; o: ReturnType<typeof rgbToOklch> }>) =>
    p.filter((x) => x.o.c < 0.04);
  fallback("background", (p) => neutrals(p).sort((a, b) => b.o.l - a.o.l)[0]?.t);
  const bgL = found.background ? rgbToOklch(found.background).l : 1;
  fallback(
    "foreground",
    (p) => neutrals(p).sort((a, b) => (bgL >= 0.5 ? a.o.l - b.o.l : b.o.l - a.o.l))[0]?.t,
  );
  fallback(
    "primary",
    (p) =>
      p.filter((x) => x.o.c >= 0.06 && x.o.l > 0.3 && x.o.l < 0.8).sort((a, b) => b.o.c - a.o.c)[0]
        ?.t,
  );

  for (const role of Object.keys(ROLE_PATTERNS) as Role[]) if (!found[role]) missing.push(role);

  const bg = found.background ?? { r: 255, g: 255, b: 255, a: 1 };
  const scheme = rgbToOklch(bg).l < 0.5 ? "dark" : "light";
  const fg =
    found.foreground ??
    (scheme === "dark" ? { r: 245, g: 245, b: 245, a: 1 } : { r: 17, g: 17, b: 17, a: 1 });

  const out: Partial<Record<SemanticColor, Rgb>> = {};
  const set = (
    role: SemanticColor,
    value: Rgb,
    source: RoleMapping["source"],
    path: string | null,
  ) => {
    out[role] = value;
    mapping.push({ role, path, value: oklchString(rgbToOklch(value)), source });
  };
  const named = (r: Role) => (paths[r]?.endsWith("(fallback)") ? "fallback" : "named");

  // Enforce the pairs UX-STING's theme tests require, moving one side.
  const adjustments: ContrastAdjustment[] = [];
  const enforce = (
    back: SemanticColor,
    front: SemanticColor,
    target: number,
    move: "front" | "back" = "front",
  ) => {
    const b = out[back];
    const f = out[front];
    if (!b || !f) return;
    const before = contrast(b, f);
    if (before >= target) return;
    const changed = move === "front" ? front : back;
    const fixed = move === "front" ? ensureContrast(f, b, target) : ensureContrast(b, f, target);
    out[changed] = fixed;
    const after = move === "front" ? contrast(b, fixed) : contrast(fixed, f);
    adjustments.push({ pair: [back, front], before: round(before), after: round(after), changed });
    const m = mapping.find((x) => x.role === changed);
    if (m) Object.assign(m, { value: oklchString(rgbToOklch(fixed)), source: "adjusted" });
  };

  set(
    "background",
    bg,
    found.background ? named("background") : "derived",
    paths.background ?? null,
  );
  set(
    "foreground",
    fg,
    found.foreground ? named("foreground") : "derived",
    paths.foreground ?? null,
  );
  enforce("background", "foreground", 4.5);
  const text = out.foreground!;
  set("card", bg, "derived", null);
  set("card-foreground", text, "derived", null);
  set("popover", bg, "derived", null);
  set("popover-foreground", text, "derived", null);
  if (found.surface) {
    set("surface", found.surface, named("surface"), paths.surface!);
    set("surface-foreground", text, "derived", null);
    set("muted", found.surface, "derived", null);
    enforce("surface", "surface-foreground", 4.5, "back");
    out.muted = out.surface;
  }
  if (found["muted-foreground"]) {
    set(
      "muted-foreground",
      found["muted-foreground"],
      named("muted-foreground"),
      paths["muted-foreground"]!,
    );
    enforce("background", "muted-foreground", 4.5);
    enforce("muted", "muted-foreground", 4.5);
  }
  if (found.border) {
    set("border", found.border, named("border"), paths.border!);
    set("input", found.border, "derived", null);
  }
  if (found.primary) {
    set("primary", found.primary, named("primary"), paths.primary!);
    enforce("background", "primary", 3);
    const p = out.primary!;
    const o = rgbToOklch(p);
    set(
      "primary-hover",
      { ...oklchToRgb({ ...o, l: o.l + (scheme === "dark" ? 0.06 : -0.06) }), a: 1 },
      "derived",
      null,
    );
    const white = { r: 255, g: 255, b: 255, a: 1 };
    const ink = { r: 17, g: 17, b: 17, a: 1 };
    const onPrimary =
      found["primary-foreground"] ?? (contrast(white, p) >= contrast(ink, p) ? white : ink);
    set(
      "primary-foreground",
      onPrimary,
      found["primary-foreground"] ? named("primary-foreground") : "derived",
      paths["primary-foreground"] ?? null,
    );
    enforce("primary", "primary-foreground", 4.5, "back");
    enforce("primary-hover", "primary-foreground", 4.5, "back");
    set("ring", out.primary!, "derived", null);
  }

  // Scales keep the other modes coherent with the imported identity.
  const po = found.primary ? rgbToOklch(found.primary) : null;
  const fo = rgbToOklch(fg);
  const bo = rgbToOklch(bg);
  const neutralChroma = Math.min(0.03, (fo.c + bo.c) / 2);
  const neutralHue = fo.c > bo.c ? fo.h : bo.h;

  const semantic = Object.fromEntries(
    Object.entries(out).map(([k, v]) => [k, oklchString(rgbToOklch(v!))]),
  ) as Partial<Record<SemanticColor, string>>;

  const name = slug(
    options.name ??
      String(
        (doc.$description as string | undefined)?.match(/from (?:https?:\/\/)?([^/\s]+)/)?.[1] ??
          "imported",
      ),
  );
  const config: ThemeConfig = {
    name,
    ...(po ? { primary: createScale(po.h, Math.min(0.24, Math.max(0.02, po.c))) } : {}),
    neutral: createScale(neutralHue, neutralChroma),
    colors: scheme === "dark" ? { dark: semantic } : { light: semantic },
  };

  const fontTokens = tokens.filter(
    (t) => t.type === "fontFamily" || /font[-.]?family/i.test(t.path),
  );
  const fontFor = (re: RegExp) => fontTokens.find((t) => re.test(t.path));
  const body = fontFor(/body|base|text|sans|default|primary|f0/i) ?? fontTokens[0];
  const heading = fontFor(/heading|display|title|headline|serif/i);
  const mono = fontFor(/mono|code/i);
  const fontFamily: NonNullable<ThemeConfig["fontFamily"]> = {};
  if (body)
    fontFamily.sans = stack(fontList(body.value), isSerif(fontList(body.value)) ? "serif" : "sans");
  if (heading && isSerif(fontList(heading.value)))
    fontFamily.serif = stack(fontList(heading.value), "serif");
  if (mono) fontFamily.mono = stack(fontList(mono.value), "mono");
  if (Object.keys(fontFamily).length) config.fontFamily = fontFamily;

  const radii = tokens.filter(
    (t) => (t.type === "dimension" || !t.type) && /radius|rounded|corner/i.test(t.path),
  );
  const preferred =
    radii.find((t) => /(default|base|md|control|button)$/i.test(t.path)) ??
    radii
      .map((t) => ({ t, px: toPx(t.value) }))
      .filter((x) => x.px !== null && x.px < 999)
      .sort((a, b) => a.px! - b.px!)[Math.floor(radii.length / 2)]?.t;
  const r = preferred ? toPx(preferred.value) : null;
  if (r !== null && r < 999) config.radius = `${Math.round(r * 100) / 100}px`;

  return { config, scheme, mapping, adjustments, missing };
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Hex preview of an OKLCH string, for reports. */
export const hexOf = (value: string) => toHex(parseColor(value)!);
