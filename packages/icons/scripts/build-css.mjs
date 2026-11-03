// Copies the animated-icon stylesheet into dist (one import for consumers).
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
copyFileSync(
  new URL("../css/icon-motion.css", import.meta.url),
  fileURLToPath(new URL("../dist/icon-motion.css", import.meta.url)),
);
