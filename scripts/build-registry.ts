/**
 * Builds the component registry used by the CLI (`unified-ui add`) and the
 * docs site. Dependencies are computed from import statements, so the
 * registry never drifts from the source.
 *
 * Output: packages/cli/registry.json (embedded in the CLI package).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { components } from "../registry/components.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "packages/react/src");
const reactPkg = JSON.parse(readFileSync(join(root, "packages/react/package.json"), "utf8"));

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryItem {
  name: string;
  type: "component" | "lib" | "provider" | "style";
  title?: string;
  description?: string;
  category?: string;
  /** npm packages to install. */
  dependencies: string[];
  /** Other registry items required. */
  registryDependencies: string[];
  files: RegistryFile[];
  client: boolean;
}

const IGNORE = /\.(test|stories)\.tsx?$|README\.md$/;
const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : IGNORE.test(entry) ? [] : [full];
  });
}

function versionOf(pkg: string): string {
  const range = reactPkg.dependencies?.[pkg] as string | undefined;
  if (!range || range.startsWith("workspace:")) {
    const local = JSON.parse(readFileSync(join(root, "packages", pkg.split("/")[1]!, "package.json"), "utf8"));
    return `${pkg}@^${local.version}`;
  }
  return `${pkg}@${range}`;
}

function analyze(files: string[], selfName: string) {
  const deps = new Set<string>();
  const regDeps = new Set<string>();
  let client = false;
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    if (/^["']use client["']/.test(content.trimStart())) client = true;
    for (const match of content.matchAll(IMPORT_RE)) {
      const spec = match[1] ?? match[2]!;
      if (spec.startsWith(".")) {
        const target = join(dirname(file), spec);
        const rel = relative(src, target).split("/");
        if (rel[0] === "components" && rel[1] && rel[1] !== selfName) regDeps.add(rel[1]);
        else if (rel[0] === "lib") regDeps.add(`lib/${rel[1]!.replace(/\.js$/, "")}`);
        else if (rel[0] === "provider") regDeps.add("provider");
      } else if (spec !== "react" && spec !== "react-dom" && !spec.startsWith("react/")) {
        const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]!;
        deps.add(versionOf(pkg));
      }
    }
  }
  return { deps: [...deps].sort(), regDeps: [...regDeps].filter((d) => d !== selfName).sort(), client };
}

const toFiles = (files: string[]): RegistryFile[] =>
  files.map((f) => ({ path: relative(src, f), content: readFileSync(f, "utf8") }));

const items: RegistryItem[] = [];

for (const meta of components) {
  const files = walk(join(src, "components", meta.name));
  const { deps, regDeps, client } = analyze(files, meta.name);
  items.push({
    name: meta.name,
    type: "component",
    title: meta.title,
    description: meta.description,
    category: meta.category,
    dependencies: deps,
    registryDependencies: regDeps,
    files: toFiles(files),
    client,
  });
}

for (const file of readdirSync(join(src, "lib"))) {
  const full = join(src, "lib", file);
  const name = `lib/${file.replace(/\.tsx?$/, "")}`;
  const { deps, regDeps, client } = analyze([full], name);
  items.push({ name, type: "lib", dependencies: deps, registryDependencies: regDeps.filter((d) => d !== name), files: toFiles([full]), client });
}

const providerFiles = walk(join(src, "provider"));
const provider = analyze(providerFiles, "provider");
items.push({
  name: "provider",
  type: "provider",
  title: "UIProvider",
  description: "Theme, color mode, density, locale/direction and localized messages.",
  dependencies: provider.deps,
  registryDependencies: provider.regDeps,
  files: toFiles(providerFiles),
  client: true,
});

items.push({
  name: "styles",
  type: "style",
  title: "Component styles",
  description: "Animations, responsive layout variables and touch hit areas.",
  dependencies: [],
  registryDependencies: [],
  files: [{ path: "styles/unified-ui.css", content: readFileSync(join(src, "styles/components.css"), "utf8") }],
  client: false,
});

// Validate the dependency graph: every registry dependency must exist.
const names = new Set(items.map((i) => i.name));
for (const item of items) {
  for (const dep of item.registryDependencies) {
    if (!names.has(dep)) throw new Error(`${item.name} depends on unknown registry item ${dep}`);
  }
}

const registry = { name: "unified-ui", version: reactPkg.version as string, items };
writeFileSync(join(root, "packages/cli/registry.json"), JSON.stringify(registry));
const components_ = items.filter((i) => i.type === "component").length;
console.log(`Registry: ${items.length} items (${components_} components) → packages/cli/registry.json`);
