/**
 * Reading W3C Design Tokens (DTCG) files from any tool: groups, `$type`
 * inheritance, `{alias}` references, both the 2025.10 object values and the
 * older string values (`"16px"`, `"#fff"`), and Style Dictionary's legacy
 * `value` / `type` keys.
 */

export interface FlatToken {
  /** Dot path, e.g. `semantic.color.action.primary`. */
  path: string;
  type: string | undefined;
  /** Value with aliases resolved. */
  value: unknown;
  description?: string;
  extensions?: Record<string, unknown>;
}

export type DtcgDocument = Record<string, unknown>;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Flattens a DTCG document into tokens, resolving aliases (cycles become undefined). */
export function flattenDtcg(doc: DtcgDocument): FlatToken[] {
  const raw = new Map<string, Omit<FlatToken, "path">>();
  const walk = (node: Record<string, unknown>, path: string[], inherited?: string) => {
    const type = (node.$type ?? inherited) as string | undefined;
    // Legacy Style Dictionary tokens use `value`; a group may also be named "value".
    const legacy = "value" in node && ("type" in node || !isObj(node.value));
    if (("$value" in node || legacy) && path.length) {
      raw.set(path.join("."), {
        type: (node.$type ?? node.type ?? type) as string | undefined,
        value: "$value" in node ? node.$value : node.value,
        ...(typeof (node.$description ?? node.description) === "string"
          ? { description: String(node.$description ?? node.description) }
          : {}),
        ...(isObj(node.$extensions) ? { extensions: node.$extensions } : {}),
      });
      return;
    }
    for (const [key, child] of Object.entries(node))
      if (!key.startsWith("$") && isObj(child)) walk(child, [...path, key], type);
  };
  walk(doc, []);

  const resolve = (value: unknown, seen: Set<string>): unknown => {
    if (typeof value === "string") {
      const alias = /^\{([^}]+)\}$/.exec(value.trim());
      if (alias) {
        const target = alias[1]!;
        if (seen.has(target)) return undefined;
        const ref = raw.get(target);
        return ref ? resolve(ref.value, new Set([...seen, target])) : undefined;
      }
      return value;
    }
    if (Array.isArray(value)) return value.map((v) => resolve(v, seen));
    if (isObj(value))
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, seen)]));
    return value;
  };

  return [...raw.entries()].map(([path, t]) => {
    let type = t.type;
    // Aliases carry their target's type when the token has none.
    if (!type && typeof t.value === "string" && /^\{.+\}$/.test(t.value))
      type = raw.get(t.value.slice(1, -1))?.type;
    return { path, ...t, type, value: resolve(t.value, new Set([path])) };
  });
}

/** px from `"16px"`, `"1rem"`, `16`, or `{ value, unit }`; null otherwise. */
export function toPx(value: unknown, rootPx = 16): number | null {
  if (typeof value === "number") return value;
  if (isObj(value) && typeof value.value === "number")
    return value.unit === "rem" ? value.value * rootPx : value.value;
  if (typeof value !== "string") return null;
  const m = /^(-?[\d.]+)(px|rem|em)?$/.exec(value.trim());
  if (!m) return null;
  return m[2] === "rem" || m[2] === "em" ? parseFloat(m[1]!) * rootPx : parseFloat(m[1]!);
}

/** ms from `"200ms"`, `"0.2s"`, `200`, or `{ value, unit }`; null otherwise. */
export function toMs(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (isObj(value) && typeof value.value === "number")
    return value.unit === "s" ? value.value * 1000 : value.value;
  if (typeof value !== "string") return null;
  const m = /^([\d.]+)(ms|s)$/.exec(value.trim());
  return m ? parseFloat(m[1]!) * (m[2] === "s" ? 1000 : 1) : null;
}

/** First family of a fontFamily value (string list or array). */
export function fontList(value: unknown): string[] {
  const list = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];
  return list.map((f) => f.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}
