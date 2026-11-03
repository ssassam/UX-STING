import { cn } from "@ux-sting/utils";
import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";

export type TextEffectPreset = "fade" | "blur" | "slide" | "scale";

export interface TextEffectProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The text to animate. Plain text only, so it can be split safely. */
  children: string;
  /** Element to render. Default `p`. */
  as?: ElementType;
  /** Animate per word or per character. Default `word`. */
  per?: "word" | "char";
  /** Entrance style. Default `fade`. */
  preset?: TextEffectPreset;
  /** Delay before the first piece, in ms. */
  delay?: number;
  /** Delay between pieces, in ms. Defaults to 60 (word) or 25 (char). */
  stagger?: number;
  /** Duration of each piece, in ms. Default 600. Ignored with `trigger="scroll"`. */
  duration?: number;
  /**
   * `load` (default): play the entrance once (inside a `Reveal`, when it scrolls
   * into view). `scroll`: tie it to scroll position: pieces ink from muted to
   * full, in reading order, as the block crosses the viewport. For one large
   * tagline or benefit statement per page. `preset`, `delay`, `stagger` and
   * `duration` do not apply; browsers without scroll-driven animations and
   * reduced motion show the final text.
   */
  trigger?: "load" | "scroll";
}

/**
 * Staggered text entrance in pure CSS: a server component with no client
 * JavaScript. Screen readers get the whole sentence once; the animated pieces
 * are hidden from them. Nothing moves under reduced motion. Inside a
 * `Reveal`, the animation waits until the text scrolls into view; with
 * `trigger="scroll"` it follows the scroll position instead.
 */
export const TextEffect = forwardRef<HTMLElement, TextEffectProps>(function TextEffect(
  {
    children,
    as: Tag = "p",
    per = "word",
    preset = "fade",
    delay = 0,
    stagger,
    duration = 600,
    trigger = "load",
    className,
    style,
    ...props
  },
  ref,
) {
  const words = children.split(/(\s+)/);
  const count =
    per === "char"
      ? words.reduce((n, w) => n + (/^\s*$/.test(w) ? 0 : Array.from(w).length), 0)
      : words.filter((w) => !/^\s*$/.test(w)).length;
  let index = 0;
  const piece = (text: string, key: string | number) => (
    <span key={key} className="ui-text-effect-piece" style={{ "--ui-i": index++ } as CSSProperties}>
      {text}
    </span>
  );
  return (
    <Tag
      ref={ref}
      className={cn("ui-text-effect", className)}
      data-preset={preset}
      data-trigger={trigger === "scroll" ? "scroll" : undefined}
      style={
        {
          "--ui-n": Math.max(1, count),
          "--ui-te-delay": `${delay}ms`,
          "--ui-te-stagger": `${stagger ?? (per === "char" ? 25 : 60)}ms`,
          "--ui-te-duration": `${duration}ms`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, i) =>
          /^\s+$/.test(word) || word === "" ? (
            word
          ) : per === "char" ? (
            <span key={i} className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, j) => piece(char, j))}
            </span>
          ) : (
            piece(word, i)
          ),
        )}
      </span>
    </Tag>
  );
});

export interface TextShimmerProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `span`. */
  as?: ElementType;
  /** Seconds per sweep. Default 2. */
  duration?: number;
}

/**
 * A light sweep across text — for "Thinking…", "Generating…" and other
 * in-progress labels. Pure CSS; static under reduced motion and in forced
 * colors. Keep it to short status text, never body copy.
 */
export const TextShimmer = forwardRef<HTMLElement, TextShimmerProps>(function TextShimmer(
  { as: Tag = "span", duration = 2, className, style, ...props },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn("ui-text-shimmer", className)}
      style={{ "--ui-shimmer-duration": `${duration}s`, ...style } as CSSProperties}
      {...props}
    />
  );
});
