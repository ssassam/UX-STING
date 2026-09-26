/**
 * Reports the minified + gzipped size of each @unified-ui/react entry point
 * (React, react-dom excluded; @unified-ui/* and Radix dependencies included),
 * plus the CSS entry points. Fails if any entry exceeds its budget.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "packages/react/dist");
const BUDGET_KB = 45;
/** Composite components that bundle several others (search, menus, pagination). */
const BUDGET_OVERRIDES: Record<string, number> = { "data-table": 60 };

const entries = readdirSync(join(dist, "components")).sort();
const rows: Array<{ name: string; min: number; gzip: number }> = [];

for (const name of entries) {
  const result = await build({
    entryPoints: [join(dist, "components", name, "index.js")],
    bundle: true,
    minify: true,
    write: false,
    format: "esm",
    platform: "browser",
    external: ["react", "react-dom", "react/jsx-runtime", "react-dom/*"],
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const code = result.outputFiles[0]!.contents;
  rows.push({ name, min: code.length, gzip: gzipSync(code).length });
}

const kb = (n: number) => (n / 1024).toFixed(1);
rows.sort((a, b) => b.gzip - a.gzip);
const lines = [
  "| Entry point | Minified | Gzipped |",
  "| --- | ---: | ---: |",
  ...rows.map((r) => `| \`@unified-ui/react/${r.name}\` | ${kb(r.min)} kB | ${kb(r.gzip)} kB |`),
];

const css = ["styles.css", "components.css"].map((f) => {
  const content = readFileSync(join(dist, f));
  return `| \`@unified-ui/react/${f}\` | ${kb(content.length)} kB | ${kb(gzipSync(content).length)} kB |`;
});

const total = rows.reduce((n, r) => n + r.gzip, 0);
const median = rows[Math.floor(rows.length / 2)]!.gzip;
const report = [
  "# Bundle size report",
  "",
  `${rows.length} component entry points. Median ${kb(median)} kB gzipped; largest ${rows[0]!.name} (${kb(rows[0]!.gzip)} kB). React/react-dom excluded; shared dependencies are counted in every entry that uses them, so real apps pay them once.`,
  "",
  ...lines,
  "",
  "## CSS",
  "",
  "| File | Raw | Gzipped |",
  "| --- | ---: | ---: |",
  ...css,
  "",
].join("\n");
writeFileSync(join(root, "docs/bundle-size.md"), report);
console.log(report.split("\n").slice(0, 3).join("\n"));
console.log(
  rows
    .slice(0, 8)
    .map((r) => `  ${r.name.padEnd(20)} ${kb(r.gzip)} kB`)
    .join("\n"),
);
console.log(`  … sum of all entries ${kb(total)} kB`);
const over = rows.filter((r) => r.gzip / 1024 > (BUDGET_OVERRIDES[r.name] ?? BUDGET_KB));
if (over.length) {
  console.error(`Over budget (${BUDGET_KB} kB): ${over.map((r) => r.name).join(", ")}`);
  process.exit(1);
}
