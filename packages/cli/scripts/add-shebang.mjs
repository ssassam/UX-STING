import { chmodSync, readFileSync, writeFileSync } from "node:fs";

const file = new URL("../dist/index.js", import.meta.url);
const content = readFileSync(file, "utf8");
if (!content.startsWith("#!")) writeFileSync(file, `#!/usr/bin/env node\n${content}`);
chmodSync(file, 0o755);
