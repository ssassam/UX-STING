/**
 * Timeline presets: small, composable GSAP recipes on UX-STING's motion
 * scale. Each returns a timeline or tween you can nest (`tl.add(preset())`),
 * reverse or kill. Under reduced motion they jump to the end state.
 */
import { gsap } from "gsap";
import { prefersReducedMotion } from "../core.js";

type Targets = gsap.TweenTarget;

/** UX-STING durations in seconds (tokens: fast 120ms, normal 200ms, slow 300ms, slower 450ms). */
export const DURATION = { fast: 0.12, normal: 0.2, slow: 0.3, slower: 0.45 } as const;
/** GSAP equivalents of the easing tokens. */
export const EASE = {
  standard: "power3.out",
  emphasized: "back.out(1.4)",
  in: "power2.in",
  out: "power2.out",
  inOut: "power2.inOut",
} as const;

const finish = <T extends gsap.core.Animation>(a: T): T =>
  prefersReducedMotion() ? (a.progress(1), a) : a;

export interface FadeUpOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

/** Fade and rise in (from 24px below by default). */
export function fadeUp(targets: Targets, o: FadeUpOptions = {}) {
  return finish(
    gsap.from(targets, {
      autoAlpha: 0,
      y: o.y ?? 24,
      duration: o.duration ?? 0.6,
      stagger: o.stagger ?? 0.06,
      delay: o.delay ?? 0,
      ease: EASE.standard,
    }),
  );
}

/** A grid or list entering in reading order, row by row. */
export function staggerIn(
  targets: Targets,
  o: { each?: number; from?: "start" | "center" | "end" } = {},
) {
  return finish(
    gsap.from(targets, {
      autoAlpha: 0,
      y: 16,
      scale: 0.98,
      duration: DURATION.slower,
      ease: EASE.standard,
      stagger: { each: o.each ?? 0.05, from: o.from ?? "start", grid: "auto" },
    }),
  );
}

export interface HeroParts {
  eyebrow?: Targets;
  heading: Targets;
  body?: Targets;
  actions?: Targets;
  media?: Targets;
}

/**
 * A hero entrance as one timeline with labels: eyebrow → heading → body and
 * actions overlap → media settles. Give it a split heading's words for a
 * richer effect, or the heading element itself.
 */
export function heroIntro(parts: HeroParts, o: { speed?: number } = {}) {
  const tl = gsap.timeline({ defaults: { ease: EASE.standard, duration: 0.7 } });
  if (parts.eyebrow) tl.from(parts.eyebrow, { autoAlpha: 0, y: 8, duration: 0.4 }, "start");
  tl.from(
    parts.heading,
    { autoAlpha: 0, yPercent: 40, stagger: 0.05 },
    parts.eyebrow ? "start+=0.1" : "start",
  );
  tl.addLabel("copy", "-=0.4");
  if (parts.body) tl.from(parts.body, { autoAlpha: 0, y: 12 }, "copy");
  if (parts.actions) tl.from(parts.actions, { autoAlpha: 0, y: 12, stagger: 0.06 }, "copy+=0.08");
  if (parts.media)
    tl.from(
      parts.media,
      { autoAlpha: 0, scale: 1.04, duration: 1.1, ease: EASE.out },
      "start+=0.15",
    );
  tl.timeScale(o.speed ?? 1);
  return finish(tl);
}

/**
 * Counts a number up into `el.textContent`, formatted with Intl. The final
 * text is set immediately for assistive tech via `aria-label`.
 */
export function countUp(
  el: HTMLElement,
  to: number,
  o: { from?: number; duration?: number; format?: Intl.NumberFormat } = {},
) {
  const format = o.format ?? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
  const value = { n: o.from ?? 0 };
  el.setAttribute("aria-label", format.format(to));
  return finish(
    gsap.to(value, {
      n: to,
      duration: o.duration ?? 1.2,
      ease: EASE.out,
      onUpdate: () => {
        el.textContent = format.format(value.n);
      },
    }),
  );
}

/** Crossfades from one element to another in place (e.g. skeleton → content). */
export function crossfade(from: Targets, to: Targets, o: { duration?: number } = {}) {
  const d = o.duration ?? DURATION.slow;
  return finish(
    gsap
      .timeline()
      .to(from, { autoAlpha: 0, duration: d * 0.65, ease: EASE.in })
      .fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: EASE.out }, "<0.05"),
  );
}
