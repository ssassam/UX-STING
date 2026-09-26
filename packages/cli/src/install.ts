import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm";
}

/** Filters out packages already listed in package.json. */
export function missingDependencies(cwd: string, deps: string[]): string[] {
  const pkgFile = join(cwd, "package.json");
  if (!existsSync(pkgFile)) return deps;
  const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
  const installed = { ...pkg.dependencies, ...pkg.devDependencies };
  return deps.filter((d) => !installed[d.replace(/(?!^)@.*$/, "")]);
}

export function installCommand(pm: PackageManager, deps: string[]): string[] {
  const verb = pm === "npm" ? "install" : "add";
  return [pm, verb, ...deps];
}

export function install(cwd: string, deps: string[]): boolean {
  if (!deps.length) return true;
  const [cmd, ...args] = installCommand(detectPackageManager(cwd), deps);
  const result = spawnSync(cmd!, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}
