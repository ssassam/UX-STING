import { readFileSync } from "node:fs";

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
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  client: boolean;
}

export interface Registry {
  name: string;
  version: string;
  items: RegistryItem[];
}

/** Loads the embedded registry, or a remote one (`--registry <url>`). */
export async function loadRegistry(source?: string): Promise<Registry> {
  if (source && /^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Could not fetch registry ${source}: ${res.status}`);
    return (await res.json()) as Registry;
  }
  const path = source ?? new URL("../registry.json", import.meta.url);
  return JSON.parse(readFileSync(path, "utf8")) as Registry;
}

/** Resolves items plus transitive registry dependencies (dependencies first). */
export function resolveItems(registry: Registry, names: string[]): RegistryItem[] {
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();
  const visit = (name: string, trail: string[]) => {
    if (seen.has(name)) return;
    const item = byName.get(name);
    if (!item) {
      const suggestion = [...byName.keys()].find((k) => k.includes(name) || name.includes(k));
      throw new Error(
        `Unknown component "${name}"${suggestion ? ` — did you mean "${suggestion}"?` : ""}. Run \`ux-sting list\`.`,
      );
    }
    seen.add(name);
    for (const dep of item.registryDependencies) visit(dep, [...trail, name]);
    ordered.push(item);
  };
  for (const name of names) visit(name, []);
  return ordered;
}
