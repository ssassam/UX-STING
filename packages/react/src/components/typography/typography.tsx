import { Slot } from "@unified-ui/primitives";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type ElementType, type HTMLAttributes, type LabelHTMLAttributes, type AnchorHTMLAttributes, type BlockquoteHTMLAttributes } from "react";
import type { PolymorphicProps } from "../../lib/polymorphic.js";

export const textVariants = createVariants({
  base: "",
  variants: {
    size: { xs: "text-xs", sm: "text-sm", md: "text-md", lg: "text-lg", xl: "text-xl" },
    weight: { normal: "font-normal", medium: "font-medium", semibold: "font-semibold", bold: "font-bold" },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning-subtle-foreground",
      info: "text-info",
      inherit: "",
    },
    align: { start: "text-start", center: "text-center", end: "text-end" },
    truncate: { true: "truncate", false: "" },
    tabular: { true: "tabular-nums", false: "" },
  },
  defaultVariants: { variant: "inherit" },
});

export type TextProps<E extends ElementType = "p"> = PolymorphicProps<E, VariantProps<typeof textVariants>>;

/** Body text. Renders a `<p>` by default; use `as="span"` inline. */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as, asChild, size, weight, variant, align, truncate, tabular, className, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "p");
  return <Comp ref={ref} className={textVariants({ size, weight, variant, align, truncate, tabular, className })} {...props} />;
});

export const headingVariants = createVariants({
  base: "font-semibold tracking-tight text-foreground text-balance",
  variants: {
    size: {
      xs: "text-md",
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
      "2xl": "text-4xl",
      "3xl": "text-4xl sm:text-5xl",
    },
  },
  defaultVariants: { size: "lg" },
});

const levelToSize = { 1: "2xl", 2: "xl", 3: "lg", 4: "md", 5: "sm", 6: "xs" } as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Semantic level (h1–h6). Visual size is independent — keep a logical outline. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  asChild?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, asChild, className, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (`h${level}` as const);
  return <Comp ref={ref} className={headingVariants({ size: size ?? levelToSize[level], className })} {...props} />;
});

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Shows a required indicator (the input itself should carry `required`). */
  required?: boolean;
  disabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required, disabled, className, children, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium leading-snug text-foreground select-none data-disabled:cursor-not-allowed data-disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden className="text-destructive">
          *
        </span>
      ) : null}
    </label>
  );
});

export const Caption = forwardRef<HTMLElement, TextProps>(function Caption({ className, ...props }, ref) {
  return <Text ref={ref} as="span" size="xs" variant="muted" className={cn("leading-4", className)} {...props} />;
});

export const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Code({ className, ...props }, ref) {
  return (
    <code
      ref={ref}
      className={cn("rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground ui-wrap-anywhere", className)}
      {...props}
    />
  );
});

export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Kbd({ className, ...props }, ref) {
  return (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-border bg-surface px-1 font-mono text-[0.6875rem] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

export const linkVariants = createVariants({
  base: "rounded-xs font-medium underline-offset-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
  variants: {
    variant: {
      default: "text-primary underline decoration-primary/40 hover:decoration-primary",
      muted: "text-muted-foreground underline hover:text-foreground",
      plain: "text-inherit no-underline hover:underline",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  /** Render a router link (e.g. Next.js `Link`) as the child. */
  asChild?: boolean;
  /** Opens in a new tab with safe `rel` and an accessible hint. */
  external?: boolean;
  /** Screen reader hint for external links; localize as needed. */
  externalLabel?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { asChild, external, externalLabel = "(opens in a new tab)", variant, className, children, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : "a";
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Comp ref={ref} className={linkVariants({ variant, className })} {...externalProps} {...props}>
      {children}
      {external && !asChild ? <span className="sr-only"> {externalLabel}</span> : null}
    </Comp>
  );
});

export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteHTMLAttributes<HTMLQuoteElement>>(function Blockquote(
  { className, ...props },
  ref,
) {
  return (
    <blockquote
      ref={ref}
      className={cn("border-s-2 border-primary ps-4 text-lg italic leading-relaxed text-foreground", className)}
      {...props}
    />
  );
});

/** Long-form content wrapper with readable measure and rhythm. */
export const Prose = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Prose({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "max-w-[65ch] text-md leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:my-4 [&_ul]:list-disc [&_ul]:ps-6 [&_blockquote]:border-s-2 [&_blockquote]:border-primary [&_blockquote]:ps-4 [&_blockquote]:italic",
        className,
      )}
      {...props}
    />
  );
});
