"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { CloseButton, overlayClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";

/**
 * Use Sheet for contextual panels that slide from an edge — filters,
 * navigation on mobile, detail views — while keeping the page context.
 * Sides are logical (`start`/`end`) so they flip in RTL.
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const sheetVariants = createVariants({
  base: "ui-anim-sheet fixed z-(--ui-z-modal) flex flex-col bg-popover text-popover-foreground shadow-xl outline-none",
  variants: {
    side: {
      start: "inset-y-0 start-0 h-dvh w-[min(24rem,calc(100vw-3rem))] border-e border-border",
      end: "inset-y-0 end-0 h-dvh w-[min(24rem,calc(100vw-3rem))] border-s border-border",
      top: "inset-x-0 top-0 max-h-[85dvh] border-b border-border",
      bottom: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl border-t border-border pb-[env(safe-area-inset-bottom)]",
    },
    size: { sm: "", md: "", lg: "", xl: "" },
  },
  compoundVariants: [
    { side: ["start", "end"] as never, size: "sm", className: "w-[min(20rem,calc(100vw-3rem))]" },
    { side: ["start", "end"] as never, size: "lg", className: "w-[min(32rem,calc(100vw-3rem))]" },
    { side: ["start", "end"] as never, size: "xl", className: "w-[min(48rem,calc(100vw-3rem))]" },
  ],
  defaultVariants: { side: "end", size: "md" },
});

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showClose?: boolean;
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { side = "end", size, showClose = true, className, children, ...props },
  ref,
) {
  const container = usePortalContainer();
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content ref={ref} data-side={side} className={sheetVariants({ side, size, className })} {...props}>
        {children}
        {showClose ? (
          <DialogPrimitive.Close asChild>
            <CloseButton className="absolute end-3 top-3" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const SheetHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SheetHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("grid gap-1 border-b border-border px-5 py-4 pe-12", className)} {...props} />;
});

export const SheetBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SheetBody({ className, ...props }, ref) {
  return <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)} {...props} />;
});

export const SheetFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SheetFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex gap-2 border-t border-border px-5 py-4 [&>*]:flex-1 sm:[&>*]:flex-none sm:justify-end", className)} {...props} />;
});

export const SheetTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function SheetTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />;
  },
);

export const SheetDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  function SheetDescription({ className, ...props }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
