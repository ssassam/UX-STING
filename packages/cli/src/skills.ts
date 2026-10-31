import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bold, dim, green, log } from "./log.js";

/**
 * Where each AI coding tool reads Agent Skills (`<name>/SKILL.md` folders).
 * `rules` hosts read one Markdown file instead; the skill folders go beside it
 * and the rules file indexes them.
 */
export interface Host {
  id: string;
  name: string;
  /** Project-relative root folder, also used to auto-detect the tool. */
  root: string;
  /** Skills folder inside `root`. */
  skills: string;
  /** Root under the home directory for `--global`, when it differs. */
  globalRoot?: string;
  /** For rules-file hosts: path inside `root` of the index file. */
  rules?: string;
}

export const HOSTS: Host[] = [
  { id: "claude", name: "Claude Code", root: ".claude", skills: "skills" },
  { id: "codex", name: "OpenAI Codex", root: ".agents", skills: "skills", globalRoot: ".codex" },
  { id: "cursor", name: "Cursor", root: ".cursor", skills: "skills" },
  {
    id: "copilot",
    name: "GitHub Copilot / VS Code",
    root: ".github",
    skills: "skills",
    globalRoot: ".copilot",
  },
  { id: "gemini", name: "Gemini CLI", root: ".gemini", skills: "skills" },
  { id: "windsurf", name: "Windsurf", root: ".windsurf", skills: "skills" },
  { id: "kiro", name: "Kiro", root: ".kiro", skills: "steering" },
  { id: "roocode", name: "Roo Code", root: ".roo", skills: "skills" },
  { id: "kilocode", name: "Kilo Code", root: ".kilocode", skills: "skills" },
  { id: "trae", name: "Trae", root: ".trae", skills: "skills" },
  { id: "qoder", name: "Qoder", root: ".qoder", skills: "skills" },
  { id: "opencode", name: "OpenCode", root: ".opencode", skills: "skills" },
  { id: "continue", name: "Continue", root: ".continue", skills: "skills" },
  { id: "augment", name: "Augment", root: ".augment", skills: "skills" },
  { id: "warp", name: "Warp", root: ".warp", skills: "skills" },
  { id: "droid", name: "Droid (Factory)", root: ".factory", skills: "skills" },
  { id: "codebuddy", name: "CodeBuddy", root: ".codebuddy", skills: "skills" },
  { id: "kimi", name: "Kimi Code", root: ".kimi-code", skills: "skills" },
  { id: "zcode", name: "ZCode", root: ".zcode", skills: "skills" },
  { id: "codewhale", name: "CodeWhale", root: ".codewhale", skills: "skills" },
  { id: "antigravity", name: "Antigravity", root: ".agents", skills: "skills" },
  { id: "openclaw", name: "OpenClaw", root: ".agents", skills: "skills" },
  {
    id: "amazonq",
    name: "Amazon Q Developer",
    root: ".amazonq",
    skills: "skills",
    rules: "rules/ux-sting.md",
  },
  { id: "universal", name: "Agent Skills standard", root: ".agents", skills: "skills" },
];

/** Skills bundled with the CLI at build time (`scripts/copy-skills.mjs`). */
export function bundledSkills(): string {
  const url = new URL("../skills/", import.meta.url);
  // Browser-like test environments serve modules over http; map back to disk.
  return url.protocol === "file:" ? fileURLToPath(url) : join(process.cwd(), url.pathname);
}

export interface SkillsOptions {
  cwd: string;
  /** Host ids, "all", or empty to auto-detect. */
  ai?: string[];
  global?: boolean;
  force?: boolean;
  /** Only these skills (default: all bundled). */
  only?: string[];
  source?: string;
  home?: string;
}

export interface Installed {
  host: Host;
  dir: string;
  skills: string[];
  skipped: string[];
}

export function listSkills(source = bundledSkills()): { name: string; description: string }[] {
  if (!existsSync(source)) return [];
  return readdirSync(source, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(source, d.name, "SKILL.md")))
    .map((d) => {
      const md = readFileSync(join(source, d.name, "SKILL.md"), "utf8");
      const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md)?.[1] ?? "";
      const description =
        /^\s*description:\s*(.+?)\s*$/m.exec(block)?.[1]?.replace(/^["']|["']$/g, "") ?? "";
      return { name: d.name, description };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Hosts whose folder already exists in the project; Claude + the open standard otherwise. */
export function detectHosts(cwd: string): Host[] {
  const found = HOSTS.filter(
    (h) =>
      !["universal", "openclaw", "antigravity"].includes(h.id) && existsSync(join(cwd, h.root)),
  );
  // `.github` exists in most repos; only count it with Copilot's own files.
  const real = found.filter(
    (h) =>
      h.id !== "copilot" ||
      existsSync(join(cwd, ".github", "copilot-instructions.md")) ||
      existsSync(join(cwd, ".github", "skills")),
  );
  return real.length ? real : HOSTS.filter((h) => h.id === "claude" || h.id === "universal");
}

export function resolveHosts(ai: string[] | undefined, cwd: string): Host[] {
  if (!ai?.length || ai.includes("auto")) return detectHosts(cwd);
  if (ai.includes("all")) return HOSTS;
  return ai.map((id) => {
    const host = HOSTS.find((h) => h.id === id.toLowerCase());
    if (!host)
      throw new Error(`Unknown AI tool "${id}". Known: ${HOSTS.map((h) => h.id).join(", ")}.`);
    return host;
  });
}

export function installSkills(options: SkillsOptions): Installed[] {
  const source = options.source ?? bundledSkills();
  const available = listSkills(source);
  if (!available.length) throw new Error(`No bundled skills found at ${source}.`);
  const names = options.only?.length
    ? options.only.map((n) => {
        if (!available.some((s) => s.name === n)) throw new Error(`Unknown skill "${n}".`);
        return n;
      })
    : available.map((s) => s.name);
  const base = options.global ? (options.home ?? homedir()) : options.cwd;
  const seen = new Set<string>();
  const results: Installed[] = [];
  for (const host of resolveHosts(options.ai, options.cwd)) {
    const root = join(base, options.global ? (host.globalRoot ?? host.root) : host.root);
    const dir = join(root, host.skills);
    // Several hosts share `.agents/skills`; write it once.
    if (seen.has(dir)) continue;
    seen.add(dir);
    const result: Installed = { host, dir, skills: [], skipped: [] };
    mkdirSync(dir, { recursive: true });
    for (const name of names) {
      const target = join(dir, name);
      if (existsSync(target) && !options.force) {
        result.skipped.push(name);
        continue;
      }
      cpSync(join(source, name), target, { recursive: true, force: true });
      result.skills.push(name);
    }
    if (host.rules) {
      const index = available
        .filter((s) => names.includes(s.name))
        .map(
          (s) =>
            `- **${s.name}** (\`${relative(dirname(join(root, host.rules!)), join(dir, s.name))}/SKILL.md\`): ${s.description}`,
        )
        .join("\n");
      mkdirSync(dirname(join(root, host.rules)), { recursive: true });
      writeFileSync(
        join(root, host.rules),
        `# UX-STING skills\n\nFor UI work, read the matching skill below before writing code and follow it.\n\n${index}\n`,
      );
    }
    results.push(result);
  }
  return results;
}

export const SKILLS_HELP = `ux-sting skills — install the UX-STING agent skills into your AI coding tool

  npx ux-sting skills [--ai <tool,…|all>] [--global] [--force] [--only <skill,…>]
  npx ux-sting skills list
  npx ux-sting init --ai <tool>          Same as \`skills --ai <tool>\`

  --ai <tools>   ${HOSTS.map((h) => h.id).join(", ")}
                 Default: the tools whose folder exists here, else claude + universal
  --global       Install under your home folder for every project
  --force        Overwrite skills that are already installed
  --only <list>  Install some skills only (e.g. ux-sting,ux-sting-review)`;

const option = (argv: string[], name: string) => {
  const i = argv.indexOf(`--${name}`);
  if (i >= 0 && argv[i + 1] && !argv[i + 1]!.startsWith("-")) return argv[i + 1];
  return argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
};
const csv = (v?: string) =>
  v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

export async function skillsCommand(argv: string[], cwd = process.cwd()): Promise<number> {
  if (argv.includes("--help") || argv.includes("-h")) {
    log.info(SKILLS_HELP);
    return 0;
  }
  if (argv[0] === "list") {
    for (const s of listSkills()) log.info(`${bold(s.name)}  ${dim(s.description.slice(0, 110))}`);
    log.info("");
    log.info(`AI tools: ${HOSTS.map((h) => h.id).join(", ")}`);
    return 0;
  }
  const results = installSkills({
    cwd,
    ai: csv(option(argv, "ai")),
    global: argv.includes("--global"),
    force: argv.includes("--force"),
    only: csv(option(argv, "only")),
  });
  for (const r of results) {
    const where = relative(cwd, r.dir) || r.dir;
    log.info(
      `${green("✔")} ${bold(r.host.name)} → ${where} ${dim(`(${r.skills.length} installed)`)}`,
    );
    if (r.skipped.length)
      log.info(dim(`  already there, kept: ${r.skipped.join(", ")} (use --force)`));
  }
  log.info("");
  log.info(
    `Next: ask your agent to ${bold('"build a landing page for <your idea> with UX-STING"')}.`,
  );
  log.info(dim('Start from an industry brief: npx ux-sting brief "<your idea>" --out src/theme'));
  return 0;
}
