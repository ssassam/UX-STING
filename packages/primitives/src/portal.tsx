"use client";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "@unified-ui/hooks";

export interface PortalProps {
  children?: ReactNode;
  /** Container to render into. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null;
}

/** Renders children into `document.body` (or a container) after mount. */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useIsomorphicLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const target = container ?? (typeof document !== "undefined" ? document.body : null);
  return target ? createPortal(children, target) : null;
}
