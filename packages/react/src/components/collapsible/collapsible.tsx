"use client";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

/** A single show/hide region controlled by a trigger (`aria-expanded`). */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn("ui-anim-collapse", className)}
      {...props}
    />
  );
});
