"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";

/**
 * Preview content for sighted mouse users (e.g. profile preview on a link).
 * The trigger must work on its own — hover cards are an enhancement.
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(function HoverCardContent({ className, sideOffset = 6, align = "center", ...props }, ref) {
  const container = usePortalContainer();
  return (
    <HoverCardPrimitive.Portal container={container}>
      <HoverCardPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(floatingSurfaceClass, "w-72 p-4", className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
});
