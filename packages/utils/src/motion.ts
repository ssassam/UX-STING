/**
 * Motion math: value mapping, cubic-bézier easings and spring physics.
 * Pure functions with no DOM access, so they run on the server, in tests and
 * inside `requestAnimationFrame` loops alike.
 */

export type EasingFunction = (t: number) => number;

export type Extrapolate = "clamp" | "extend" | "identity";

export interface InterpolateOptions {
  /** Easing applied to the progress inside each segment. */
  easing?: EasingFunction;
  /** Behavior below the first input value. Default `"extend"`. */
  extrapolateLeft?: Extrapolate;
  /** Behavior above the last input value. Default `"extend"`. */
  extrapolateRight?: Extrapolate;
}

/**
 * Maps `value` from `input` to `output` piecewise-linearly (or through
 * `easing`). Both ranges need the same length (≥ 2); `input` must be
 * non-decreasing.
 *
 * ```ts
 * interpolate(0.5, [0, 1], [0, 100]); // 50
 * interpolate(scrollY, [0, 200, 400], [1, 0.5, 0], { extrapolateRight: "clamp" });
 * ```
 */
export function interpolate(
  value: number,
  input: readonly number[],
  output: readonly number[],
  {
    easing = linear,
    extrapolateLeft = "extend",
    extrapolateRight = "extend",
  }: InterpolateOptions = {},
): number {
  if (input.length < 2 || input.length !== output.length) {
    throw new Error("interpolate: input and output ranges need the same length (at least 2).");
  }
  for (let i = 1; i < input.length; i++) {
    if (input[i]! < input[i - 1]!) {
      throw new Error("interpolate: input range must be non-decreasing.");
    }
  }
  if (Number.isNaN(value)) return value;

  const last = input.length - 1;
  if (value < input[0]!) {
    if (extrapolateLeft === "identity") return value;
    if (extrapolateLeft === "clamp") return output[0]!;
  }
  if (value > input[last]!) {
    if (extrapolateRight === "identity") return value;
    if (extrapolateRight === "clamp") return output[last]!;
  }

  // Pick the segment containing `value`; outside the range, extend the edge segment.
  let i = 1;
  while (i < last && value > input[i]!) i++;
  const inMin = input[i - 1]!;
  const inMax = input[i]!;
  const outMin = output[i - 1]!;
  const outMax = output[i]!;
  if (inMax === inMin) return value < inMin ? outMin : outMax;
  const progress = (value - inMin) / (inMax - inMin);
  // Easings are defined on [0, 1]; extrapolated progress stays linear.
  const eased = progress >= 0 && progress <= 1 ? easing(progress) : progress;
  return outMin + eased * (outMax - outMin);
}

export const linear: EasingFunction = (t) => t;

/**
 * Builds an easing function from CSS `cubic-bezier(x1, y1, x2, y2)` control
 * points, so JS-driven motion matches the CSS easing tokens exactly.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    throw new Error("cubicBezier: x control points must be within [0, 1].");
  }
  if (x1 === y1 && x2 === y2) return linear;
  // Polynomial coefficients of B(t) = ((a t + b) t + c) t for one axis.
  const coeffs = (p1: number, p2: number) => {
    const c = 3 * p1;
    const b = 3 * (p2 - p1) - c;
    return [1 - c - b, b, c] as const;
  };
  const [ax, bx, cx] = coeffs(x1, x2);
  const [ay, by, cy] = coeffs(y1, y2);
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    // Newton–Raphson converges in a few steps for most curves…
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-7) return t;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    // …and bisection covers flat regions where it does not.
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 40; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-7) break;
      if (value < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };

  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveT(x)));
}

/** JS twins of the `--ui-ease-*` tokens. */
export const easings = {
  linear,
  standard: cubicBezier(0.2, 0, 0, 1),
  emphasized: cubicBezier(0.3, 0, 0, 1.2),
  in: cubicBezier(0.4, 0, 1, 1),
  out: cubicBezier(0, 0, 0.2, 1),
  inOut: cubicBezier(0.4, 0, 0.2, 1),
} satisfies Record<string, EasingFunction>;

export interface SpringConfig {
  /** Spring stiffness (k). Higher is snappier. Default 170. */
  stiffness?: number;
  /** Friction (c). Lower bounces more. Default 26. */
  damping?: number;
  /** Mass (m). Higher is heavier and slower. Default 1. */
  mass?: number;
}

/** Named spring presets, from calm to playful. */
export const springs = {
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  standard: { stiffness: 170, damping: 26, mass: 1 },
  snappy: { stiffness: 300, damping: 30, mass: 1 },
  bouncy: { stiffness: 180, damping: 12, mass: 1 },
} satisfies Record<string, Required<SpringConfig>>;

/**
 * Progress (0 → 1, may overshoot) of a damped spring released from rest,
 * `seconds` after release. Closed-form, so any frame can be computed
 * independently — useful for scrubbing and for server-rendered keyframes.
 */
export function spring(seconds: number, config: SpringConfig = {}): number {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  if (seconds <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const t = seconds;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const envelope = Math.exp(-zeta * w0 * t);
    return 1 - envelope * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const root = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - root);
  const r2 = -w0 * (zeta + root);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/**
 * Seconds until the spring stays within `precision` of its target for good.
 * Sampled at 1 ms and capped at 10 s.
 */
export function springDuration(config: SpringConfig = {}, precision = 0.001): number {
  const step = 0.001;
  let settledAt = 0;
  for (let t = 0; t <= 10; t += step) {
    if (Math.abs(1 - spring(t, config)) > precision) settledAt = t + step;
    else if (t - settledAt > 0.25) break;
  }
  return Math.min(10, Number(settledAt.toFixed(3)));
}

/**
 * Turns a spring into a CSS `linear()` easing plus its duration, so springs run
 * on the compositor with plain CSS transitions:
 *
 * ```ts
 * const { easing, duration } = springToCss(springs.bouncy);
 * el.style.transition = `transform ${duration}ms ${easing}`;
 * ```
 */
export function springToCss(
  config: SpringConfig = {},
  points = 40,
): { easing: string; duration: number } {
  const seconds = springDuration(config);
  const stops = Array.from({ length: points + 1 }, (_, i) =>
    Number(spring((seconds * i) / points, config).toFixed(4)),
  );
  stops[points] = 1;
  return { easing: `linear(${stops.join(", ")})`, duration: Math.round(seconds * 1000) };
}
