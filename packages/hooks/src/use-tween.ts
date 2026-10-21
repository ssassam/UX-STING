"use client";
import {
  easings,
  spring,
  springDuration,
  type EasingFunction,
  type SpringConfig,
} from "@ux-sting/utils";
import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";
import { usePrefersReducedMotion } from "./use-media-query.js";

export interface UseTweenOptions {
  /** Duration in ms for eased tweens. Ignored when `spring` is set. Default 600. */
  duration?: number;
  /** Easing for duration-based tweens. Default `easings.standard`. */
  easing?: EasingFunction;
  /** Animate with spring physics instead of a fixed duration. */
  spring?: SpringConfig;
  /** Value shown before the first animation. Defaults to `target` (no initial animation). */
  from?: number;
  /** Skip animation entirely (e.g. while off-screen). */
  disabled?: boolean;
}

/**
 * Animates a number toward `target` on `requestAnimationFrame` and returns the
 * current value. Retargeting mid-flight continues from the current value.
 * Jumps straight to the target when the user prefers reduced motion.
 */
export function useTween(target: number, options: UseTweenOptions = {}): number {
  const {
    duration = 600,
    easing = easings.standard,
    spring: springConfig,
    from,
    disabled,
  } = options;
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(from ?? target);
  const current = useRef(value);
  const easingRef = useRef(easing);
  const springRef = useRef(springConfig);
  useIsomorphicLayoutEffect(() => {
    easingRef.current = easing;
    springRef.current = springConfig;
  });

  useEffect(() => {
    const start = current.current;
    const set = (v: number) => {
      current.current = v;
      setValue(v);
    };
    if (start === target) return;
    if (reduced || disabled || typeof requestAnimationFrame === "undefined") {
      set(target);
      return;
    }
    const springCfg = springRef.current;
    const total = springCfg ? springDuration(springCfg) * 1000 : duration;
    let frame = 0;
    let startTime: number | null = null;
    const tick = (now: number) => {
      startTime ??= now;
      const elapsed = now - startTime;
      if (elapsed >= total) {
        set(target);
        return;
      }
      const progress = springCfg
        ? spring(elapsed / 1000, springCfg)
        : easingRef.current(elapsed / total);
      set(start + (target - start) * progress);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduced, disabled]);

  return value;
}
