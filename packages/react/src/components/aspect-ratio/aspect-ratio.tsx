import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height, e.g. `16 / 9`. */
  ratio?: number;
}

/** Reserves space for media to prevent layout shift (CLS). */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>iframe]:size-full",
        className,
      )}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
});
