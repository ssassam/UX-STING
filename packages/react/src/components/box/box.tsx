import { Slot } from "@ux-sting/primitives";
import { forwardRef, type ElementType } from "react";
import type { PolymorphicProps } from "../../lib/polymorphic.js";

export type BoxProps<E extends ElementType = "div"> = PolymorphicProps<E>;

/** The lowest-level layout primitive: a `div` (or any element) with `asChild`/`as`. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box({ as, asChild, ...props }, ref) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return <Comp ref={ref} {...props} />;
});
