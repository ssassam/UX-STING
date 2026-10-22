import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Usage: node add-shebang.mjs [file] — defaults to the ux-sting CLI entry.
const file = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : new URL("../dist/index.js", import.meta.url);
const content = readFileSync(file, "utf8");
if (!content.startsWith("#!")) writeFileSync(file, `#!/usr/bin/env node\n${content}`);
chmodSync(file, 0o755);
