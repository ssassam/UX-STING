"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { usePortalContainer } from "../../provider/context.js";

/**
 * Short, supplementary label on hover and keyboard focus. Never put
 * essential information or interactive content in a tooltip — it is not
 * available on touch devices.
 */
export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, children, ...props }, ref) {
  const container = usePortalContainer();
  return (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          "ui-anim-pop z-(--ui-z-tooltip) max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

export interface TooltipProps extends Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
  "children"
> {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

/** Convenience wrapper: `<Tooltip content="Copy"><IconButton … /></Tooltip>`. */
export function Tooltip({
  content,
  children,
  side = "top",
  align,
  delayDuration = 300,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
