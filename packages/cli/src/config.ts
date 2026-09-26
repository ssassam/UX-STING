import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface Config {
  $schema?: string;
  /** Directory (relative to project root) where components are copied. */
  dir: string;
  /** Global stylesheet that receives the unified-ui imports. */
  css?: string;
  /** Keep `.js` extensions in relative imports (needed for Node ESM builds). */
  importExtensions: boolean;
  /** Registry source (file path or URL). Defaults to the bundled registry. */
  registry?: string;
}

export const CONFIG_FILE = "unified-ui.json";
export const LOCK_FILE = "unified-ui.lock.json";

export const defaultConfig = (cwd: string): Config => ({
  dir: existsSync(join(cwd, "src")) ? "src/components/ui" : "components/ui",
  css: detectCss(cwd),
  importExtensions: false,
});

function detectCss(cwd: string): string | undefined {
  const candidates = [
    "src/app/globals.css",
    "app/globals.css",
    "src/styles/globals.css",
    "styles/globals.css",
    "src/index.css",
    "src/main.css",
  ];
  return candidates.find((c) => existsSync(join(cwd, c)));
}

export function readConfig(cwd: string): Config | null {
  const file = join(cwd, CONFIG_FILE);
  if (!existsSync(file)) return null;
  return { ...defaultConfig(cwd), ...JSON.parse(readFileSync(file, "utf8")) };
}

export function writeConfig(cwd: string, config: Config): void {
  writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
}

export type Lock = Record<string, { item: string; hash: string }>;

export function readLock(cwd: string): Lock {
  const file = join(cwd, LOCK_FILE);
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Lock) : {};
}

export function writeLock(cwd: string, lock: Lock): void {
  const sorted = Object.fromEntries(Object.entries(lock).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(cwd, LOCK_FILE), JSON.stringify(sorted, null, 2) + "\n");
}
