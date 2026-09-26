import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Purely visual separators are hidden from assistive technology (default). */
  decorative?: boolean;
  /** Optional centered label, e.g. "or". */
  label?: ReactNode;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = true, label, className, ...props },
  ref,
) {
  const semantics = decorative
    ? { role: "none" as const }
    : { role: "separator" as const, "aria-orientation": orientation };
  if (label) {
    return (
      <div
        ref={ref}
        {...semantics}
        className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}
        {...props}
      >
        <span className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <div
      ref={ref}
      {...semantics}
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
});
