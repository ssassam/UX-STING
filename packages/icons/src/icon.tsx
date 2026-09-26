import { forwardRef } from "react";
import type { IconProps } from "./create-icon.js";
import { iconRegistry, type IconName } from "./registry.js";

export interface DynamicIconProps extends IconProps {
  name: IconName;
}

/**
 * Renders an icon by name: `<Icon name="search" />`. Convenient for
 * data-driven UIs, but it references every icon — prefer direct imports
 * (`import { SearchIcon } from "@ux-sting/icons"`) for the smallest bundles.
 */
export const Icon = forwardRef<SVGSVGElement, DynamicIconProps>(function Icon(
  { name, ...props },
  ref,
) {
  const Component = iconRegistry[name];
  return Component ? <Component ref={ref} {...props} /> : null;
});

export { iconRegistry, type IconName };
