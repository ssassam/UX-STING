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
  /** Duration of each piece, in ms. Default 600. */
  duration?: number;
}

/**
 * Staggered text entrance in pure CSS: a server component with no client
 * JavaScript. Screen readers get the whole sentence once; the animated pieces
 * are hidden from them. Nothing moves under reduced motion. Inside a
 * `Reveal`, the animation waits until the text scrolls into view.
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
    className,
    style,
    ...props
  },
  ref,
) {
  const words = children.split(/(\s+)/);
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
      style={
        {
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
