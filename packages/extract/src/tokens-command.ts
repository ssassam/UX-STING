import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  buildDtcgDocument,
  generateScss,
  generateTailwindCss,
  generateTokensCss,
} from "@ux-sting/tokens";

type Print = (line: string) => void;

const option = (argv: string[], name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const positional = (argv: string[], valued: string[]) =>
  argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1] ?? ""));

const ALL = ["dtcg", "css", "scss", "tailwind"] as const;
type Format = (typeof ALL)[number];

export const TOKENS_HELP = `ux-sting tokens export — export the UX-STING design tokens to portable formats

  --out <dir>       Output folder (default: ux-sting-tokens)
  --format <list>   Comma list of: dtcg, css, scss, tailwind (default: all)

Writes:
  tokens.json     W3C Design Tokens (DTCG) — framework-agnostic interchange
  tokens.css      CSS custom properties (light/dark/high-contrast, densities)
  tokens.scss     SCSS variables for Sass pipelines
  tailwind.css    Tailwind CSS v4 @theme mapping

Use tokens.json to drive non-React stacks (Vue, Svelte, native, Figma, Style Dictionary).`;

/** Exports the base design tokens to one or more portable formats. */
export async function tokensCommand(argv: string[], print: Print = console.log): Promise<number> {
  const [sub] = positional(argv, ["--out", "--format"]);
  if (sub !== "export" || argv.includes("--help")) {
    print(TOKENS_HELP);
    return sub === "export" ? 0 : 1;
  }

  const requested = (option(argv, "format") ?? ALL.join(","))
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean) as Format[];
  const unknown = requested.filter((f) => !ALL.includes(f));
  if (unknown.length) {
    print(`Unknown format(s): ${unknown.join(", ")}  (choose from: ${ALL.join(", ")})`);
    return 1;
  }

  const out = resolve(option(argv, "out") ?? "ux-sting-tokens");
  mkdirSync(out, { recursive: true });

  const files: string[] = [];
  const write = (name: string, content: string) => {
    writeFileSync(join(out, name), content.endsWith("\n") ? content : content + "\n");
    files.push(name);
  };

  for (const format of requested) {
    if (format === "dtcg") write("tokens.json", JSON.stringify(buildDtcgDocument(), null, 2));
    else if (format === "css") write("tokens.css", generateTokensCss());
    else if (format === "scss") write("tokens.scss", generateScss());
    else if (format === "tailwind") write("tailwind.css", generateTailwindCss());
  }

  print(`Exported UX-STING design tokens → ${out}`);
  for (const f of files) print(`  • ${f}`);
  return 0;
}
