/**
 * Real output of the UX-STING tools, produced by scripts/generate.sh and
 * committed. Nothing here is written by hand.
 */
import credits from "../data/credits.json";
import dna from "../data/ember.dna.json";
import themeImport from "../data/ember.import.json";
import tokens from "../data/ember.tokens.json";
import imageSearch from "../data/images-search.json";
import qaBroken from "../data/qa-broken.json";
import qaEmber from "../data/qa-ember.json";
import qaSlop from "../data/qa-slop.json";

export interface Finding {
  id: string;
  category: string;
  severity: "critical" | "serious" | "moderate" | "minor";
  message: string;
  fix: string;
  viewports: number[];
  targets?: string[];
}
export interface QaRun {
  key: string;
  label: string;
  command: string;
  note: string;
  score: number;
  passed: boolean;
  findings: Finding[];
  shot: string;
}

const run = (
  key: string,
  label: string,
  command: string,
  note: string,
  report: { score: number; passed: boolean; findings: unknown[] },
  shot: string,
): QaRun => ({
  key,
  label,
  command,
  note,
  score: report.score,
  passed: report.passed,
  findings: report.findings as Finding[],
  shot,
});

export const qaRuns: QaRun[] = [
  run(
    "broken",
    "Planted bugs",
    "npx ux-sting qa packages/qa/src/__fixtures__/broken.html",
    "A test page with ten problems planted on purpose. QA finds all ten.",
    qaBroken,
    "/qa/broken-full.png",
  ),
  run(
    "slop",
    "Generic AI page",
    "npx ux-sting qa packages/qa/src/__fixtures__/slop.html",
    "Purple gradient, emoji icons, centered hero with three cards, lorem ipsum. The taste checks name each one.",
    qaSlop,
    "/qa/slop-1440.png",
  ),
  run(
    "ember",
    "Ember demo",
    "npx ux-sting qa examples/ember/out",
    "A finished demo site. It passes, and QA still reports its one real contrast issue.",
    qaEmber,
    "/qa/ember-1440.png",
  ),
];

type Dtcg = Record<string, Record<string, { $type?: string; $value?: unknown }>>;
const doc = tokens as unknown as Dtcg;

export const swatches = Object.entries(doc.color ?? {})
  .filter(([k, t]) => !k.startsWith("$") && t.$value)
  .map(([name, t]) => ({ name, hex: (t.$value as { hex: string }).hex }));

const dim = (v: unknown) => {
  const d = v as { value?: number; unit?: string } | null;
  return d && typeof d === "object" && "value" in d ? `${d.value}${d.unit ?? ""}` : String(v);
};

const group = (name: string) =>
  Object.entries(doc[name] ?? {})
    .filter(([k, t]) => !k.startsWith("$") && t.$value !== undefined)
    .map(([k, t]) => {
      const value = dim(t.$value);
      // Scale steps named by their own value (radius "11" = 11px) show once.
      return { name: value.startsWith(k) ? "" : k, value };
    });

export const tokenGroups = [
  { label: "Font size", items: group("fontSize") },
  { label: "Spacing", items: group("spacing") },
  { label: "Radius", items: group("radius") },
  { label: "Duration", items: group("duration") },
  { label: "Breakpoint", items: group("breakpoint") },
].filter((g) => g.items.length);

export const missing = ((tokens as { $extensions?: Record<string, { missing?: string[] }> })
  .$extensions?.["dev.ux-sting"]?.missing ?? []) as string[];

export const theme = themeImport as unknown as {
  scheme: string;
  mapping: Array<{ role: string; path: string | null; value: string; source: string }>;
  adjustments: Array<{ pair: [string, string]; before: number; after: number; changed: string }>;
  missing: string[];
};

export const dnaResult = dna as {
  vector: Record<string, number | string | null>;
  matches: Array<{ preset: string; distance: number; compared: string[] }>;
};

export interface ImageHit {
  id: string;
  source: string;
  title: string;
  creator: string | null;
  license: string;
  landingUrl: string;
}
export const imageHits = imageSearch as unknown as ImageHit[];

export interface Credit extends ImageHit {
  file: string;
  credit: string;
  altDraft: string;
}
const byFile = Object.fromEntries(
  (credits as unknown as Credit[]).map((c) => [c.file.split("/").pop()!, c]),
);
export const credit = (file: string) => byFile[file]!;
export const allCredits = credits as unknown as Credit[];
