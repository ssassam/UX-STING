import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { CONFIG_FILE, defaultConfig, readConfig, readLock, writeConfig, writeLock, type Config, type Lock } from "./config.js";
import { detectPackageManager, install, installCommand, missingDependencies } from "./install.js";
import { bold, dim, green, log, yellow } from "./log.js";
import { loadRegistry, resolveItems, type RegistryItem } from "./registry.js";
import { hash, transformSource } from "./transform.js";

export interface CommonOptions {
  cwd: string;
  yes?: boolean;
  install?: boolean;
  registry?: string;
}

/** Packages every project needs, independent of the components added. */
const BASE_PACKAGES = ["@unified-ui/tokens", "@unified-ui/themes", "@unified-ui/utils", "@unified-ui/hooks", "@unified-ui/primitives", "@unified-ui/icons"];

const CSS_MARKER = "/* unified-ui */";

function cssImports(config: Config): string {
  const componentsCss = config.css
    ? relative(dirname(config.css), join(config.dir, "styles/unified-ui.css")).replace(/\\/g, "/")
    : join(config.dir, "styles/unified-ui.css");
  return [
    CSS_MARKER,
    '@import "@unified-ui/tokens/tokens.css";',
    '@import "@unified-ui/tokens/tailwind.css";',
    '@import "@unified-ui/themes/themes.css";',
    `@import "${componentsCss.startsWith(".") ? componentsCss : `./${componentsCss}`}";`,
  ].join("\n");
}

export async function init(options: CommonOptions & { dir?: string; css?: string; force?: boolean }) {
  const { cwd } = options;
  if (!existsSync(join(cwd, "package.json"))) throw new Error("No package.json found. Run this inside your project.");
  const existing = readConfig(cwd);
  if (existing && !options.force) {
    log.warn(`${CONFIG_FILE} already exists — use --force to re-initialise.`);
    return existing;
  }
  const config: Config = {
    ...defaultConfig(cwd),
    ...(options.dir ? { dir: options.dir } : {}),
    ...(options.css ? { css: options.css } : {}),
  };
  writeConfig(cwd, config);
  log.success(`Wrote ${CONFIG_FILE} ${dim(`(components → ${config.dir})`)}`);

  const copied = await add(["provider", "styles"], { ...options, install: false, silentInstall: true, silentHeader: true });

  if (config.css && existsSync(join(cwd, config.css))) {
    const cssFile = join(cwd, config.css);
    const css = readFileSync(cssFile, "utf8");
    if (css.includes(CSS_MARKER)) {
      log.info(dim(`${config.css} already imports unified-ui styles.`));
    } else {
      const tailwindImport = /@import\s+["']tailwindcss["'];?\n?/.exec(css);
      const block = cssImports(config);
      const next = tailwindImport
        ? css.replace(tailwindImport[0], `${tailwindImport[0]}${block}\n`)
        : `@import "tailwindcss";\n${block}\n${css}`;
      writeFileSync(cssFile, next);
      log.success(`Added unified-ui styles to ${config.css}`);
    }
  } else {
    log.warn(`No global stylesheet found. Add these lines to your CSS entry (after @import "tailwindcss"):\n${cssImports(config)}`);
  }

  const deps = [...new Set([...missingDependencies(cwd, BASE_PACKAGES), ...copied.dependencies])];
  installOrPrint(cwd, deps, options.install);
  log.info(`\n${bold("Next:")} wrap your app in ${green("<UIProvider>")} (import from "./${config.dir}/provider") and run ${green("npx unified-ui add button")}.`);
  return config;
}

function installOrPrint(cwd: string, deps: string[], shouldInstall = true) {
  if (!deps.length) return;
  if (!shouldInstall) {
    log.info(`Install dependencies:\n  ${installCommand(detectPackageManager(cwd), deps).join(" ")}`);
    return;
  }
  log.info(dim(`Installing ${deps.join(", ")}…`));
  if (!install(cwd, deps)) log.warn(`Install failed. Run manually:\n  ${installCommand(detectPackageManager(cwd), deps).join(" ")}`);
}

export interface AddOptions extends CommonOptions {
  overwrite?: boolean;
  dryRun?: boolean;
  silentHeader?: boolean;
  /** Skip printing the install command (the caller handles installation). */
  silentInstall?: boolean;
}

export interface AddResult {
  written: string[];
  skipped: string[];
  unchanged: string[];
  dependencies: string[];
}

/**
 * Copies components and their registry dependencies. Files you have edited
 * are never overwritten silently: the lockfile stores the hash of what was
 * installed, so local modifications are detected and skipped with a warning
 * unless `--overwrite` is passed.
 */
export async function add(names: string[], options: AddOptions): Promise<AddResult> {
  const { cwd } = options;
  const config = readConfig(cwd);
  if (!config) throw new Error(`Missing ${CONFIG_FILE}. Run \`npx unified-ui init\` first.`);
  if (!names.length) throw new Error("Specify at least one component, e.g. `unified-ui add button`.");
  const registry = await loadRegistry(options.registry ?? config.registry);
  const items = resolveItems(registry, names);
  const lock = readLock(cwd);
  const result: AddResult = { written: [], skipped: [], unchanged: [], dependencies: [] };

  for (const item of items) {
    for (const file of item.files) {
      const target = join(cwd, config.dir, file.path);
      const rel = relative(cwd, target);
      const content = transformSource(file.content, config);
      const nextHash = hash(content);
      if (existsSync(target)) {
        const current = readFileSync(target, "utf8");
        if (current === content) {
          result.unchanged.push(rel);
          lock[rel] = { item: item.name, hash: nextHash };
          continue;
        }
        const locallyModified = lock[rel] ? hash(current) !== lock[rel].hash : true;
        if (locallyModified && !options.overwrite) {
          result.skipped.push(rel);
          continue;
        }
      }
      if (!options.dryRun) {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, content);
        lock[rel] = { item: item.name, hash: nextHash };
      }
      result.written.push(rel);
    }
  }

  const deps = [...new Set(items.flatMap((i) => i.dependencies))];
  result.dependencies = missingDependencies(cwd, deps);
  if (!options.dryRun) writeLock(cwd, lock);

  const requested = items.filter((i) => names.includes(i.name));
  if (!options.silentHeader) log.info(bold(`${options.dryRun ? "Would add" : "Added"} ${requested.map((i) => i.name).join(", ")}`) + dim(` (+${items.length - requested.length} dependencies)`));
  for (const f of result.written) log.success(dim(f));
  for (const f of result.skipped) log.warn(`${f} ${yellow("has local changes — skipped (use --overwrite or `unified-ui diff`)")}`);
  if (result.unchanged.length && !options.silentHeader) log.info(dim(`${result.unchanged.length} file(s) already up to date`));
  if (!options.dryRun && !options.silentInstall) installOrPrint(cwd, result.dependencies, options.install);
  return result;
}

export async function list(options: CommonOptions) {
  const registry = await loadRegistry(options.registry ?? readConfig(options.cwd)?.registry);
  const groups = new Map<string, RegistryItem[]>();
  for (const item of registry.items.filter((i) => i.type === "component")) {
    const key = item.category ?? "other";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  for (const [category, items] of groups) {
    log.info(`\n${bold(category)}`);
    for (const item of items) log.info(`  ${green(item.name.padEnd(20))} ${dim(item.description ?? "")}`);
  }
  return registry.items.filter((i) => i.type === "component").map((i) => i.name);
}

export interface DiffEntry {
  file: string;
  status: "modified" | "missing" | "outdated" | "clean";
}

/** Compares installed files with the registry. */
export async function diff(names: string[], options: CommonOptions): Promise<DiffEntry[]> {
  const { cwd } = options;
  const config = readConfig(cwd);
  if (!config) throw new Error(`Missing ${CONFIG_FILE}. Run \`npx unified-ui init\` first.`);
  const registry = await loadRegistry(options.registry ?? config.registry);
  const lock: Lock = readLock(cwd);
  const installedItems = new Set(Object.values(lock).map((l) => l.item));
  const targets = names.length ? names : [...installedItems];
  const entries: DiffEntry[] = [];
  for (const item of registry.items.filter((i) => targets.includes(i.name))) {
    for (const file of item.files) {
      const target = join(cwd, config.dir, file.path);
      const rel = relative(cwd, target);
      if (!existsSync(target)) {
        entries.push({ file: rel, status: "missing" });
        continue;
      }
      const current = readFileSync(target, "utf8");
      const upstream = transformSource(file.content, config);
      if (current === upstream) entries.push({ file: rel, status: "clean" });
      else if (lock[rel] && hash(current) === lock[rel].hash) entries.push({ file: rel, status: "outdated" });
      else entries.push({ file: rel, status: "modified" });
    }
  }
  for (const e of entries.filter((e) => e.status !== "clean")) {
    const label = e.status === "outdated" ? green("update available") : e.status === "modified" ? yellow("locally modified") : dim("missing");
    log.info(`${label.padEnd(28)} ${e.file}`);
  }
  if (entries.every((e) => e.status === "clean")) log.success("Everything is up to date.");
  return entries;
}
