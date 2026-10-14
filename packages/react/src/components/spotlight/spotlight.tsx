"use client";
import { cn } from "@ux-sting/utils";
import {
  forwardRef,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
} from "react";
import { useMergedRefs } from "@ux-sting/hooks";

export interface SpotlightProps extends HTMLAttributes<HTMLDivElement> {
  /** Glow radius in px. Default 320. */
  size?: number;
}

/**
 * A soft glow that follows the pointer across a card or section. Mouse and
 * pen only — on touch screens nothing changes — and it never covers content
 * or catches clicks. The glow uses the theme's primary color.
 */
export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(function Spotlight(
  { size = 320, className, style, onPointerMove, ...props },
  ref,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const merged = useMergedRefs(ref, innerRef);
  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const el = innerRef.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--ui-spotlight-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--ui-spotlight-y", `${event.clientY - rect.top}px`);
  };
  return (
    <div
      ref={merged}
      className={cn("ui-spotlight relative isolate", className)}
      style={{ "--ui-spotlight-size": `${size}px`, ...style } as CSSProperties}
      onPointerMove={handleMove}
      {...props}
    />
  );
});

export interface TiltProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum rotation in degrees. Keep it subtle. Default 6. */
  max?: number;
}

/**
 * Tilts its content slightly towards the pointer, for hero media and
 * feature cards. It does nothing for touch, coarse pointers or reduced
 * motion, and it animates transform only.
 */
export const Tilt = forwardRef<HTMLDivElement, TiltProps>(function Tilt(
  { max = 6, className, onPointerMove, onPointerLeave, ...props },
  ref,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const merged = useMergedRefs(ref, innerRef);
  const set = (x: number, y: number) => {
    innerRef.current?.style.setProperty("--ui-tilt-x", `${x}deg`);
    innerRef.current?.style.setProperty("--ui-tilt-y", `${y}deg`);
  };
  return (
    <div
      ref={merged}
      className={cn("ui-tilt", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const el = innerRef.current;
        if (!el || event.pointerType === "touch") return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        set(-py * max * 2, px * max * 2);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        set(0, 0);
      }}
      {...props}
    />
  );
});
