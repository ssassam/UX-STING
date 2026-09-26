import { cn, type ClassValue } from "./cn.js";

type VariantDefinitions = Record<string, Record<string, ClassValue>>;

type BooleanKey<K> = K extends "true" | "false" ? boolean : K;

export type VariantSelection<V extends VariantDefinitions> = {
  [K in keyof V]?: BooleanKey<keyof V[K]> | null | undefined;
};

export interface VariantConfig<V extends VariantDefinitions> {
  base?: ClassValue;
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  compoundVariants?: Array<VariantSelection<V> & { className: ClassValue }>;
}

export type VariantFn<V extends VariantDefinitions> = ((
  props?: VariantSelection<V> & { className?: ClassValue },
) => string) & { variants: V; defaultVariants: VariantSelection<V> };

/** Extracts the variant props accepted by a function made with `createVariants`. */
export type VariantProps<F> = F extends VariantFn<infer V>
  ? { [K in keyof V]?: BooleanKey<keyof V[K]> }
  : never;

/**
 * Type-safe variant factory. Produces a function mapping variant props to a
 * merged class string. Unknown/undefined values fall back to defaults.
 *
 * ```ts
 * const button = createVariants({
 *   base: "inline-flex",
 *   variants: { size: { sm: "h-8", md: "h-10" } },
 *   defaultVariants: { size: "md" },
 * });
 * button({ size: "sm" }); // "inline-flex h-8"
 * ```
 */
export function createVariants<V extends VariantDefinitions = Record<never, never>>(
  config: VariantConfig<V>,
): VariantFn<V> {
  const variants = (config.variants ?? {}) as V;
  const defaults = (config.defaultVariants ?? {}) as VariantSelection<V>;

  const fn = (props: VariantSelection<V> & { className?: ClassValue } = {}) => {
    const selected: Record<string, unknown> = {};
    const classes: ClassValue[] = [config.base];

    for (const key of Object.keys(variants)) {
      const raw = (props as Record<string, unknown>)[key];
      const value = raw ?? (defaults as Record<string, unknown>)[key];
      selected[key] = value;
      if (value === undefined || value === null) continue;
      classes.push(variants[key]?.[String(value)]);
    }

    for (const { className, ...conditions } of config.compoundVariants ?? []) {
      const matches = Object.entries(conditions).every(([key, expected]) =>
        Array.isArray(expected) ? expected.includes(selected[key]) : selected[key] === expected,
      );
      if (matches) classes.push(className);
    }

    classes.push(props.className);
    return cn(...classes);
  };

  return Object.assign(fn, { variants, defaultVariants: defaults });
}
