// Bundle the repo's Agent Skills (.claude/skills) into the package for `ux-sting skills add`.
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "../../../.claude/skills");
const dest = join(here, "../skills");
if (!existsSync(src)) throw new Error(`skills source missing: ${src}`);
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true, filter: (p) => !/__pycache__|\.pyc$/.test(p) });
console.log(`copied skills → ${dest}`);
