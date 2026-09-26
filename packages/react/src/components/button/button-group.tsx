import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Visually join buttons (shared borders, no gaps). */
  attached?: boolean;
}

/** Groups related buttons. Provide an `aria-label` describing the group. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = "horizontal", attached = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(
        "inline-flex",
        orientation === "vertical" ? "flex-col" : "flex-row",
        attached
          ? orientation === "vertical"
            ? "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px"
            : "[&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:first-child)]:-ms-px [&>*:focus-visible]:z-10"
          : "gap-2",
        className,
      )}
      {...props}
    />
  );
});
