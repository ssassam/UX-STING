import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * The design-intelligence knowledge base. Records are imported from the
 * MIT-licensed UI UX Pro Max project (© 2024 Next Level Builder) by
 * `scripts/import-data.mjs`; see THIRD_PARTY_NOTICES.md.
 */

export interface Product {
  productType: string;
  keywords?: string;
  primaryStyleRecommendation?: string;
  secondaryStyles?: string;
  landingPagePattern?: string;
  dashboardStyle?: string;
  colorPaletteFocus?: string;
  keyConsiderations?: string;
}

export interface Reasoning {
  uiCategory: string;
  recommendedPattern?: string;
  stylePriority?: string;
  colorMood?: string;
  typographyMood?: string;
  keyEffects?: string;
  decisionRules?: string;
  antiPatterns?: string;
  severity?: string;
}

export interface Style {
  styleCategory: string;
  type?: string;
  keywords?: string;
  primaryColors?: string;
  secondaryColors?: string;
  effectsAnimation?: string;
  bestFor?: string;
  doNotUseFor?: string;
  lightMode?: string;
  darkMode?: string;
  performance?: string;
  accessibility?: string;
  complexity?: string;
  aiPromptKeywords?: string;
  cssTechnicalKeywords?: string;
  implementationChecklist?: string;
  designSystemVariables?: string;
  styleId?: string;
  aliases?: string;
  status?: "active" | "supplemental" | "deprecated" | string;
}

export interface Palette {
  productType: string;
  primary: string;
  onPrimary: string;
  secondary?: string;
  onSecondary?: string;
  accent?: string;
  onAccent?: string;
  background: string;
  foreground: string;
  card?: string;
  cardForeground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
  destructive?: string;
  onDestructive?: string;
  ring?: string;
  notes?: string;
}

export interface FontPairing {
  fontPairingName: string;
  category?: string;
  headingFont: string;
  bodyFont: string;
  moodStyleKeywords?: string;
  bestFor?: string;
  googleFontsUrl?: string;
  cssImport?: string;
  notes?: string;
}

export interface LandingPattern {
  patternName: string;
  keywords?: string;
  sectionOrder?: string;
  primaryCtaPlacement?: string;
  colorStrategy?: string;
  recommendedEffects?: string;
  conversionOptimization?: string;
  patternId?: string;
}

export interface Guideline {
  category?: string;
  issue?: string;
  platform?: string;
  description?: string;
  do?: string;
  dont?: string;
  codeExampleGood?: string;
  codeExampleBad?: string;
  severity?: string;
}

export interface StackGuideline {
  stack: string;
  category?: string;
  guideline?: string;
  description?: string;
  do?: string;
  dont?: string;
  codeGood?: string;
  codeBad?: string;
  severity?: string;
  docsUrl?: string;
}

export type Row = Record<string, string>;

export interface Catalog {
  products: Product[];
  reasoning: Reasoning[];
  styles: Style[];
  colors: Palette[];
  typography: FontPairing[];
  landing: LandingPattern[];
  ux: Guideline[];
  charts: Row[];
  motion: Row[];
  icons: Row[];
  app: Guideline[];
  performance: Guideline[];
  stacks: StackGuideline[];
}

export type Domain = keyof Catalog;

export const DOMAINS: Domain[] = [
  "products",
  "reasoning",
  "styles",
  "colors",
  "typography",
  "landing",
  "ux",
  "charts",
  "motion",
  "icons",
  "app",
  "performance",
  "stacks",
];

const cache = new Map<Domain, unknown[]>();

// `data/` sits beside both `src/` and `dist/`. Test runners with a browser
// environment serve modules from an http origin; map that back to disk.
const here = new URL("../data/", import.meta.url);
const DATA =
  here.protocol === "file:" ? here : pathToFileURL(join(process.cwd(), here.pathname) + "/");

/** Loads one domain lazily. */
export function load<D extends Domain>(domain: D): Catalog[D] {
  let rows = cache.get(domain);
  if (!rows) {
    rows = JSON.parse(readFileSync(new URL(`${domain}.json`, DATA), "utf8")) as unknown[];
    cache.set(domain, rows);
  }
  return rows as Catalog[D];
}

/** Record counts per domain, for help text and badges. */
export function stats(): Record<Domain, number> {
  return Object.fromEntries(DOMAINS.map((d) => [d, load(d).length])) as Record<Domain, number>;
}
