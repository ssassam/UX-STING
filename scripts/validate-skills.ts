/**
 * Checks every `.claude/skills/<name>/SKILL.md` against the Agent Skills spec
 * (https://agentskills.io/specification), because `npx skills add` installs
 * these folders into other agents:
 *
 *   - the file starts with a `---` frontmatter block that closes with `---`
 *   - name: required, 1–64 chars, lowercase letters, digits and single
 *     hyphens, no leading or trailing hyphen, equal to the folder name
 *   - description: required, non-empty, at most 1024 chars
 *   - compatibility: optional, 1–500 chars when present
 *
 * Usage: node scripts/validate-skills.ts [skills-dir]
 * Exits 1 if any skill is invalid.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dir = process.argv[2] ?? join(root, ".claude/skills");

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LIMITS = { name: 64, description: 1024, compatibility: 500 } as const;

/**
 * Reads the top-level `key: value` pairs of a frontmatter block. Values may be
 * plain or quoted; indented lines (nested maps such as `metadata:`) are
 * skipped. Block scalars (`>` / `|`) are folded into one line.
 */
function frontmatter(text: string): Record<string, string> | string {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return "file must start with a '---' frontmatter line";
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (end < 0) return "frontmatter is missing its closing '---' line";

  const out: Record<string, string> = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i]!;
    if (!line.trim() || line.trimStart().startsWith("#") || /^\s/.test(line)) continue;
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) return `line ${i + 1} is not a 'key: value' field`;
    let value = m[2]!.trim();
    if (value === ">" || value === "|" || /^[>|][-+]?$/.test(value)) {
      const block: string[] = [];
      while (i + 1 < end && (/^\s/.test(lines[i + 1]!) || !lines[i + 1]!.trim()))
        block.push(lines[++i]!.trim());
      value = block.filter(Boolean).join(value.startsWith("|") ? "\n" : " ");
    } else if (/^".*"$/.test(value)) {
      try {
        value = JSON.parse(value) as string;
      } catch {
        return `'${m[1]}' is not a valid double-quoted string`;
      }
    } else if (/^'.*'$/.test(value)) {
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    out[m[1]!] = value;
  }
  return out;
}

function check(folder: string): string[] {
  const file = join(dir, folder, "SKILL.md");
  if (!existsSync(file)) return ["SKILL.md is missing"];
  const data = frontmatter(readFileSync(file, "utf8"));
  if (typeof data === "string") return [data];

  const problems: string[] = [];
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = data[field];
    if (value === undefined) {
      if (field !== "compatibility") problems.push(`'${field}' is required`);
      continue;
    }
    if (!value.trim()) problems.push(`'${field}' is empty`);
    else if (value.length > max) problems.push(`'${field}' is ${value.length} chars (max ${max})`);
  }
  const name = data.name;
  if (name) {
    if (!NAME.test(name))
      problems.push(
        `name '${name}' must use lowercase letters, digits and single hyphens, with no hyphen at either end`,
      );
    if (name !== folder) problems.push(`name '${name}' must match its folder '${folder}'`);
  }
  return problems;
}

if (!existsSync(dir)) {
  console.error(`No skills folder at ${dir}`);
  process.exit(1);
}
const folders = readdirSync(dir)
  .filter((f) => statSync(join(dir, f)).isDirectory())
  .sort();
let failed = 0;
for (const folder of folders) {
  const problems = check(folder);
  if (problems.length) {
    failed++;
    console.error(`✗ ${relative(root, join(dir, folder))}`);
    for (const p of problems) console.error(`    ${p}`);
  } else console.log(`✓ ${folder}`);
}
console.log(`\n${folders.length - failed}/${folders.length} skills valid.`);
process.exit(failed ? 1 : 0);
