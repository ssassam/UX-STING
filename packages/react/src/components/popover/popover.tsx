"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";

/** Non-modal floating panel anchored to a trigger (pickers, quick forms). */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(
  function PopoverContent({ className, align = "center", sideOffset = 6, collisionPadding = 8, ...props }, ref) {
    const container = usePortalContainer();
    return (
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(floatingSurfaceClass, "w-72 max-w-[calc(100vw-1rem)] p-4", className)}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  },
);
