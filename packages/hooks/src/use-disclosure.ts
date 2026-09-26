"use client";
import { useCallback } from "react";
import { useControllableState } from "./use-controllable-state.js";

export interface UseDisclosureOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Open/close state for overlays, collapsibles and menus. */
export function useDisclosure({
  open,
  defaultOpen = false,
  onOpenChange,
}: UseDisclosureOptions = {}) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onToggle = useCallback(() => setOpen((v) => !v), [setOpen]);
  return { open: isOpen, setOpen, onOpen, onClose, onToggle };
}
