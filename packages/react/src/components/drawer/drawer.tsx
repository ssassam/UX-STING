"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useControllableState, usePrefersReducedMotion } from "@unified-ui/hooks";
import { cn } from "@unified-ui/utils";
import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type PointerEvent,
} from "react";
import { overlayClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";

/**
 * Bottom drawer for mobile-first flows. Content stays spatially connected
 * to the page; it can be dismissed by dragging the handle down, Escape, the
 * overlay, or an explicit close button (drag always has alternatives).
 */
const DrawerContext = createContext<{ setOpen: (open: boolean) => void }>({ setOpen: () => {} });

export interface DrawerProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  /** Drag distance (px) past which releasing closes the drawer. */
  closeThreshold?: number;
}

export function Drawer({ open: openProp, defaultOpen = false, onOpenChange, children, ...props }: DrawerProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  return (
    <DrawerContext.Provider value={{ setOpen }}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DrawerContext.Provider>
  );
}

export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

const DRAG_THRESHOLD = 6;

export const DrawerContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { closeThreshold?: number }
>(function DrawerContent({ closeThreshold = 120, className, children, style, ...props }, ref) {
  const container = usePortalContainer();
  const { setOpen } = useContext(DrawerContext);
  const reducedMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    const delta = Math.max(0, e.clientY - start.current);
    if (!dragging && delta < DRAG_THRESHOLD) return;
    setDragging(true);
    setOffset(delta);
  };
  const onPointerUp = () => {
    if (offset > closeThreshold) setOpen(false);
    start.current = null;
    setDragging(false);
    setOffset(0);
  };

  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content
        ref={ref}
        data-side="bottom"
        className={cn(
          "ui-anim-sheet fixed inset-x-0 bottom-0 z-(--ui-z-modal) mx-auto flex max-h-[90dvh] w-full max-w-2xl flex-col rounded-t-2xl border border-b-0 border-border bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground shadow-xl outline-none",
          className,
        )}
        style={{
          transform: offset ? `translateY(${offset}px)` : undefined,
          transition: dragging || reducedMotion ? "none" : "transform var(--ui-duration-normal) var(--ui-ease-out)",
          ...style,
        }}
        {...props}
      >
        <div
          className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden
        >
          <span className="h-1.5 w-10 rounded-full bg-border-strong" />
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DrawerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DrawerHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("grid gap-1 px-5 pb-2 text-center sm:text-start", className)} {...props} />;
});

export const DrawerBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DrawerBody({ className, ...props }, ref) {
  return <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-2", className)} {...props} />;
});

export const DrawerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DrawerFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-col gap-2 px-5 py-4", className)} {...props} />;
});

export const DrawerTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function DrawerTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />;
  },
);

export const DrawerDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  function DrawerDescription({ className, ...props }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
