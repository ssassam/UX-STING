import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HOSTS, detectHosts, installSkills, resolveHosts } from "./skills.js";

const source = join(__dirname, "../../../.claude/skills");
let cwd: string;
beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "uxs-skills-"));
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("skills", () => {
  it("supports at least 24 hosts", () => {
    expect(Object.keys(HOSTS).length).toBeGreaterThanOrEqual(24);
  });

  it("detects hosts from project folders and falls back to claude + codex", () => {
    expect(resolveHosts(undefined, cwd)).toEqual(["claude", "codex"]);
    mkdirSync(join(cwd, ".cursor"));
    mkdirSync(join(cwd, ".windsurf"));
    expect(detectHosts(cwd)).toEqual(["cursor", "windsurf"]);
  });

  it("rejects unknown hosts", () => {
    expect(() => resolveHosts("cursor,nope", cwd)).toThrow(/Unknown host: nope/);
  });

  it("installs every skill into each host, shares .agents once, writes rules files", () => {
    installSkills({ cwd, ai: "cursor,codex,antigravity,amazonq", source });
    expect(existsSync(join(cwd, ".cursor/skills/ux-sting-taste/SKILL.md"))).toBe(true);
    expect(existsSync(join(cwd, ".cursor/skills/ux-sting-taste/scripts/design_data.py"))).toBe(
      true,
    );
    expect(
      existsSync(join(cwd, ".agents/skills/ux-sting-design-agent/references/stacks/vue.csv")),
    ).toBe(true);
    expect(existsSync(join(cwd, ".cursor/skills/ux-sting-slides/scripts/slide_data.py"))).toBe(
      true,
    );
    expect(
      existsSync(join(cwd, ".cursor/skills/logo-design/references/data/logo-industries.csv")),
    ).toBe(true);
    const rules = readFileSync(join(cwd, ".amazonq/rules/ux-sting.md"), "utf8");
    expect(rules).toContain("../skills/ux-sting-design-agent/SKILL.md");
  });

  it("dry-run writes nothing and remove cleans up", () => {
    installSkills({ cwd, ai: "roo", source, dryRun: true });
    expect(existsSync(join(cwd, ".roo"))).toBe(false);
    installSkills({ cwd, ai: "roo", source, only: "ux-sting-taste" });
    expect(existsSync(join(cwd, ".roo/skills/ux-sting-taste"))).toBe(true);
    expect(existsSync(join(cwd, ".roo/skills/ux-sting-review"))).toBe(false);
    installSkills({ cwd, ai: "roo", source, remove: true });
    expect(existsSync(join(cwd, ".roo/skills/ux-sting-taste"))).toBe(false);
  });
});
