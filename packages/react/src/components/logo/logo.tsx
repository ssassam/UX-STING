import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";

const sizes = {
  sm: { mark: "size-6", text: "text-md", gap: "gap-2", stackGap: "gap-1" },
  md: { mark: "size-8", text: "text-lg", gap: "gap-2.5", stackGap: "gap-1.5" },
  lg: { mark: "size-10", text: "text-xl", gap: "gap-3", stackGap: "gap-2" },
  xl: { mark: "size-14", text: "text-3xl", gap: "gap-4", stackGap: "gap-2.5" },
};

const tones = {
  /** Mark in the brand color, wordmark in the text color. */
  brand: { mark: "text-primary", text: "text-foreground" },
  /** Everything in the current text color (one-colour version). */
  mono: { mark: "", text: "" },
  /** For brand-colored backgrounds (`bg-primary`). */
  reversed: { mark: "text-primary-foreground", text: "text-primary-foreground" },
};

export interface LogoProps extends HTMLAttributes<HTMLElement> {
  /** Brand name: the accessible name, and the wordmark when `wordmark` is not given. */
  name: string;
  /** The symbol as inline SVG using `fill="currentColor"`, so it follows tokens and color modes. */
  mark?: ReactNode;
  /** Custom wordmark (e.g. a constructed SVG logotype). Defaults to `name` set in the heading font. */
  wordmark?: ReactNode;
  /** `horizontal` (default), `stacked`, `mark` (symbol only) or `wordmark` (text only). */
  layout?: "horizontal" | "stacked" | "mark" | "wordmark";
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  /** Renders the logo as a home link. */
  href?: string;
  /** Accessible name override, e.g. "Acme home". Defaults to `name`. */
  label?: string;
}

/**
 * Brand lockup: symbol + wordmark with locked spacing and sizes. Exposed to
 * assistive tech as one image (or link) named after the brand; the SVG
 * itself is hidden. For router links, omit `href` and wrap the Logo in your
 * Link. Pair with the `logo-design` skill to create the mark. Server-compatible.
 */
export const Logo = forwardRef<HTMLElement, LogoProps>(function Logo(
  {
    name,
    mark,
    wordmark,
    layout = "horizontal",
    size = "md",
    tone = "brand",
    href,
    label,
    className,
    children,
    ...props
  },
  ref,
) {
  const s = sizes[size];
  const t = tones[tone];
  const showMark = layout !== "wordmark" && mark;
  const showText = layout !== "mark";
  const content = (
    <>
      {showMark ? (
        <span aria-hidden className={cn("inline-flex shrink-0 [&>svg]:size-full", s.mark, t.mark)}>
          {mark}
        </span>
      ) : null}
      {showText ? (
        <span
          aria-hidden
          className={cn("font-semibold leading-none tracking-tight", s.text, t.text)}
        >
          {wordmark ?? name}
        </span>
      ) : null}
      {children}
    </>
  );
  const shared = {
    className: cn(
      "inline-flex items-center",
      layout === "stacked" ? cn("flex-col", s.stackGap) : s.gap,
      href &&
        "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    ),
    "aria-label": label ?? name,
    ...props,
  };
  if (href) {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} {...shared}>
        {content}
      </a>
    );
  }
  return (
    <span ref={ref} role="img" {...shared}>
      {content}
    </span>
  );
});
