// Concatenates the CSS catalog into dist/motion.css (one import for everything).
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const dir = new URL("../css/", import.meta.url);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".css"))
  .sort();
const out = files
  .map((f) => `/* ── ${f} ── */\n${readFileSync(new URL(f, dir), "utf8")}`)
  .join("\n");
mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("../dist/motion.css", import.meta.url), out);
