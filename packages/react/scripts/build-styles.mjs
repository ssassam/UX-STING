/**
 * Builds the CSS entry points of @unified-ui/react:
 *  - dist/components.css  plain CSS (animations, layout helpers, hit areas)
 *  - dist/tailwind.css    for Tailwind v4 apps: tokens + theme + component CSS + @source
 *  - dist/styles.css      standalone, precompiled stylesheet for apps without Tailwind
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist/`;
mkdirSync(dist, { recursive: true });
copyFileSync(`${root}src/styles/components.css`, `${dist}components.css`);

writeFileSync(
  `${dist}tailwind.css`,
  `/* unified-ui for Tailwind CSS v4: @import "@unified-ui/react/tailwind.css"; after @import "tailwindcss"; */
@import "@unified-ui/tokens/tokens.css";
@import "@unified-ui/tokens/tailwind.css";
@import "@unified-ui/themes/themes.css";
@import "./components.css";
@source "./components";
`,
);

const entry = `${dist}.styles-entry.css`;
writeFileSync(
  entry,
  `@import "tailwindcss";
@import "@unified-ui/tokens/tokens.css";
@import "@unified-ui/tokens/tailwind.css";
@import "@unified-ui/themes/themes.css";
@import "./components.css";
@source "./components";
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
console.log("@unified-ui/react: wrote styles.css, tailwind.css, components.css");
