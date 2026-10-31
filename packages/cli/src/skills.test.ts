import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectHosts, HOSTS, installSkills, listSkills, resolveHosts } from "./skills.js";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "ux-sting-skills-"));
  const source = join(root, "source");
  for (const name of ["ux-sting", "ux-sting-review"]) {
    mkdirSync(join(source, name, "references"), { recursive: true });
    writeFileSync(
      join(source, name, "SKILL.md"),
      `---\nname: ${name}\ndescription: "Does ${name} things."\n---\n\n# ${name}\n`,
    );
    writeFileSync(join(source, name, "references", "a.md"), "ref");
  }
  const cwd = join(root, "project");
  mkdirSync(cwd);
  return { root, source, cwd };
}

describe("skills installer", () => {
  it("lists bundled skills with their descriptions", () => {
    const { source } = fixture();
    expect(listSkills(source)).toEqual([
      { name: "ux-sting", description: "Does ux-sting things." },
      { name: "ux-sting-review", description: "Does ux-sting-review things." },
    ]);
  });

  it("knows 20+ AI tools with unique ids", () => {
    expect(HOSTS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(HOSTS.map((h) => h.id)).size).toBe(HOSTS.length);
  });

  it("installs skill folders for a chosen tool", () => {
    const { source, cwd } = fixture();
    const [r] = installSkills({ cwd, source, ai: ["cursor"] });
    expect(r!.dir).toBe(join(cwd, ".cursor", "skills"));
    expect(existsSync(join(cwd, ".cursor/skills/ux-sting/SKILL.md"))).toBe(true);
    expect(existsSync(join(cwd, ".cursor/skills/ux-sting-review/references/a.md"))).toBe(true);
  });

  it("auto-detects tools from their folders, defaulting to claude + universal", () => {
    const { cwd } = fixture();
    expect(detectHosts(cwd).map((h) => h.id)).toEqual(["claude", "universal"]);
    mkdirSync(join(cwd, ".windsurf"));
    mkdirSync(join(cwd, ".github"));
    expect(detectHosts(cwd).map((h) => h.id)).toEqual(["windsurf"]);
  });

  it("writes shared folders once and keeps existing skills unless forced", () => {
    const { source, cwd } = fixture();
    const first = installSkills({ cwd, source, ai: ["codex", "universal"] });
    expect(first).toHaveLength(1);
    writeFileSync(join(cwd, ".agents/skills/ux-sting/SKILL.md"), "mine");
    const again = installSkills({ cwd, source, ai: ["codex"] });
    expect(again[0]!.skipped).toEqual(["ux-sting", "ux-sting-review"]);
    expect(readFileSync(join(cwd, ".agents/skills/ux-sting/SKILL.md"), "utf8")).toBe("mine");
    installSkills({ cwd, source, ai: ["codex"], force: true, only: ["ux-sting"] });
    expect(readFileSync(join(cwd, ".agents/skills/ux-sting/SKILL.md"), "utf8")).toContain(
      "# ux-sting",
    );
  });

  it("writes a rules index for rules-file tools and supports --global", () => {
    const { source, cwd, root } = fixture();
    installSkills({ cwd, source, ai: ["amazonq"] });
    expect(readFileSync(join(cwd, ".amazonq/rules/ux-sting.md"), "utf8")).toContain(
      "`../skills/ux-sting/SKILL.md`",
    );
    const home = join(root, "home");
    const [g] = installSkills({ cwd, source, ai: ["copilot"], global: true, home });
    expect(g!.dir).toBe(join(home, ".copilot", "skills"));
  });

  it("rejects unknown tools and skills", () => {
    const { source, cwd } = fixture();
    expect(() => resolveHosts(["nope"], cwd)).toThrow(/Unknown AI tool/);
    expect(() => installSkills({ cwd, source, ai: ["claude"], only: ["x"] })).toThrow(
      /Unknown skill/,
    );
  });
});
