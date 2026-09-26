/**
 * Static UX/a11y audit of component sources. Rejects patterns from the UX
 * quality rules (docs/ux-quality.md): raw colors, 100vh, disabled zoom,
 * emoji used as icons, outline removal without a focus replacement,
 * positive tabIndex and physical left/right utilities that break RTL.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const targets = ["packages/react/src", "packages/primitives/src"];

interface Rule {
  id: string;
  message: string;
  /** `context` is the surrounding class expression (±4 lines). */
  test: (line: string, file: string, context: string) => boolean;
}

/** Elements that only receive programmatic focus (Radix content, tabIndex -1) may drop the outline. */
const FOCUS_REPLACEMENT =
  /focus-visible|focus-within|has-\[:focus-visible\]|has-\[a:focus-visible\]|data-highlighted|focusRing|Primitive\.Content|tabIndex=\{-1\}|role="grid"|\[&:focus-visible/;

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

const rules: Rule[] = [
  {
    id: "raw-color",
    message: "Use semantic tokens instead of raw colors (hex/rgb/hsl).",
    test: (l) =>
      /#[0-9a-fA-F]{3,8}\b(?![\w-])|\brgba?\(|\bhsla?\(/.test(l) &&
      !/\/\/|\*/.test(l.trim().slice(0, 2)) &&
      !l.includes("url(#"),
  },
  {
    id: "viewport-height",
    message: "Use dvh units instead of 100vh (mobile browser chrome).",
    test: (l) => /100vh|h-screen\b/.test(l),
  },
  {
    id: "disable-zoom",
    message: "Never disable zoom (user-scalable / maximum-scale).",
    test: (l) => /user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/.test(l),
  },
  {
    id: "emoji-icon",
    message: "Use SVG icons from @unified-ui/icons, not emoji.",
    test: (l, f) => EMOJI.test(l) && !f.includes("messages"),
  },
  {
    id: "outline-removed",
    message:
      "outline-none requires a visible focus replacement (focus-visible:ring or focus-within).",
    test: (l, _f, ctx) => /\boutline-none\b/.test(l) && !FOCUS_REPLACEMENT.test(ctx),
  },
  {
    id: "positive-tabindex",
    message: "Positive tabIndex breaks focus order.",
    test: (l) => /tabIndex=\{[1-9]/.test(l),
  },
  {
    id: "physical-direction",
    message: "Use logical utilities (ms/me/ps/pe/start/end/text-start) so layouts mirror in RTL.",
    test: (l) =>
      /(["'\s])(ml|mr|pl|pr|left|right|text-left|text-right|border-l|border-r|rounded-l|rounded-r)-[\w[(]/.test(
        l,
      ) && !l.includes("eslint"),
  },
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|css)$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry) ? [full] : [];
  });
}

let problems = 0;
for (const target of targets) {
  for (const file of walk(join(root, target))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (line.includes("ux-audit-ignore") || lines[i - 1]?.includes("ux-audit-ignore")) return;
      for (const rule of rules) {
        const context = lines.slice(Math.max(0, i - 4), i + 5).join("\n");
        if (rule.test(line, file, context)) {
          problems++;
          console.log(`${relative(root, file)}:${i + 1}  ${rule.id}  ${rule.message}`);
        }
      }
    });
  }
}
console.log(problems ? `\n✖ ${problems} UX audit problem(s)` : "✔ UX audit passed");
process.exit(problems ? 1 : 0);
