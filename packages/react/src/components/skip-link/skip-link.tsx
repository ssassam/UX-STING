"use client";
import { cn } from "@ux-sting/utils";
import { useMessages } from "../../provider/context.js";
import type { AnchorHTMLAttributes } from "react";

/**
 * First focusable element on the page: lets keyboard users jump past the
 * navigation to `#main` (or `href`). Visible only when focused.
 */
export function SkipLink({
  href = "#main",
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const messages = useMessages();
  return (
    <a
      href={href}
      className={cn(
        "fixed start-4 top-4 z-(--ui-z-tooltip) -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg outline-none transition-transform focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children ?? messages.skipToContent}
    </a>
  );
}
