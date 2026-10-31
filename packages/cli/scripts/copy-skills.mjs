// Bundles the repository's agent skills (.claude/skills, the source of truth)
// into the published CLI so `ux-sting skills --ai <tool>` works offline.
import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../../.claude/skills/", import.meta.url));
const out = fileURLToPath(new URL("../skills/", import.meta.url));
if (!existsSync(src)) throw new Error(`Skills source missing: ${src}`);
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });
console.log("Bundled agent skills into packages/cli/skills");
