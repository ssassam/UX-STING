"use client";
import { XIcon } from "@unified-ui/icons";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";

export const tagVariants = createVariants({
  base: "inline-flex max-w-full items-center gap-1.5 rounded-md border text-sm font-medium transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "border-border bg-surface text-foreground",
      primary: "border-transparent bg-primary-subtle text-primary-subtle-foreground",
      success: "border-transparent bg-success-subtle text-success-subtle-foreground",
      warning: "border-transparent bg-warning-subtle text-warning-subtle-foreground",
      destructive: "border-transparent bg-destructive-subtle text-destructive-subtle-foreground",
      info: "border-transparent bg-info-subtle text-info-subtle-foreground",
      outline: "border-border-strong bg-transparent text-foreground",
    },
    size: { sm: "h-6 px-2 text-xs", md: "h-7 px-2.5", lg: "h-8 px-3" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  icon?: ReactNode;
  /** Makes the tag removable; renders an accessible remove button. */
  onRemove?: () => void;
  /** Label used for the remove button (defaults to the text content). */
  removeLabel?: string;
}

/** Categorization label, optionally removable (e.g. applied filters). */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { variant, size, icon, onRemove, removeLabel, className, children, ...props },
  ref,
) {
  const messages = useMessages();
  return (
    <span ref={ref} className={tagVariants({ variant, size, className })} {...props}>
      {icon}
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={messages.removeItem(
            removeLabel ?? (typeof children === "string" ? children : ""),
          )}
          className="ui-hit-area -me-1 inline-flex size-4 items-center justify-center rounded-xs opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <XIcon />
        </button>
      ) : null}
    </span>
  );
});

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state (filter chips). Announced via `aria-pressed`. */
  selected?: boolean;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

/** Interactive, selectable pill — use for filters and quick choices. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected, icon, size = "md", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      data-selected={selected ? "" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong bg-background font-medium text-foreground transition-colors",
        "outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
        "data-selected:border-primary data-selected:bg-primary-subtle data-selected:text-primary-subtle-foreground [&_svg]:size-4",
        size === "sm"
          ? "h-7 px-2.5 text-xs"
          : size === "lg"
            ? "h-10 px-4 text-sm"
            : "h-8 px-3 text-sm",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});
