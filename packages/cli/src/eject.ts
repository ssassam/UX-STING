import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { add, type CommonOptions } from "./commands.js";
import {
  CONFIG_FILE,
  defaultConfig,
  readConfig,
  readLock,
  writeConfig,
  writeLock,
  type Config,
} from "./config.js";
import { bold, dim, log, yellow } from "./log.js";
import { loadRegistry, type RegistryItem } from "./registry.js";
import { hash, transformSource } from "./transform.js";

const PKG = "@ux-sting/react";
const SOURCE_EXT = /\.(?:[cm]?[jt]sx?)$/;
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  ".svelte-kit",
  "dist",
  "build",
  "out",
  "coverage",
  "storybook-static",
]);

const toPosix = (path: string) => path.split(sep).join("/");

/**
 * Rewrites an ejected component's imports so that only its own folder is
 * local: other components, `lib/*` and `provider/*` keep coming from the
 * package, so React context (UIProvider, Field…) stays shared with the app.
 */
export function rewriteEjectedImports(content: string, component: string): string {
  return content.replace(
    /(from\s+["']|import\(\s*["'])(\.{1,2}\/[^"']+)(["'])/g,
    (match, head: string, spec: string, tail: string) => {
      if (spec.startsWith("./")) return match; // own folder
      const provider = spec.match(/^\.\.\/\.\.\/provider\//);
      if (provider) return `${head}${PKG}/provider${tail}`;
      if (/^\.\.\/\.\.\/lib\//.test(spec)) return `${head}${PKG}/internal${tail}`;
      const sibling = spec.match(/^\.\.\/([a-z0-9-]+)\//);
      if (sibling && sibling[1] !== component) return `${head}${PKG}/${sibling[1]}${tail}`;
      return match;
    },
  );
}

/** Exported value and type names of a component (from its registry files). */
export function exportedNames(item: RegistryItem): Set<string> {
  const names = new Set<string>();
  for (const file of item.files) {
    for (const m of file.content.matchAll(
      /export\s+(?:declare\s+)?(?:const|let|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
    ))
      names.add(m[1]!);
    for (const m of file.content.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}(?!\s*from)/g))
      for (const part of m[1]!.split(",")) {
        const name = part
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)
          .pop()
          ?.trim();
        if (name) names.add(name);
      }
  }
  return names;
}

function* sourceFiles(dir: string, exclude: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (full === exclude) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) yield* sourceFiles(full, exclude);
    else if (SOURCE_EXT.test(entry) && !entry.endsWith(".d.ts")) yield full;
  }
}

export interface EjectCodemodResult {
  file: string;
  rewrites: number;
}

/**
 * Points the app's imports of the ejected components at the local copies:
 * `@ux-sting/react/<name>` subpaths are replaced, and named imports from the
 * root `@ux-sting/react` are split so only the ejected names move.
 */
export function rewriteAppImports(
  content: string,
  ejected: Map<string, { names: Set<string>; importPath: string }>,
): { content: string; rewrites: number } {
  let rewrites = 0;
  let out = content.replace(
    /(from\s+["'])@ux-sting\/react\/([a-z0-9-]+)(["'])/g,
    (match, head: string, name: string, tail: string) => {
      const target = ejected.get(name);
      if (!target) return match;
      rewrites++;
      return `${head}${target.importPath}${tail}`;
    },
  );
  out = out.replace(
    /import\s+(type\s+)?\{([^}]*)\}\s*from\s*(["'])@ux-sting\/react\3;?/g,
    (match, typeOnly: string | undefined, specifiers: string, quote: string) => {
      const keep: string[] = [];
      const moved = new Map<string, string[]>();
      for (const raw of specifiers.split(",")) {
        const spec = raw.trim();
        if (!spec) continue;
        const imported = spec
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)[0]!
          .trim();
        const owner = [...ejected.values()].find((e) => e.names.has(imported));
        if (owner) moved.set(owner.importPath, [...(moved.get(owner.importPath) ?? []), spec]);
        else keep.push(spec);
      }
      if (!moved.size) return match;
      rewrites += moved.size;
      const t = typeOnly ? "type " : "";
      const lines = [...moved].map(
        ([path, specs]) => `import ${t}{ ${specs.join(", ")} } from ${quote}${path}${quote};`,
      );
      if (keep.length)
        lines.unshift(`import ${t}{ ${keep.join(", ")} } from ${quote}@ux-sting/react${quote};`);
      return lines.join("\n");
    },
  );
  return { content: out, rewrites };
}

export interface EjectOptions extends CommonOptions {
  dryRun?: boolean;
  overwrite?: boolean;
  /** Skip rewriting the app's imports. */
  noCodemod?: boolean;
}

export interface EjectResult {
  written: string[];
  skipped: string[];
  codemod: EjectCodemodResult[];
}

/**
 * Copies components into the project for apps that use the `@ux-sting/react`
 * npm package, keeping their dependencies on the package, then rewrites the
 * app's imports to the local copies. The lockfile records hashes so
 * `ux-sting diff` / `ux-sting update` work on ejected files too.
 */
export async function eject(names: string[], options: EjectOptions): Promise<EjectResult> {
  const { cwd } = options;
  if (!existsSync(join(cwd, "package.json")))
    throw new Error("No package.json found. Run this inside your project.");
  if (!names.length)
    throw new Error("Specify at least one component, e.g. `ux-sting eject button`.");
  let config: Config | null = readConfig(cwd);
  if (!config) {
    config = defaultConfig(cwd);
    if (!options.dryRun) writeConfig(cwd, config);
    log.info(dim(`Wrote ${CONFIG_FILE} (ejected components → ${config.dir})`));
  }
  const registry = await loadRegistry(options.registry ?? config.registry);
  const lock = readLock(cwd);
  const result: EjectResult = { written: [], skipped: [], codemod: [] };
  const ejected = new Map<string, { names: Set<string>; importPath: string; dir: string }>();

  for (const name of names) {
    const item = registry.items.find((i) => i.name === name && i.type === "component");
    if (!item) throw new Error(`Unknown component "${name}". Run \`ux-sting list\`.`);
    const dir = join(cwd, config.dir, "components", name);
    ejected.set(name, { names: exportedNames(item), importPath: "", dir });
    for (const file of item.files) {
      const target = join(cwd, config.dir, file.path);
      const rel = toPosix(relative(cwd, target));
      const content = transformSource(rewriteEjectedImports(file.content, name), config);
      if (existsSync(target) && readFileSync(target, "utf8") === content) {
        lock[rel] = { item: name, hash: hash(content), ejected: true };
        continue;
      }
      if (existsSync(target) && !options.overwrite) {
        const current = readFileSync(target, "utf8");
        const modified = lock[rel] ? hash(current) !== lock[rel].hash : current !== content;
        if (modified) {
          result.skipped.push(rel);
          continue;
        }
      }
      if (!options.dryRun) {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, content);
        lock[rel] = { item: name, hash: hash(content), ejected: true };
      }
      result.written.push(rel);
    }
  }
  if (!options.dryRun) writeLock(cwd, lock);

  if (!options.noCodemod) {
    const ejectRoot = join(cwd, config.dir, "components");
    for (const file of sourceFiles(cwd, ejectRoot)) {
      const targets = new Map<string, { names: Set<string>; importPath: string }>();
      for (const [name, e] of ejected) {
        let path = toPosix(relative(dirname(file), e.dir));
        if (!path.startsWith(".")) path = `./${path}`;
        targets.set(name, {
          names: e.names,
          importPath: config.importExtensions ? `${path}/index.js` : path,
        });
      }
      const source = readFileSync(file, "utf8");
      if (!source.includes(PKG)) continue;
      const { content, rewrites } = rewriteAppImports(source, targets);
      if (!rewrites) continue;
      if (!options.dryRun) writeFileSync(file, content);
      result.codemod.push({ file: toPosix(relative(cwd, file)), rewrites });
    }
  }

  log.info(bold(`${options.dryRun ? "Would eject" : "Ejected"} ${names.join(", ")}`));
  for (const f of result.written) log.success(dim(f));
  for (const f of result.skipped)
    log.warn(`${f} ${yellow("has local changes — skipped (use --overwrite)")}`);
  for (const c of result.codemod)
    log.info(`  ${dim("imports")} ${c.file} ${dim(`(${c.rewrites})`)}`);
  if (!result.codemod.length && !options.noCodemod)
    log.info(dim("No imports to rewrite — import the local copy where you need it."));
  return result;
}

/**
 * Re-applies the registry to installed components: files you have not edited
 * are updated, edited files are kept and the new version is written next to
 * them as `<file>.upstream` for a manual merge.
 */
export async function update(
  names: string[],
  options: CommonOptions & { dryRun?: boolean },
): Promise<{ updated: string[]; conflicts: string[] }> {
  const { cwd } = options;
  const config = readConfig(cwd);
  if (!config) throw new Error(`Missing ${CONFIG_FILE}. Run \`npx ux-sting init\` first.`);
  const lock = readLock(cwd);
  const installed = [...new Set(Object.values(lock).map((l) => l.item))];
  const targets = names.length ? names : installed;
  const ejectedItems = new Set(
    Object.values(lock)
      .filter((l) => l.ejected)
      .map((l) => l.item),
  );
  const copied = targets.filter((n) => !ejectedItems.has(n));
  const updated: string[] = [];
  const conflicts: string[] = [];

  if (copied.length) {
    const res = await add(copied, {
      ...options,
      silentHeader: true,
      silentInstall: true,
      install: false,
    });
    updated.push(...res.written);
    conflicts.push(...res.skipped);
  }
  for (const name of targets.filter((n) => ejectedItems.has(n))) {
    const res = await eject([name], { ...options, noCodemod: true });
    updated.push(...res.written);
    conflicts.push(...res.skipped);
  }

  if (conflicts.length && !options.dryRun) {
    const registry = await loadRegistry(options.registry ?? config.registry);
    for (const rel of conflicts) {
      const entry = readLock(cwd)[rel];
      const item = registry.items.find((i) => i.name === entry?.item);
      const file = item?.files.find((f) => rel.endsWith(f.path));
      if (!item || !file) continue;
      const upstream = transformSource(
        entry?.ejected ? rewriteEjectedImports(file.content, item.name) : file.content,
        config,
      );
      writeFileSync(join(cwd, `${rel}.upstream`), upstream);
    }
  }
  log.info(bold(`Updated ${updated.length} file(s)`));
  for (const f of conflicts)
    log.warn(`${f} ${yellow("has local changes — new version written to")} ${f}.upstream`);
  if (!updated.length && !conflicts.length) log.success("Everything is up to date.");
  return { updated, conflicts };
}
