import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { add, diff, init } from "./commands.js";
import { parseArgs } from "./index.js";
import { loadRegistry, resolveItems } from "./registry.js";
import { transformSource } from "./transform.js";

let cwd: string;
const registry = join(__dirname, "../registry.json");

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "uui-"));
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name: "app", dependencies: { "@unified-ui/utils": "^0.1.0" } }),
  );
  writeFileSync(join(cwd, "globals.css"), '@import "tailwindcss";\nbody {}\n');
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("cli", () => {
  it("parses arguments", () => {
    expect(
      parseArgs(["add", "button", "card", "--overwrite", "--dir", "ui", "--no-install"]),
    ).toEqual({
      command: "add",
      args: ["button", "card"],
      flags: { overwrite: true, dir: "ui", install: false },
    });
  });

  it("resolves transitive registry dependencies in order", async () => {
    const reg = await loadRegistry(registry);
    const names = resolveItems(reg, ["combobox"]).map((i) => i.name);
    expect(names).toContain("command");
    expect(names.indexOf("command")).toBeLessThan(names.indexOf("combobox"));
    expect(() => resolveItems(reg, ["buton"])).toThrow(/Unknown component/);
  });

  it("strips .js from relative imports", () => {
    expect(
      transformSource('import { a } from "./a.js";\nimport x from "@unified-ui/utils";', {
        importExtensions: false,
      }),
    ).toBe('import { a } from "./a";\nimport x from "@unified-ui/utils";');
  });

  it("init writes config, provider, styles and css imports", async () => {
    await init({ cwd, css: "globals.css", dir: "components/ui", install: false, registry });
    expect(JSON.parse(readFileSync(join(cwd, "unified-ui.json"), "utf8")).dir).toBe(
      "components/ui",
    );
    expect(existsSync(join(cwd, "components/ui/provider/ui-provider.tsx"))).toBe(true);
    const css = readFileSync(join(cwd, "globals.css"), "utf8");
    expect(css).toMatch(/@import "tailwindcss";\n\/\* unified-ui \*\//);
    expect(css).toContain('@import "./components/ui/styles/unified-ui.css";');
  });

  it("add copies components with dependencies and protects local edits", async () => {
    await init({ cwd, css: "globals.css", dir: "components/ui", install: false, registry });
    const result = await add(["dialog"], { cwd, install: false, registry });
    const dialog = join(cwd, "components/ui/components/dialog/dialog.tsx");
    expect(existsSync(dialog)).toBe(true);
    expect(existsSync(join(cwd, "components/ui/lib/overlay.tsx"))).toBe(true);
    expect(readFileSync(dialog, "utf8")).not.toMatch(/from "\.\.?\/[^"]+\.js"/);
    expect(result.dependencies).toContain("@radix-ui/react-dialog@^1.1.23");
    expect(result.dependencies.some((d) => d.startsWith("@unified-ui/utils"))).toBe(false);

    writeFileSync(dialog, readFileSync(dialog, "utf8") + "\n// my change\n");
    const again = await add(["dialog"], { cwd, install: false, registry });
    expect(again.skipped).toContain("components/ui/components/dialog/dialog.tsx");
    expect(readFileSync(dialog, "utf8")).toContain("// my change");

    const entries = await diff(["dialog"], { cwd, registry });
    expect(entries.find((e) => e.file.endsWith("dialog.tsx"))?.status).toBe("modified");

    await add(["dialog"], { cwd, install: false, registry, overwrite: true });
    expect(readFileSync(dialog, "utf8")).not.toContain("// my change");
  });

  it("fails clearly without config", async () => {
    await expect(add(["button"], { cwd, install: false, registry })).rejects.toThrow(/init/);
  });
});
