import { Slot } from "@ux-sting/primitives";
import { cn, createVariants, type VariantProps } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes } from "react";

export const cardVariants = createVariants({
  base: "group/card relative flex flex-col overflow-hidden rounded-xl text-card-foreground",
  variants: {
    variant: {
      default: "border border-border bg-card",
      elevated: "border border-border/60 bg-card shadow-sm",
      filled: "bg-surface",
      ghost: "bg-transparent",
    },
    interactive: {
      true: "transition-[box-shadow,border-color,transform] duration-(--ui-duration-normal) hover:border-border-strong hover:shadow-md focus-within:ring-2 focus-within:ring-ring has-[a:focus-visible]:ring-2",
      false: "",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

/**
 * Groups related content. Compose `CardHeader`, `CardContent`, `CardFooter`.
 * For a clickable card, put a single `CardLink` (stretched) inside.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild, variant, interactive, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp ref={ref} className={cardVariants({ variant, interactive, className })} {...props} />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "grid auto-rows-min grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-card-p pt-card-p [&:last-child]:pb-card-p",
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" | "div" }
>(function CardTitle({ as: Comp = "h3", className, ...props }, ref) {
  return (
    <Comp
      ref={ref}
      className={cn("col-start-1 text-lg font-semibold leading-snug tracking-tight", className)}
      {...props}
    />
  );
});

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("col-start-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

/** Top-end slot in the header for a menu or badge. */
export const CardAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardAction({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
        {...props}
      />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex-1 px-card-p py-4 first:pt-card-p last:pb-card-p", className)}
        {...props}
      />
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-card-p pb-card-p", className)}
        {...props}
      />
    );
  },
);

/** Full-bleed media area (image/video) at the top or middle of a card. */
export const CardMedia = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(function CardMedia({ ratio = 16 / 9, className, style, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-muted [&>img]:size-full [&>img]:object-cover",
        className,
      )}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
});

/**
 * A link whose hit area stretches over the whole card while keeping other
 * interactive elements (buttons) clickable above it.
 */
export const CardLink = forwardRef<
  HTMLAnchorElement,
  HTMLAttributes<HTMLAnchorElement> & { href?: string; asChild?: boolean }
>(function CardLink({ asChild, className, ...props }, ref) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] hover:underline focus-visible:after:ring-2 focus-visible:after:ring-ring",
        className,
      )}
      {...props}
    />
  );
});
