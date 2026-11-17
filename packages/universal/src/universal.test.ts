import { describe, it, expect } from "vitest";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { generateNextApp, planSite, writeNextApp } from "./index.js";
import type { Brief, PageContent } from "@ux-sting/design-dna";
const brief: Brief = {
  name: "Books",
  industry: "independent bookshop",
  audience: "readers",
  goals: ["read"],
  tone: ["warm", "editorial"],
  language: "en",
  sections: [{ id: "intro", role: "hero" }],
};
const content: PageContent = {
  lang: "en",
  title: "Books",
  description: "Independent books",
  siteName: "Books",
  nav: [{ label: "About", href: "/about" }],
  sections: [
    {
      id: "intro",
      heading: 'Books <script> {danger} & "quotes"',
      body: "Read here",
      action: { label: "Bad URL", href: "javascript:alert(1)" },
    },
  ],
};
const spec = () => ({
  name: "Books",
  dna: planSite(brief).dna,
  pages: [
    { path: "/", content },
    { path: "/about", content: { ...content, title: "About Books" } },
  ],
});
describe("multi-page generation", () => {
  it("emits compilable React routes, metadata and scoped styles", () => {
    const files = generateNextApp(spec());
    for (const [_path, code] of Object.entries(files).filter(([path]) => path.endsWith(".tsx"))) {
      const result = ts.transpileModule(code, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
        reportDiagnostics: true,
      });
      expect(result.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error)).toEqual(
        [],
      );
    }
    expect(files["app/about/page.tsx"]).toContain('"title": "About Books"');
    expect(files["app/page.tsx"]).not.toContain("javascript:");
    expect(files["app/page.tsx"]).toContain("Made with love by Veltein");
    expect(files["app/page.tsx"]).toContain('"--cols"');
    expect(files["app/globals.css"]).toContain("--dna-size-body");
    expect(files["app/globals.css"]).not.toContain("--dna-size-&");
    expect(files["app/globals.css"]).not.toMatch(/\bbody\{margin:0;background/);
    expect(files["app/page.tsx"]).toContain("\\u003cscript>");
  });
  it("refuses traversal, duplicate routes, missing home and invalid design", () => {
    for (const path of ["/../escape", "/a//b", "/a?x", "/%2e%2e", "/[slug]"])
      expect(() => generateNextApp({ ...spec(), pages: [{ path, content }] })).toThrow();
    expect(() =>
      generateNextApp({
        ...spec(),
        pages: [
          { path: "/", content },
          { path: "/", content },
        ],
      }),
    ).toThrow("Duplicate");
    const site = spec();
    site.dna.color.foreground = site.dna.color.background;
    expect(() => generateNextApp(site)).toThrow("Invalid design");
  });
  it("writes a new project and preserves existing files", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ux-sting-"));
    try {
      const dest = join(dir, "site");
      await writeNextApp(spec(), dest);
      const before = await readFile(join(dest, "app/page.tsx"), "utf8");
      await expect(writeNextApp(spec(), dest)).rejects.toThrow("already exists");
      expect(await readFile(join(dest, "app/page.tsx"), "utf8")).toBe(before);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
