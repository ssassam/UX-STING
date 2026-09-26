import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateTailwindCss, generateTokensCss } from "../dist/index.js";

const out = (file) => fileURLToPath(new URL(`../dist/${file}`, import.meta.url));

writeFileSync(out("tokens.css"), generateTokensCss());
writeFileSync(out("tailwind.css"), generateTailwindCss());
console.log("@ux-sting/tokens: wrote dist/tokens.css and dist/tailwind.css");
