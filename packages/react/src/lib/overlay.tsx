"use client";
import { XIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { useMessages } from "../provider/context.js";

export const overlayClass = "ui-anim-overlay fixed inset-0 z-(--ui-z-overlay) bg-overlay";

export const floatingSurfaceClass =
  // ux-audit-ignore: popover surfaces receive programmatic focus only
  "ui-anim-pop z-(--ui-z-popover) rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none";

/** Accessible close button used by dialogs, sheets and drawers. */
export const CloseButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function CloseButton({ className, "aria-label": ariaLabel, ...props }, ref) {
    const messages = useMessages();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? messages.close}
        className={cn(
          "ui-hit-area inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
          "outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
          className,
        )}
        {...props}
      >
        <XIcon />
      </button>
    );
  },
);
