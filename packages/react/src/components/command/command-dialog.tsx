"use client";
import { useControllableState, useHotkey } from "@unified-ui/hooks";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import type { ReactNode } from "react";
import { overlayClass } from "../../lib/overlay.js";
import { usePortalContainer } from "../../provider/context.js";
import { Command, type CommandProps } from "./command.js";

export interface CommandDialogProps extends Omit<CommandProps, "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Global shortcut to open the palette. Defaults to `mod+k`; `false` disables. */
  shortcut?: string | false;
  title?: ReactNode;
  children?: ReactNode;
}

/** Command palette in a modal dialog, opened with ⌘K / Ctrl+K by default. */
export function CommandDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = "mod+k",
  title = "Command menu",
  className,
  children,
  ...props
}: CommandDialogProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const container = usePortalContainer();
  useHotkey(shortcut || "", () => setOpen(!open), { enabled: Boolean(shortcut), enableInInputs: true });
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="ui-anim-pop fixed start-1/2 top-[12dvh] z-(--ui-z-modal) w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border shadow-xl outline-none rtl:translate-x-1/2"
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          </VisuallyHidden>
          <Command label={typeof title === "string" ? title : undefined} className={cn(className)} {...props}>
            {children}
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
