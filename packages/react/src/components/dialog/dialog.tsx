"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { CloseButton, overlayClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";

/**
 * Use Dialog for focused tasks that need the user's full attention (edit,
 * confirm, create). It traps focus, closes on Escape, restores focus to the
 * trigger and locks page scroll.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function DialogOverlay({ className, ...props }, ref) {
    return <DialogPrimitive.Overlay ref={ref} className={cn(overlayClass, className)} {...props} />;
  },
);

export const dialogContentVariants = createVariants({
  base: [
    "ui-anim-pop fixed start-1/2 top-1/2 z-(--ui-z-modal) flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rtl:translate-x-1/2",
    "rounded-xl border border-border bg-popover text-popover-foreground shadow-xl outline-none",
  ],
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)]",
    },
  },
  defaultVariants: { size: "md" },
});

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Render the close (×) button. Every dialog needs a visible way out. */
  showClose?: boolean;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { size, showClose = true, className, children, ...props },
  ref,
) {
  const container = usePortalContainer();
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={dialogContentVariants({ size, className })} {...props}>
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

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("grid gap-1.5 px-6 pt-6 pe-12 text-start", className)} {...props} />;
});

/** Scrollable middle region; header and footer stay visible. */
export const DialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm", className)} {...props} />;
});

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse gap-2 px-6 pb-6 pt-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
});

export const DialogTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function DialogTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-snug tracking-tight", className)} {...props} />;
  },
);

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
});

/** Alias: `Modal` is the same component as `Dialog`. */
export const Modal = Dialog;
export const ModalTrigger = DialogTrigger;
export const ModalContent = DialogContent;
export const ModalHeader = DialogHeader;
export const ModalBody = DialogBody;
export const ModalFooter = DialogFooter;
export const ModalTitle = DialogTitle;
export const ModalDescription = DialogDescription;
export const ModalClose = DialogClose;
