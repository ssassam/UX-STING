import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readLock } from "./config.js";
import { eject, rewriteAppImports, rewriteEjectedImports, update } from "./eject.js";

let cwd: string;
const registry = join(__dirname, "../registry.json");

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "uui-eject-"));
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "app" }));
  mkdirSync(join(cwd, "src/app"), { recursive: true });
  writeFileSync(
    join(cwd, "src/app/page.tsx"),
    [
      'import { Button, Combobox, type ComboboxOption } from "@ux-sting/react";',
      'import { Combobox as Picker } from "@ux-sting/react/combobox";',
      'import { Card } from "@ux-sting/react/card";',
      "export const x = [Button, Combobox, Picker, Card];",
      "",
    ].join("\n"),
  );
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("rewriteEjectedImports", () => {
  it("keeps the own folder local and points everything else at the package", () => {
    const src = [
      'import { a } from "./combobox.types.js";',
      'import { b } from "../../lib/field.js";',
      'import { c } from "../../provider/context.js";',
      'import { d } from "../command/command.js";',
    ].join("\n");
    expect(rewriteEjectedImports(src, "combobox")).toBe(
      [
        'import { a } from "./combobox.types.js";',
        'import { b } from "@ux-sting/react/internal";',
        'import { c } from "@ux-sting/react/provider";',
        'import { d } from "@ux-sting/react/command";',
      ].join("\n"),
    );
  });
});

describe("rewriteAppImports", () => {
  const ejected = new Map([
    ["combobox", { names: new Set(["Combobox", "ComboboxOption"]), importPath: "../ui/combobox" }],
  ]);

  it("splits root named imports and rewrites subpath imports", () => {
    const { content, rewrites } = rewriteAppImports(
      'import { Button, Combobox as C, type ComboboxOption } from "@ux-sting/react";\nimport { Combobox } from "@ux-sting/react/combobox";',
      ejected,
    );
    expect(rewrites).toBe(2);
    expect(content).toBe(
      [
        'import { Button } from "@ux-sting/react";',
        'import { Combobox as C, type ComboboxOption } from "../ui/combobox";',
        'import { Combobox } from "../ui/combobox";',
      ].join("\n"),
    );
  });

  it("leaves unrelated imports untouched", () => {
    const src =
      'import { Button } from "@ux-sting/react";\nimport { Card } from "@ux-sting/react/card";';
    expect(rewriteAppImports(src, ejected)).toEqual({ content: src, rewrites: 0 });
  });
});

describe("eject", () => {
  it("copies only the component, rewrites its imports and the app's imports", async () => {
    const res = await eject(["combobox"], { cwd, registry });
    const dir = join(cwd, "src/components/ui/components/combobox");
    expect(existsSync(join(dir, "combobox.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "src/components/ui/components/command"))).toBe(false);
    expect(existsSync(join(cwd, "src/components/ui/lib"))).toBe(false);

    const source = readFileSync(join(dir, "combobox.tsx"), "utf8");
    expect(source).not.toMatch(/\.\.\/\.\.\/(lib|provider)\//);
    expect(source).toContain('"@ux-sting/react/internal"');
    expect(source).toContain('"@ux-sting/react/command"');

    const page = readFileSync(join(cwd, "src/app/page.tsx"), "utf8");
    expect(page).toContain('import { Button } from "@ux-sting/react";');
    expect(page).toContain(
      'import { Combobox, type ComboboxOption } from "../components/ui/components/combobox";',
    );
    expect(page).toContain(
      'import { Combobox as Picker } from "../components/ui/components/combobox";',
    );
    expect(page).toContain('import { Card } from "@ux-sting/react/card";');
    expect(res.codemod).toEqual([{ file: "src/app/page.tsx", rewrites: 2 }]);

    const lock = readLock(cwd);
    expect(lock["src/components/ui/components/combobox/combobox.tsx"]).toMatchObject({
      item: "combobox",
      ejected: true,
    });
  });

  it("dry run writes nothing", async () => {
    const before = readFileSync(join(cwd, "src/app/page.tsx"), "utf8");
    const res = await eject(["combobox"], { cwd, registry, dryRun: true });
    expect(res.written.length).toBeGreaterThan(0);
    expect(existsSync(join(cwd, "src/components/ui/components/combobox"))).toBe(false);
    expect(readFileSync(join(cwd, "src/app/page.tsx"), "utf8")).toBe(before);
  });
});

describe("update", () => {
  it("keeps local edits and writes the upstream version alongside", async () => {
    await eject(["combobox"], { cwd, registry });
    const file = join(cwd, "src/components/ui/components/combobox/combobox.tsx");
    const pristine = readFileSync(file, "utf8");
    writeFileSync(file, `// my tweak\n${pristine}`);
    const res = await update([], { cwd, registry });
    expect(res.conflicts).toEqual(["src/components/ui/components/combobox/combobox.tsx"]);
    expect(readFileSync(file, "utf8")).toMatch(/^\/\/ my tweak/);
    expect(readFileSync(`${file}.upstream`, "utf8")).toBe(pristine);
  });

  it("is a no-op when nothing changed", async () => {
    await eject(["combobox"], { cwd, registry });
    const res = await update(["combobox"], { cwd, registry });
    expect(res).toEqual({ updated: [], conflicts: [] });
  });
});
