#!/usr/bin/env node
/**
 * Converts the UI UX Pro Max knowledge base (MIT, © 2024 Next Level Builder,
 * https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) from CSV into the
 * typed JSON that @ux-sting/catalog ships. Re-run after pulling upstream:
 *
 *   node packages/catalog/scripts/import-data.mjs <path-to>/src/ui-ux-pro-max/data
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = process.argv[2];
if (!src) {
  console.error("Usage: import-data.mjs <ui-ux-pro-max/data dir>");
  process.exit(1);
}
const out = fileURLToPath(new URL("../data/", import.meta.url));
mkdirSync(out, { recursive: true });

/** RFC 4180 CSV: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") endField();
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endField();
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) {
    endField();
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

const camel = (h) =>
  h
    .replace(/\(.*?\)/g, "")
    .replace(/'/g, "")
    .replace(/[✓/&]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));

function load(file) {
  const [header, ...rows] = parseCsv(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  const keys = header.map(camel);
  return rows.map((r) => {
    const rec = {};
    keys.forEach((k, i) => {
      if (k === "no") return;
      const v = (r[i] ?? "").trim();
      if (v) rec[k] = v;
    });
    return rec;
  });
}

const DOMAINS = {
  products: "products.csv",
  reasoning: "ui-reasoning.csv",
  styles: "styles.csv",
  colors: "colors.csv",
  typography: "typography.csv",
  landing: "landing.csv",
  ux: "ux-guidelines.csv",
  charts: "charts.csv",
  motion: "motion.csv",
  icons: "icons.csv",
  app: "app-interface.csv",
  performance: "react-performance.csv",
};

const counts = {};
for (const [domain, file] of Object.entries(DOMAINS)) {
  const records = load(join(src, file));
  counts[domain] = records.length;
  writeFileSync(join(out, `${domain}.json`), JSON.stringify(records) + "\n");
}
const stacks = readdirSync(join(src, "stacks"))
  .filter((f) => f.endsWith(".csv"))
  .flatMap((f) => load(join(src, "stacks", f)).map((r) => ({ stack: basename(f, ".csv"), ...r })));
counts.stacks = stacks.length;
writeFileSync(join(out, "stacks.json"), JSON.stringify(stacks) + "\n");
console.log(counts);
