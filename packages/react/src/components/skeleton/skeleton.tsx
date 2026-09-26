import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape preset. */
  shape?: "rect" | "text" | "circle";
}

/**
 * Placeholder that reserves layout while content loads (prevents layout
 * shift). Hidden from assistive tech — announce loading on the container
 * with `aria-busy` instead.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = "rect", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "ui-skeleton",
        shape === "circle"
          ? "rounded-full"
          : shape === "text"
            ? "h-4 w-full rounded-sm"
            : "rounded-md",
        className,
      )}
      {...props}
    />
  );
});

/** Multi-line text placeholder with a shorter last line. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("grid gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          shape="text"
          className={i === lines - 1 && lines > 1 ? "w-3/5" : undefined}
        />
      ))}
    </div>
  );
}
