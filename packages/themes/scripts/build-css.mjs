import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PRESET_NAMES, presets, themeToCss } from "../dist/index.js";

const out = (file) => fileURLToPath(new URL(`../dist/${file}`, import.meta.url));
const all = ["/* ux-sting theme presets — generated file. */"];
for (const name of PRESET_NAMES) {
  const css = themeToCss(presets[name]);
  writeFileSync(out(`${name}.css`), css + "\n");
  all.push(css);
}
writeFileSync(out("themes.css"), all.join("\n\n") + "\n");
console.log(`@ux-sting/themes: wrote ${PRESET_NAMES.length} presets`);
