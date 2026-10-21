"use client";
import { PauseIcon, PlayIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import { useMessages } from "../../provider/context.js";

export interface MarqueeProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name, e.g. "Customer logos". */
  label: string;
  /** Seconds for one full loop. Default 40. */
  duration?: number;
  /** Scroll towards the inline end instead of the start. */
  reverse?: boolean;
  /** Pause while hovered or while focus is inside. Default `true`. */
  pauseOnHover?: boolean;
  /** Fade the edges. Default `true`. */
  fade?: boolean;
  /** Show the play/pause button (WCAG 2.2.2). Default `true`. */
  controls?: boolean;
}

/**
 * An endless row of logos, quotes or tags. It pauses on hover and focus and
 * has a pause button, as WCAG 2.2.2 requires for motion lasting over five
 * seconds. With reduced motion it becomes a plain scrollable row. The
 * duplicate copy that makes the loop seamless is hidden from assistive tech
 * and the tab order. Mirrors in RTL.
 */
export const Marquee = forwardRef<HTMLElement, MarqueeProps>(function Marquee(
  {
    label,
    duration = 40,
    reverse = false,
    pauseOnHover = true,
    fade = true,
    controls = true,
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const [paused, setPaused] = useState(false);
  return (
    <section
      ref={ref}
      aria-label={label}
      className={cn("ui-marquee flex items-center gap-2", className)}
      data-paused={paused ? "" : undefined}
      data-reverse={reverse ? "" : undefined}
      data-hover-pause={pauseOnHover ? "" : undefined}
      data-fade={fade ? "" : undefined}
      style={{ "--ui-marquee-duration": `${duration}s`, ...style } as CSSProperties}
      {...props}
    >
      <div className="ui-marquee-viewport min-w-0 flex-1">
        <div className="ui-marquee-track">
          <div className="ui-marquee-group">{children}</div>
          <div className="ui-marquee-group ui-marquee-clone" aria-hidden inert>
            {children}
          </div>
        </div>
      </div>
      {controls ? (
        <button
          type="button"
          aria-label={paused ? messages.playAnimation : messages.pauseAnimation}
          onClick={() => setPaused((p) => !p)}
          className="ui-marquee-toggle ui-hit-area inline-flex size-7 shrink-0 motion-reduce:hidden items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      ) : null}
    </section>
  );
});
