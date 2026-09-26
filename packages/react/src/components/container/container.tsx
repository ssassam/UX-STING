import { Slot } from "@unified-ui/primitives";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type ElementType } from "react";
import type { PolymorphicProps } from "../../lib/polymorphic.js";

export const containerVariants = createVariants({
  base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      prose: "max-w-[65ch]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "xl" },
});

export type ContainerProps<E extends ElementType = "div"> = PolymorphicProps<E, VariantProps<typeof containerVariants>>;

/** Centers content with a consistent max width and responsive gutters. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as, asChild, size, className, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return <Comp ref={ref} className={cn(containerVariants({ size }), className)} {...props} />;
});
