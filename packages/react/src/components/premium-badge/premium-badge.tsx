import { CrownIcon, ShieldCheckIcon, SparklesIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  size?: "sm" | "md";
}

const base = "inline-flex items-center gap-1 rounded-full font-semibold [&_svg]:shrink-0";
const sizes = {
  sm: "h-5 px-2 text-[0.6875rem] [&_svg]:size-3",
  md: "h-6 px-2.5 text-xs [&_svg]:size-3.5",
};

/** Highlights a paid/featured listing. Always includes text, not just color. */
export function PremiumBadge({
  children = "Premium",
  size = "md",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        base,
        sizes[size],
        "bg-warning-subtle text-warning-subtle-foreground ring-1 ring-warning/40",
        className,
      )}
      {...props}
    >
      <CrownIcon aria-hidden />
      {children}
    </span>
  );
}

/** Marks a verified/claimed business or profile. */
export function VerifiedBadge({
  children = "Verified",
  size = "md",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(base, sizes[size], "bg-info-subtle text-info-subtle-foreground", className)}
      {...props}
    >
      <ShieldCheckIcon aria-hidden />
      {children}
    </span>
  );
}

/** Marks new or featured content. */
export function FeaturedBadge({
  children = "Featured",
  size = "md",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        base,
        sizes[size],
        "bg-primary-subtle text-primary-subtle-foreground",
        className,
      )}
      {...props}
    >
      <SparklesIcon aria-hidden />
      {children}
    </span>
  );
}
