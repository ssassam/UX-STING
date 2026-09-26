export const BREAKPOINTS = ["base", "sm", "md", "lg", "xl", "2xl"] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** A value that may vary by breakpoint: `3` or `{ base: 1, md: 2, lg: 3 }`. */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export function isResponsiveObject<T>(
  value: Responsive<T>,
): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Converts a responsive value into CSS custom properties (`--name-base`,
 * `--name-md`, ...). Stylesheet rules cascade the values per breakpoint, so
 * responsive props work without generating dynamic class names and remain
 * compatible with server rendering.
 */
export function responsiveVars<T>(
  name: string,
  value: Responsive<T> | undefined,
  transform: (v: T) => string = String,
): Record<string, string> {
  if (value === undefined) return {};
  if (!isResponsiveObject(value)) return { [`--${name}-base`]: transform(value) };
  const vars: Record<string, string> = {};
  for (const bp of BREAKPOINTS) {
    const v = value[bp];
    if (v !== undefined) vars[`--${name}-${bp}`] = transform(v);
  }
  return vars;
}

/** Resolves the effective value at a breakpoint (mobile-first cascade). */
export function resolveResponsive<T>(value: Responsive<T>, breakpoint: Breakpoint): T | undefined {
  if (!isResponsiveObject(value)) return value;
  let result: T | undefined;
  for (const bp of BREAKPOINTS) {
    if (value[bp] !== undefined) result = value[bp];
    if (bp === breakpoint) break;
  }
  return result;
}
