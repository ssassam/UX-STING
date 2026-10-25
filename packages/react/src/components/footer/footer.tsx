import { ExternalLinkIcon } from "@ux-sting/icons";
import { Slot } from "@ux-sting/primitives";
import { cn } from "@ux-sting/utils";
import {
  Children,
  forwardRef,
  Fragment,
  isValidElement,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/*
 * Colors come from --footer-* variables so a site can retint the footer
 * without touching the theme: set them on the <Footer> (style/className).
 * `inverse` is a dark band whatever the color mode; `default` follows the
 * theme's surface tokens.
 */
const TONES: Record<"default" | "inverse", CSSProperties> = {
  default: {
    "--footer-bg": "var(--ui-surface)",
    "--footer-fg": "var(--ui-foreground)",
    "--footer-muted": "var(--ui-muted-foreground)",
    "--footer-border": "var(--ui-border)",
    "--footer-accent": "var(--ui-primary)",
  } as CSSProperties,
  inverse: {
    "--footer-bg": "var(--ui-slate-950)",
    "--footer-fg": "var(--ui-slate-50)",
    "--footer-muted": "color-mix(in oklab, var(--ui-slate-50) 66%, transparent)",
    "--footer-border": "color-mix(in oklab, var(--ui-slate-50) 12%, transparent)",
    "--footer-accent": "var(--ui-primary)",
  } as CSSProperties,
};

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** `inverse` = dark band in every color mode; `default` = theme surface. */
  tone?: "default" | "inverse";
  /** Max width of the inner container. */
  maxWidth?: "md" | "lg" | "xl" | "full";
}

/**
 * Site footer (`contentinfo` landmark). Compose `FooterCallout` (optional
 * CTA band), `FooterMain` with `FooterBrand` + `FooterNav` of
 * `FooterColumn`s, then `FooterBottom` with `FooterCopyright` and
 * `FooterLegal`. Links use `FooterLink` (`asChild` for router links).
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { tone = "inverse", maxWidth = "xl", className, style, children, ...props },
  ref,
) {
  return (
    <footer
      ref={ref}
      data-tone={tone}
      style={{ ...TONES[tone], ...style }}
      className={cn(
        "w-full bg-(--footer-bg) text-(--footer-fg)",
        tone === "default" && "border-t border-(--footer-border)",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto px-4 py-12 sm:px-6 sm:py-14 lg:px-8",
          maxWidth === "md" && "max-w-5xl",
          maxWidth === "lg" && "max-w-6xl",
          maxWidth === "xl" && "max-w-7xl",
        )}
      >
        {children}
      </div>
    </footer>
  );
});

export interface FooterCalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons / links shown on the end side. */
  actions?: ReactNode;
}

/** Call-to-action band at the top of the footer (newsletter, sign-up, "list your business"). */
export const FooterCallout = forwardRef<HTMLDivElement, FooterCalloutProps>(function FooterCallout(
  { title, description, actions, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 flex flex-col gap-5 rounded-lg border border-(--footer-border) p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between",
        "bg-[color-mix(in_oklab,var(--footer-accent)_14%,transparent)]",
        className,
      )}
      {...props}
    >
      <div className="max-w-2xl">
        <p className="text-lg font-semibold tracking-tight sm:text-xl">{title}</p>
        {description ? <p className="mt-1.5 text-sm text-(--footer-muted)">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
});

/** Brand column + navigation grid. */
export const FooterMain = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FooterMain({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] lg:gap-16",
          className,
        )}
        {...props}
      />
    );
  },
);

/** Logo, tagline, contact and newsletter. */
export const FooterBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FooterBrand({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("flex flex-col items-start gap-5", className)} {...props} />
    );
  },
);

export const FooterTagline = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FooterTagline({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("max-w-sm text-sm leading-relaxed text-(--footer-muted)", className)}
        {...props}
      />
    );
  },
);

export interface FooterNavProps extends HTMLAttributes<HTMLElement> {
  /** Columns from `lg` up (2 on phones, 3 on tablets). */
  columns?: 2 | 3 | 4 | 5 | 6;
}

/** `<nav>` grid of `FooterColumn`s. Give it an `aria-label`. */
export const FooterNav = forwardRef<HTMLElement, FooterNavProps>(function FooterNav(
  { columns = 4, className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3",
        columns === 2 && "lg:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        columns === 5 && "lg:grid-cols-5",
        columns === 6 && "lg:grid-cols-6",
        className,
      )}
      {...props}
    />
  );
});

export interface FooterColumnProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  /** Heading level of the column title (default 2). */
  headingLevel?: 2 | 3 | 4;
}

/** Titled list of `FooterLink`s. */
export const FooterColumn = forwardRef<HTMLDivElement, FooterColumnProps>(function FooterColumn(
  { title, headingLevel = 2, className, children, ...props },
  ref,
) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <div ref={ref} className={cn("min-w-0", className)} {...props}>
      <Heading className="text-sm font-semibold">{title}</Heading>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
});

export interface FooterLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  /** Leading icon (decorative). */
  icon?: ReactNode;
  /** Opens in a new tab with an external-link hint for screen readers. */
  external?: boolean;
  /** Small badge after the label, e.g. "Nouveau". */
  badge?: ReactNode;
  /** Screen-reader hint appended to external links. */
  externalLabel?: string;
}

/** A footer link inside `FooterColumn` (renders its own `<li>`). */
export const FooterLink = forwardRef<HTMLAnchorElement, FooterLinkProps>(function FooterLink(
  {
    asChild,
    icon,
    external,
    badge,
    externalLabel = "(opens in a new tab)",
    className,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  const content = asChild ? (
    children
  ) : (
    <>
      {icon ? (
        <span aria-hidden className="text-(--footer-accent) [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      {children}
      {badge ? (
        <span className="rounded-full bg-(--footer-accent) px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
          {badge}
        </span>
      ) : null}
      {external ? (
        <>
          <ExternalLinkIcon aria-hidden className="size-3 opacity-60" />
          <span className="sr-only"> {externalLabel}</span>
        </>
      ) : null}
    </>
  );
  return (
    <li>
      <Comp
        ref={ref}
        {...(external && !asChild ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "inline-flex items-center gap-2 rounded-sm text-(--footer-muted) transition-colors outline-none",
          "hover:text-(--footer-fg) focus-visible:ring-2 focus-visible:ring-(--footer-accent) aria-[current=page]:text-(--footer-fg)",
          className,
        )}
        {...props}
      >
        {content}
      </Comp>
    </li>
  );
});

/** Bottom bar: copyright on the start side, legal links / switches on the end side. */
export const FooterBottom = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FooterBottom({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mt-12 flex flex-col gap-4 border-t border-(--footer-border) pt-6 text-xs text-(--footer-muted) md:flex-row md:items-center md:justify-between",
          className,
        )}
        {...props}
      />
    );
  },
);

export const FooterCopyright = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FooterCopyright({ className, ...props }, ref) {
  return <p ref={ref} className={cn(className)} {...props} />;
});

/** Inline list of legal links, separated by a small dot. Children: `<a>`s or router links. */
export const FooterLegal = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  function FooterLegal({ className, children, ...props }, ref) {
    const items = Children.toArray(children).filter(isValidElement);
    return (
      <ul
        ref={ref}
        className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}
        {...props}
      >
        {items.map((child, i) => (
          <Fragment key={child.key ?? i}>
            {i > 0 ? <li aria-hidden className="size-1 rounded-full bg-(--footer-border)" /> : null}
            <li className="[&_a]:transition-colors [&_a:hover]:text-(--footer-fg)">{child}</li>
          </Fragment>
        ))}
      </ul>
    );
  },
);
