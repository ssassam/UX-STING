import type { AllHTMLAttributes, ElementType } from "react";

/**
 * Props for layout/typography components that accept an `as` element
 * override. Kept intentionally simple (HTML attributes of any element) so
 * types stay fast and predictable; use `asChild` for full component typing.
 */
export type PolymorphicProps<_E extends ElementType = "div", P = object> = P &
  Omit<AllHTMLAttributes<HTMLElement>, keyof P | "as" | "size" | "wrap"> & {
    as?: ElementType;
    /** Render the child element instead, merging props (see `Slot`). */
    asChild?: boolean;
  };
