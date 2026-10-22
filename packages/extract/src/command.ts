import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { createTheme, themeToCss } from "@ux-sting/themes";
import { dnaFromDtcg, nearestPresets } from "./dna.js";
import type { DtcgDocument } from "./dtcg.js";
import { extractUrl } from "./run.js";
import { dtcgToTheme, hexOf } from "./theme.js";
import { EXT } from "./tokens.js";

type Print = (line: string) => void;

const option = (argv: string[], name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const allowHosts = (argv: string[]) =>
  argv.flatMap((a, i) => (argv[i - 1] === "--allow-host" ? [a] : []));
const positional = (argv: string[], valued: string[]) =>
  argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1] ?? ""));

export const EXTRACT_HELP = `ux-sting extract <url> — measure a live page into W3C DTCG tokens

  --out <dir>           Output folder (default: ux-sting-extract)
  --width <px>          Viewport width (default 1440)
  --dark                Render with prefers-color-scheme: dark
  --allow-host <h:p>    Extra private host:port subrequests may reach

Writes tokens.json (DTCG 2025.10) and extraction.json (raw measurements).
Then: ux-sting theme import <out>/tokens.json`;

export async function extractCommand(argv: string[], print: Print = console.log): Promise<number> {
  const [url] = positional(argv, ["--out", "--width", "--allow-host"]);
  if (!url || argv.includes("--help")) {
    print(EXTRACT_HELP);
    return url ? 0 : 1;
  }
  const out = resolve(option(argv, "out") ?? "ux-sting-extract");
  const { raw, tokens } = await extractUrl(url, {
    width: Number(option(argv, "width")) || 1440,
    allowHosts: allowHosts(argv),
    colorScheme: argv.includes("--dark") ? "dark" : "light",
  });
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
  writeFileSync(join(out, "extraction.json"), JSON.stringify(raw, null, 2) + "\n");
  const meta = (tokens.$extensions as Record<string, { missing: string[]; scheme: string }>)[EXT]!;
  const color = tokens.color as Record<
    string,
    { $value?: { hex: string }; $extensions?: Record<string, { source: string }> }
  >;
  print(`Extracted ${url} (${meta.scheme})`);
  print("");
  print("| Role | Value | Source |");
  print("| --- | --- | --- |");
  for (const [role, t] of Object.entries(color))
    if (t.$value?.hex)
      print(`| ${role} | ${t.$value.hex} | ${t.$extensions?.[EXT]?.source ?? "—"} |`);
  print("");
  print(
    `Fonts: ${
      [...new Set(raw.fonts.map((f) => f.stack.split(",")[0]))].slice(0, 3).join(" · ") || "—"
    }`,
  );
  print(
    `Type: body ${raw.body?.sizePx ?? "—"}px, h1 ${raw.headings.h1?.sizePx ?? "—"}px · radius ${raw.radii[0]?.px ?? "—"}px · motion ${raw.motion.transitions[0]?.durationMs ?? "—"}ms · breakpoints ${[...new Set([...raw.breakpoints.minWidth, ...raw.breakpoints.maxWidth])].sort((a, b) => a - b).join("/") || "—"}`,
  );
  if (meta.missing.length)
    print(`Not measured (left out, not guessed): ${meta.missing.join(", ")}`);
  print(`Wrote ${join(out, "tokens.json")}`);
  return 0;
}

export const THEME_HELP = `ux-sting theme import <tokens.json> — DTCG tokens → UX-STING theme

  --name <name>     Theme name (default: from the file)
  --out <dir>       Output folder (default: current directory)

Accepts DTCG from UX-STING's extractor, designlang, Figma or Style Dictionary.
Writes <name>.theme.json (createTheme config), <name>.theme.ts and <name>.css.`;

export async function themeCommand(argv: string[], print: Print = console.log): Promise<number> {
  const [sub, file] = positional(argv, ["--name", "--out"]);
  if (sub !== "import" || !file || argv.includes("--help")) {
    print(THEME_HELP);
    return sub === "import" && file ? 0 : 1;
  }
  const doc = JSON.parse(readFileSync(file, "utf8")) as DtcgDocument;
  const named = option(argv, "name") ?? fileName(file);
  const result = dtcgToTheme(doc, named === "imported" ? {} : { name: named });
  const { config } = result;
  const out = resolve(option(argv, "out") ?? ".");
  mkdirSync(out, { recursive: true });
  const json = JSON.stringify(config, null, 2);
  writeFileSync(join(out, `${config.name}.theme.json`), json + "\n");
  const id = config.name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
  writeFileSync(
    join(out, `${config.name}.theme.ts`),
    `import { createTheme, type ThemeConfig } from "@ux-sting/themes";\n\n// Imported from ${basename(file)} by \`ux-sting theme import\`.\nexport const ${id}Config = ${json} satisfies ThemeConfig;\n\nexport const ${id} = createTheme(${id}Config);\n`,
  );
  writeFileSync(join(out, `${config.name}.css`), themeToCss(createTheme(config)) + "\n");

  print(`Theme "${config.name}" (${result.scheme} source)`);
  print("");
  print("| Token | Value | From |");
  print("| --- | --- | --- |");
  for (const m of result.mapping.filter((x) => x.source !== "derived"))
    print(
      `| ${m.role} | ${m.value} (${hexOf(m.value)}) | ${m.path ?? "—"}${m.source === "adjusted" ? " · adjusted for AA" : ""} |`,
    );
  for (const a of result.adjustments)
    print(`Adjusted ${a.changed}: ${a.pair.join(" / ")} ${a.before}:1 → ${a.after}:1`);
  if (result.missing.length)
    print(`Not in the file (UX-STING defaults apply): ${result.missing.join(", ")}`);
  print(`Wrote ${join(out, `${config.name}.theme.ts`)}, .theme.json and .css`);
  print(
    `Use: <UIProvider theme={${id}}> or import "${config.name}.css" and set data-ui-theme="${config.name}".`,
  );
  return 0;
}

export const DNA_HELP = `ux-sting dna <url|tokens.json> — design feature vector + nearest UX-STING preset

  --json                Print JSON
  --allow-host <h:p>    Extra private host:port subrequests may reach

Missing measurements stay null and are skipped in matching.`;

export async function dnaCommand(argv: string[], print: Print = console.log): Promise<number> {
  const [target] = positional(argv, ["--allow-host"]);
  if (!target || argv.includes("--help")) {
    print(DNA_HELP);
    return target ? 0 : 1;
  }
  const doc = /^https?:\/\//i.test(target)
    ? (await extractUrl(target, { allowHosts: allowHosts(argv) })).tokens
    : (JSON.parse(readFileSync(target, "utf8")) as DtcgDocument);
  const vector = dnaFromDtcg(doc);
  const matches = nearestPresets(vector);
  if (argv.includes("--json")) {
    print(JSON.stringify({ target, vector, matches }, null, 2));
    return 0;
  }
  print(`DNA — ${target}`);
  print("");
  print("| Feature | Value |");
  print("| --- | --- |");
  for (const [k, v] of Object.entries(vector)) print(`| ${k} | ${v ?? "— (not measured)"} |`);
  print("");
  print("| Nearest preset | Distance | Compared on |");
  print("| --- | --- | --- |");
  for (const m of matches) print(`| ${m.preset} | ${m.distance} | ${m.compared.length} features |`);
  return 0;
}

const fileName = (file: string) =>
  basename(file)
    .replace(/(\.tokens)?\.json$/i, "")
    .replace(/^tokens$/, "imported");
