"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, useEffect, useRef, type HTMLAttributes } from "react";
import { useMergedRefs } from "@ux-sting/hooks";

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Pin to the top of the viewport. Default `true`; set `false` to place it yourself. */
  fixed?: boolean;
}

/**
 * Reading-progress bar for long articles and docs. It uses CSS scroll-driven
 * animations where the browser supports them, with a passive scroll listener
 * as the fallback. The bar is decorative, so it is hidden from assistive tech.
 */
export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress({ fixed = true, className, ...props }, ref) {
    const barRef = useRef<HTMLDivElement>(null);
    const merged = useMergedRefs(ref, barRef);

    useEffect(() => {
      const bar = barRef.current;
      if (!bar || (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()")))
        return;
      let frame = 0;
      const update = () => {
        frame = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        bar.style.setProperty("--ui-scroll-progress", String(max > 0 ? doc.scrollTop / max : 0));
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, []);

    return (
      <div
        ref={merged}
        aria-hidden
        className={cn(
          "ui-scroll-progress h-1 bg-primary",
          fixed && "fixed inset-x-0 top-0 z-header",
          className,
        )}
        {...props}
      />
    );
  },
);
