import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bold, dim, log } from "./log.js";

/** Where each AI coding host reads Agent Skills (project root, or home with --global). */
export interface Host {
  name: string;
  /** Skills folder relative to the project (or home) root; each skill lands in `<dir>/<skill>/`. */
  dir: string;
  /** Different folder under the home directory for --global, when the host uses one. */
  globalDir?: string;
  /** Rules file that points the host at the skills, for hosts without native skill loading. */
  rules?: string;
}

export const HOSTS: Record<string, Host> = {
  claude: { name: "Claude Code", dir: ".claude/skills" },
  codex: { name: "OpenAI Codex", dir: ".agents/skills", globalDir: ".codex/skills" },
  cursor: { name: "Cursor", dir: ".cursor/skills" },
  windsurf: { name: "Windsurf", dir: ".windsurf/skills" },
  copilot: {
    name: "GitHub Copilot / VS Code",
    dir: ".github/skills",
    globalDir: ".copilot/skills",
  },
  gemini: { name: "Gemini CLI", dir: ".gemini/skills" },
  antigravity: { name: "Antigravity", dir: ".agents/skills" },
  qoder: { name: "Qoder", dir: ".qoder/skills" },
  kiro: { name: "Kiro", dir: ".kiro/steering" },
  roo: { name: "Roo Code", dir: ".roo/skills" },
  kilocode: { name: "KiloCode", dir: ".kilocode/skills" },
  cline: { name: "Cline", dir: ".cline/skills", rules: ".clinerules/ux-sting.md" },
  continue: { name: "Continue", dir: ".continue/skills" },
  opencode: { name: "OpenCode", dir: ".opencode/skills" },
  trae: { name: "Trae", dir: ".trae/skills" },
  augment: { name: "Augment", dir: ".augment/skills" },
  codebuddy: { name: "CodeBuddy", dir: ".codebuddy/skills" },
  warp: { name: "Warp", dir: ".warp/skills" },
  droid: { name: "Droid (Factory)", dir: ".factory/skills" },
  amazonq: {
    name: "Amazon Q Developer",
    dir: ".amazonq/skills",
    rules: ".amazonq/rules/ux-sting.md",
  },
  kimi: { name: "Kimi Code", dir: ".kimi-code/skills" },
  zcode: { name: "ZCode", dir: ".zcode/skills" },
  codewhale: { name: "CodeWhale", dir: ".codewhale/skills" },
  openclaw: { name: "OpenClaw", dir: ".agents/skills" },
};

/** Folders whose presence in a project suggests that host is in use. */
const DETECT: Record<string, string[]> = {
  claude: [".claude", "CLAUDE.md"],
  codex: [".codex", ".agents"],
  cursor: [".cursor", ".cursorrules"],
  windsurf: [".windsurf", ".windsurfrules"],
  copilot: [".github/copilot-instructions.md", ".github/skills"],
  gemini: [".gemini", "GEMINI.md"],
  qoder: [".qoder"],
  kiro: [".kiro"],
  roo: [".roo", ".roomodes"],
  kilocode: [".kilocode"],
  cline: [".clinerules", ".cline"],
  continue: [".continue"],
  opencode: [".opencode", "opencode.json"],
  trae: [".trae"],
  augment: [".augment"],
  codebuddy: [".codebuddy"],
  warp: [".warp"],
  droid: [".factory"],
  amazonq: [".amazonq"],
  kimi: [".kimi-code"],
  zcode: [".zcode"],
  codewhale: [".codewhale"],
};

export interface SkillsOptions {
  cwd: string;
  ai?: string;
  global?: boolean;
  dryRun?: boolean;
  only?: string;
  remove?: boolean;
  /** Override the bundled skills folder (tests). */
  source?: string;
}

export function bundledSkillsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [join(here, "../skills"), join(here, "../../../.claude/skills")]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("Bundled skills not found; reinstall ux-sting.");
}

export function detectHosts(cwd: string): string[] {
  return Object.keys(DETECT).filter((id) => DETECT[id]!.some((p) => existsSync(join(cwd, p))));
}

export function resolveHosts(ai: string | undefined, cwd: string): string[] {
  if (!ai || ai === "auto") {
    const found = detectHosts(cwd);
    return found.length ? found : ["claude", "codex"];
  }
  const ids = ai === "all" ? Object.keys(HOSTS) : ai.split(",").map((s) => s.trim().toLowerCase());
  const unknown = ids.filter((id) => !HOSTS[id]);
  if (unknown.length)
    throw new Error(`Unknown host: ${unknown.join(", ")}. Known: ${Object.keys(HOSTS).join(", ")}`);
  return ids;
}

function rulesBody(skills: string[], dir: string): string {
  return `# UX-STING design skills\n\nFor any UI or visual design task, read the matching skill before you start and follow it:\n\n${skills
    .map((s) => `- \`${dir}/${s}/SKILL.md\``)
    .join(
      "\n",
    )}\n\nStart with \`${dir}/ux-sting-design-agent/SKILL.md\`: it detects the stack and routes the task.\n`;
}

/** Copy (or remove) the bundled UX-STING skills into each host's skills folder. Returns written paths. */
export function installSkills(opts: SkillsOptions): string[] {
  const source = opts.source ?? bundledSkillsDir();
  let skills = readdirSync(source, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(source, d.name, "SKILL.md")))
    .map((d) => d.name);
  if (opts.only) {
    const want = opts.only.split(",").map((s) => s.trim());
    skills = skills.filter((s) => want.includes(s));
    if (!skills.length) throw new Error(`No bundled skill matches --only ${opts.only}`);
  }
  const root = opts.global ? homedir() : opts.cwd;
  const written: string[] = [];
  const seen = new Set<string>();
  for (const id of resolveHosts(opts.ai, opts.cwd)) {
    const host = HOSTS[id]!;
    const dir = opts.global && host.globalDir ? host.globalDir : host.dir;
    if (seen.has(dir)) continue; // codex / antigravity / openclaw share .agents/skills
    seen.add(dir);
    for (const skill of skills) {
      const dest = join(root, dir, skill);
      written.push(dest);
      if (opts.dryRun) continue;
      rmSync(dest, { recursive: true, force: true });
      if (!opts.remove) {
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(join(source, skill), dest, {
          recursive: true,
          filter: (src) => !/__pycache__|\.pyc$/.test(src),
        });
      }
    }
    if (host.rules) {
      const file = join(root, host.rules);
      written.push(file);
      if (!opts.dryRun) {
        if (opts.remove) rmSync(file, { force: true });
        else {
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(
            file,
            rulesBody(skills, relative(dirname(file), join(root, dir)).replace(/\\/g, "/")),
          );
        }
      }
    }
    const verb = opts.remove ? "Removed" : opts.dryRun ? "Would install" : "Installed";
    log.success(
      `${verb} ${skills.length} skills for ${bold(host.name)} ${dim(`→ ${join(opts.global ? "~" : ".", dir)}`)}`,
    );
  }
  return written;
}

export function listHosts(cwd: string): void {
  const detected = new Set(detectHosts(cwd));
  log.info(bold(`${Object.keys(HOSTS).length} supported hosts`));
  for (const [id, h] of Object.entries(HOSTS)) {
    log.info(
      `  ${id.padEnd(12)} ${h.name.padEnd(26)} ${dim(h.dir)}${detected.has(id) ? "  ← detected" : ""}`,
    );
  }
}
