"use client";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { buttonVariants } from "../button/button.variants.js";
import type { ButtonProps } from "../button/button.types.js";
import { overlayClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";
import { dialogContentVariants } from "../dialog/dialog.js";

/**
 * Interrupts the user to confirm a consequential action (delete, discard).
 * Unlike Dialog it cannot be dismissed by clicking outside, and focus starts
 * on the least destructive action (Cancel).
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & { size?: "sm" | "md" }
>(function AlertDialogContent({ size = "sm", className, ...props }, ref) {
  const container = usePortalContainer();
  return (
    <AlertDialogPrimitive.Portal container={container}>
      <AlertDialogPrimitive.Overlay className={overlayClass} />
      <AlertDialogPrimitive.Content ref={ref} className={dialogContentVariants({ size, className: cn("gap-0", className) })} {...props} />
    </AlertDialogPrimitive.Portal>
  );
});

export const AlertDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertDialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("grid gap-2 px-6 pt-6 text-start", className)} {...props} />;
});

export const AlertDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertDialogFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end", className)} {...props} />;
});

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />;
  },
);

export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
});

type ActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & Pick<ButtonProps, "variant" | "size">;

export const AlertDialogAction = forwardRef<HTMLButtonElement, ActionProps>(function AlertDialogAction(
  { variant = "default", size, className, ...props },
  ref,
) {
  return <AlertDialogPrimitive.Action ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
});

export const AlertDialogCancel = forwardRef<HTMLButtonElement, ActionProps>(function AlertDialogCancel(
  { variant = "outline", size, className, ...props },
  ref,
) {
  return <AlertDialogPrimitive.Cancel ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
});
