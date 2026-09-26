"use client";
import { useControllableState } from "@unified-ui/hooks";
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "@unified-ui/icons";
import { cn, getPaginationRange } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useLocale, useMessages } from "../../provider/context.js";
import { buttonVariants } from "../button/button.variants.js";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Link mode (crawlable): return the URL for a page. */
  getHref?: (page: number) => string;
  /** Render links with a router component, e.g. Next.js `Link`. */
  renderLink?: (props: { href: string; className: string; children: ReactNode; "aria-current"?: "page"; "aria-label": string }) => ReactNode;
  siblings?: number;
  size?: "sm" | "md";
  /** `compact` shows "Page x of y" (auto on small screens). */
  variant?: "default" | "compact";
}

/**
 * Page navigation. Use `getHref` for SEO-friendly links (listings, search)
 * or `onPageChange` for in-place tables. Collapses to a compact summary on
 * narrow screens.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { totalPages, page: pageProp, defaultPage = 1, onPageChange, getHref, renderLink, siblings = 1, size = "md", variant = "default", className, ...props },
  ref,
) {
  const [page, setPage] = useControllableState({ value: pageProp, defaultValue: defaultPage, onChange: onPageChange });
  const messages = useMessages();
  const { locale } = useLocale();
  const nf = new Intl.NumberFormat(locale);
  if (totalPages <= 1) return null;

  const item = (target: number, children: ReactNode, opts: { label: string; current?: boolean; disabled?: boolean; className?: string }) => {
    const className = cn(
      buttonVariants({ variant: opts.current ? "outline" : "ghost", size: size === "sm" ? "sm" : "md" }),
      "min-w-(--ui-height-md) px-2 tabular-nums",
      size === "sm" && "min-w-(--ui-height-sm)",
      opts.current && "border-primary text-primary",
      opts.className,
    );
    if (opts.disabled) {
      return (
        <span aria-disabled="true" className={cn(className, "pointer-events-none opacity-40")}>
          {children}
        </span>
      );
    }
    if (getHref) {
      const href = getHref(target);
      const linkProps = { href, className, children, "aria-label": opts.label, ...(opts.current ? { "aria-current": "page" as const } : {}) };
      return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
    }
    return (
      <button type="button" className={className} aria-label={opts.label} aria-current={opts.current ? "page" : undefined} onClick={() => setPage(target)}>
        {children}
      </button>
    );
  };

  const prev = item(page - 1, <ChevronLeftIcon className="rtl:rotate-180" />, { label: messages.previous, disabled: page <= 1 });
  const next = item(page + 1, <ChevronRightIcon className="rtl:rotate-180" />, { label: messages.next, disabled: page >= totalPages });

  return (
    <nav ref={ref} aria-label={messages.pagination} className={cn("flex items-center justify-center", className)} {...props}>
      <ul className="flex items-center gap-1">
        <li>{prev}</li>
        <li className={cn("px-2 text-sm tabular-nums text-muted-foreground", variant === "compact" ? "block" : "sm:hidden")} aria-live="polite">
          {messages.pageOf(page, totalPages)}
        </li>
        {variant === "default"
          ? getPaginationRange(page, totalPages, siblings).map((p, i) =>
              p === "ellipsis" ? (
                <li key={`e${i}`} aria-hidden className="hidden size-9 items-center justify-center text-muted-foreground sm:flex [&_svg]:size-4">
                  <EllipsisIcon />
                </li>
              ) : (
                <li key={p} className="hidden sm:block">
                  {item(p, nf.format(p), { label: messages.goToPage(p), current: p === page })}
                </li>
              ),
            )
          : null}
        <li>{next}</li>
      </ul>
    </nav>
  );
});
