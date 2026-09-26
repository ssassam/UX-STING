import { Slot } from "@unified-ui/primitives";
import { cn, responsiveVars, type Responsive } from "@unified-ui/utils";
import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";
import type { PolymorphicProps } from "../../lib/polymorphic.js";
import { space } from "../stack/stack.js";
import type { SpaceToken } from "../stack/stack.types.js";

export type GridProps<E extends ElementType = "div"> = PolymorphicProps<
  E,
  {
    /** Column count, responsive: `{ base: 1, md: 2, lg: 3 }`. */
    columns?: Responsive<number>;
    gap?: Responsive<SpaceToken>;
    /** Auto-fill columns with at least this width (e.g. `"16rem"`); overrides `columns`. */
    minChildWidth?: string;
  }
>;

/** CSS grid with responsive columns and gaps, rendered on the server. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as, asChild, columns = 1, gap = "4", minChildWidth, className, style, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return (
    <Comp
      ref={ref}
      data-auto-fit={minChildWidth ? "" : undefined}
      className={cn("ui-grid", className)}
      style={
        {
          ...responsiveVars("ui-cols", columns),
          ...responsiveVars("ui-gap", gap, space),
          ...(minChildWidth ? { "--ui-min-child": minChildWidth } : {}),
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
});

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns to span (`"full"` spans the row). */
  span?: number | "full";
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem({ span, style, ...props }, ref) {
  return (
    <div
      ref={ref}
      style={{ gridColumn: span === "full" ? "1 / -1" : span ? `span ${span} / span ${span}` : undefined, ...style }}
      {...props}
    />
  );
});
