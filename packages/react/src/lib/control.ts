import { createVariants } from "@unified-ui/utils";

/**
 * Shared visual language for text-like controls. Mobile uses 16px text to
 * avoid iOS zoom-on-focus; focus uses a visible ring; invalid state is
 * driven by `aria-invalid` so styling always matches semantics.
 */
export const controlVariants = createVariants({
  base: [
    "w-full min-w-0 rounded-md border border-input bg-background text-foreground shadow-xs",
    "transition-[border-color,box-shadow] duration-(--ui-duration-fast) placeholder:text-muted-foreground",
    "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
    "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30",
    "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 read-only:bg-surface",
  ],
  variants: {
    size: {
      sm: "h-control-sm px-2.5 text-md sm:text-sm",
      md: "h-control-md px-3 text-md sm:text-sm",
      lg: "h-control-lg px-3.5 text-md",
    },
    variant: {
      default: "",
      filled: "border-transparent bg-muted shadow-none hover:bg-secondary-hover focus-visible:bg-background",
    },
  },
  defaultVariants: { size: "md", variant: "default" },
});

export type ControlSize = "sm" | "md" | "lg";
