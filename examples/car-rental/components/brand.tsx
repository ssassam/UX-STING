import { Logo } from "@ux-sting/react/logo";
import type { ReactNode } from "react";

/**
 * The Drivo mark: a "D" drawn as one road — the stem is the straight, the bowl
 * is the hairpin, the chevron is the direction of travel. Stroke-only and
 * `currentColor`, so it follows the theme and the colour mode like an icon.
 */
export function DrivoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6.5 21V3" />
      <path d="M6.5 3H11a8 8 0 0 1 0 16H6.5" />
      <path d="m11.5 8.5 3.5 3.5-3.5 3.5" />
    </svg>
  );
}

/** The wordmark as set type (used instead of a drawn logotype). */
function Wordmark({ size }: { size: "sm" | "md" | "lg" | "xl" }) {
  const scale = { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-2xl" }[size];
  return (
    <span className={`font-display font-bold uppercase tracking-[0.08em] ${scale}`}>Drivo</span>
  );
}

/**
 * Brand lockup. `href` makes it a home link; `tone="reversed"` is for the red
 * field; `layout="mark"` is the monogram alone.
 */
export function DrivoLogo({
  size = "md",
  tone = "brand",
  layout = "horizontal",
  href,
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "brand" | "mono" | "reversed";
  layout?: "horizontal" | "stacked" | "mark" | "wordmark";
  href?: string;
  className?: string;
}): ReactNode {
  return (
    <Logo
      name="Drivo"
      mark={<DrivoMark />}
      wordmark={<Wordmark size={size} />}
      size={size}
      tone={tone}
      layout={layout}
      href={href}
      label={href ? "Drivo — home" : "Drivo"}
      className={className}
    />
  );
}
