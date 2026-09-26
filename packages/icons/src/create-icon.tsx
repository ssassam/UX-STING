import { createElement, forwardRef, type SVGProps } from "react";

export type IconNode = ReadonlyArray<readonly [string, Record<string, string | number>]>;

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Token size (`xs`–`xl`), a number in px, or any CSS length. Defaults to `1em`. */
  size?: IconSize | number | (string & {});
  /** Accessible title. When omitted the icon is decorative (`aria-hidden`). */
  title?: string;
}

const TOKEN_SIZES = new Set(["xs", "sm", "md", "lg", "xl"]);

export function resolveIconSize(size: IconProps["size"]): string | number {
  if (size === undefined) return "1em";
  if (typeof size === "string" && TOKEN_SIZES.has(size)) return `var(--ui-icon-${size})`;
  return size;
}

/**
 * Creates an icon component from SVG node data. Icons inherit `currentColor`,
 * use the shared stroke token, and are decorative unless given a `title` or
 * an `aria-label`.
 */
export function createIcon(name: string, node: IconNode) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size, title, className, style, children, ...props },
    ref,
  ) {
    const dimension = resolveIconSize(size);
    const labelled = Boolean(title || props["aria-label"] || props["aria-labelledby"]);
    return createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: dimension,
        height: dimension,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className ? `ui-icon ui-icon-${name} ${className}` : `ui-icon ui-icon-${name}`,
        style: { strokeWidth: "var(--ui-icon-stroke, 1.75)", flexShrink: 0, ...style },
        "aria-hidden": labelled ? undefined : true,
        role: labelled ? "img" : undefined,
        focusable: "false",
        ...props,
      },
      title ? createElement("title", null, title) : null,
      ...node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
      children,
    );
  });
  Icon.displayName = `Icon(${name})`;
  return Icon;
}

export type IconComponent = ReturnType<typeof createIcon>;
