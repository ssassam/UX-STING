import { load, type Catalog, type Domain } from "./data.js";

/** Fields that carry meaning per domain; the first is the record's title. */
export const FIELDS: Record<Domain, string[]> = {
  products: ["productType", "keywords", "primaryStyleRecommendation", "keyConsiderations"],
  reasoning: ["uiCategory", "stylePriority", "colorMood", "typographyMood", "keyEffects"],
  styles: [
    "styleCategory",
    "keywords",
    "aliases",
    "bestFor",
    "effectsAnimation",
    "aiPromptKeywords",
  ],
  colors: ["productType", "notes"],
  typography: [
    "fontPairingName",
    "moodStyleKeywords",
    "bestFor",
    "headingFont",
    "bodyFont",
    "category",
  ],
  landing: ["patternName", "keywords", "sectionOrder", "conversionOptimization"],
  ux: ["issue", "category", "description", "do", "dont"],
  charts: ["dataType", "keywords", "bestChartType", "whenToUse"],
  motion: ["category", "keywords", "trigger", "intensityTier"],
  icons: ["iconName", "keywords", "category", "bestFor", "semanticRole"],
  app: ["issue", "category", "keywords", "description", "do"],
  performance: ["issue", "category", "keywords", "description", "do"],
  stacks: ["guideline", "category", "description", "do", "stack"],
};

const STOP = new Set(
  "a an and are as at be by for from in is it of on or the to with my our your app site page website build make design create need want".split(
    " ",
  ),
);

export const tokenize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t))
    // Light stemming so "dashboards" finds "dashboard".
    .map((t) => (t.length > 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));

interface Index {
  docs: string[][];
  df: Map<string, number>;
  avg: number;
}
const indexes = new Map<Domain, Index>();

function indexFor(domain: Domain): Index {
  let idx = indexes.get(domain);
  if (idx) return idx;
  const rows = load(domain) as unknown as Record<string, string | undefined>[];
  // The title field counts twice: a name match beats a passing mention.
  const docs = rows.map((r) =>
    tokenize(
      FIELDS[domain]
        .map((f, i) => (i === 0 ? `${r[f] ?? ""} ${r[f] ?? ""}` : (r[f] ?? "")))
        .join(" "),
    ),
  );
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
  idx = { docs, df, avg: docs.reduce((s, d) => s + d.length, 0) / Math.max(docs.length, 1) };
  indexes.set(domain, idx);
  return idx;
}

export interface Hit<T> {
  record: T;
  score: number;
}

export interface SearchOptions {
  limit?: number;
  /** Keep only records whose `stack` field matches (stacks domain). */
  stack?: string;
  /** Drop deprecated styles (default true). */
  activeOnly?: boolean;
}

/** BM25 ranking over one domain. */
export function search<D extends Domain>(
  domain: D,
  query: string,
  { limit = 5, stack, activeOnly = true }: SearchOptions = {},
): Hit<Catalog[D][number]>[] {
  const rows = load(domain) as unknown as Record<string, string | undefined>[];
  const { docs, df, avg } = indexFor(domain);
  const terms = [...new Set(tokenize(query))];
  const k1 = 1.2;
  const b = 0.75;
  const hits: Hit<Catalog[D][number]>[] = [];
  docs.forEach((doc, i) => {
    const row = rows[i]!;
    if (stack && row.stack !== stack) return;
    if (activeOnly && domain === "styles" && row.status === "deprecated") return;
    let score = 0;
    for (const t of terms) {
      const tf = doc.filter((x) => x === t).length;
      if (!tf) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
      score += (idf * tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * doc.length) / avg));
    }
    if (score > 0) hits.push({ record: row as Catalog[D][number], score });
  });
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** The display title of a record in its domain. */
export const titleOf = (domain: Domain, record: object) =>
  String((record as Record<string, unknown>)[FIELDS[domain][0]!] ?? "");
