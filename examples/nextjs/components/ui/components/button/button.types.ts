import type { VariantProps } from "@unified-ui/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { buttonVariants } from "./button.variants";

export type ButtonVariant =
  "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success" | "warning";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a link) with button styles. */
  asChild?: boolean;
  /** Shows a spinner, sets `aria-busy` and prevents interaction. */
  loading?: boolean;
  /** Replaces the label while loading (announced to screen readers). */
  loadingText?: ReactNode;
  /** Icon before the label (inline-start, RTL-aware). */
  startIcon?: ReactNode;
  /** Icon after the label (inline-end, RTL-aware). */
  endIcon?: ReactNode;
  /** Visually active state, e.g. current item in a toolbar. */
  active?: boolean;
}

export interface IconButtonProps extends Omit<
  ButtonProps,
  "startIcon" | "endIcon" | "loadingText" | "fullWidth"
> {
  /** Required accessible name — icon-only buttons must be labelled. */
  "aria-label": string;
  /** Shape; `circle` for floating actions. */
  shape?: "square" | "circle";
}
