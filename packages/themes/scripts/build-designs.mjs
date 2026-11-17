import { mkdir, writeFile } from "node:fs/promises";
import { presets, themeToDesignMd } from "../dist/index.js";
const dir = new URL("../designs/", import.meta.url);
await mkdir(dir, { recursive: true });
for (const [name, theme] of Object.entries(presets))
  await writeFile(new URL(`${name}.DESIGN.md`, dir), themeToDesignMd(theme));
