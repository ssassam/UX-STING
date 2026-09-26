import { ChevronRightIcon, EllipsisIcon } from "@unified-ui/icons";
import { Slot } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes } from "react";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the landmark (localize it). */
  label?: string;
}

/** Shows the page's location in a hierarchy (3+ levels). Server component. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { label = "Breadcrumb", className, children, ...props },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2">{children}</ol>
    </nav>
  );
});

export const BreadcrumbItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function BreadcrumbItem(
  { className, ...props },
  ref,
) {
  return <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
});

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }>(
  function BreadcrumbLink({ asChild, className, ...props }, ref) {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        className={cn("rounded-xs transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", className)}
        {...props}
      />
    );
  },
);

export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbPage(
  { className, ...props },
  ref,
) {
  return <span ref={ref} aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />;
});

export function BreadcrumbSeparator({ className, children, ...props }: LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li role="presentation" aria-hidden className={cn("[&_svg]:size-3.5 rtl:[&_svg]:rotate-180", className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, label = "More", ...props }: HTMLAttributes<HTMLSpanElement> & { label?: string }) {
  return (
    <span className={cn("flex size-6 items-center justify-center [&_svg]:size-4", className)} {...props}>
      <EllipsisIcon />
      <span className="sr-only">{label}</span>
    </span>
  );
}
