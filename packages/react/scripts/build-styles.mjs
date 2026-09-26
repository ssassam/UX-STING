/**
 * Builds the CSS entry points of @ux-sting/react:
 *  - dist/components.css  plain CSS (animations, layout helpers, hit areas)
 *  - dist/tailwind.css    for Tailwind v4 apps: tokens + theme + component CSS + @source
 *  - dist/styles.css      standalone, precompiled stylesheet for apps without Tailwind
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist/`;
mkdirSync(dist, { recursive: true });
copyFileSync(`${root}src/styles/components.css`, `${dist}components.css`);

/*
 * Tailwind only generates classes it finds in scanned files, so every compiled
 * folder that contains class names (components, lib, provider, …) must be a
 * @source. The list is derived from dist/ so new folders are never missed.
 */
const sourceDirs = readdirSync(dist, { withFileTypes: true })
  .filter(
    (e) =>
      e.isDirectory() &&
      readdirSync(`${dist}${e.name}`, { recursive: true }).some((f) => String(f).endsWith(".js")),
  )
  .map((e) => e.name)
  .sort();
if (!sourceDirs.includes("components") || !sourceDirs.includes("lib")) {
  throw new Error(
    `@ux-sting/react: expected components/ and lib/ in dist, found ${sourceDirs.join(", ")}`,
  );
}
const sources = sourceDirs.map((d) => `@source "./${d}";`).join("\n");

writeFileSync(
  `${dist}tailwind.css`,
  `/* ux-sting for Tailwind CSS v4: @import "@ux-sting/react/tailwind.css"; after @import "tailwindcss"; */
@import "@ux-sting/tokens/tokens.css";
@import "@ux-sting/tokens/tailwind.css";
@import "@ux-sting/themes/themes.css";
@import "./components.css";
${sources}
`,
);

const entry = `${dist}.styles-entry.css`;
writeFileSync(
  entry,
  `@import "tailwindcss";
@import "@ux-sting/tokens/tokens.css";
@import "@ux-sting/tokens/tailwind.css";
@import "@ux-sting/themes/themes.css";
@import "./components.css";
${sources}
`,
);

const require = createRequire(import.meta.url);
const cli = require
  .resolve("@tailwindcss/cli/package.json")
  .replace(/package\.json$/, "dist/index.mjs");
execFileSync(process.execPath, [cli, "-i", entry, "-o", `${dist}styles.css`, "--minify"], {
  cwd: root,
  stdio: "inherit",
});
/*
 * Guard: classes that only appear in shared lib/ code (control sizes) and in
 * components must exist in the compiled CSS. A missing rule means a folder is
 * not scanned — fail the build instead of shipping unstyled controls.
 */
const css = readFileSync(`${dist}styles.css`, "utf8");
const sentinels = ["px-2.5", "px-3.5", "h-control-lg"];
const missing = sentinels.filter((c) => !css.includes(`.${c.replace(/[.:/[\]]/g, "\\$&")}`));
if (missing.length) {
  throw new Error(
    `@ux-sting/react: styles.css is missing ${missing.join(", ")} — check @source folders`,
  );
}
console.log(
  `@ux-sting/react: wrote styles.css, tailwind.css, components.css (sources: ${sourceDirs.join(", ")})`,
);
