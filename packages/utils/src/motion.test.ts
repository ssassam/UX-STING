import { describe, expect, it } from "vitest";
import {
  cubicBezier,
  easings,
  interpolate,
  spring,
  springDuration,
  springs,
  springToCss,
} from "./index.js";

describe("interpolate", () => {
  it("maps linearly across multiple segments", () => {
    expect(interpolate(0.5, [0, 1], [0, 100])).toBe(50);
    expect(interpolate(150, [0, 100, 200], [0, 1, 0])).toBe(0.5);
    expect(interpolate(5, [0, 10], [100, 0])).toBe(50);
  });

  it("extends, clamps or passes through outside the range", () => {
    expect(interpolate(2, [0, 1], [0, 10])).toBe(20);
    expect(interpolate(2, [0, 1], [0, 10], { extrapolateRight: "clamp" })).toBe(10);
    expect(interpolate(-1, [0, 1], [0, 10], { extrapolateLeft: "clamp" })).toBe(0);
    expect(interpolate(-3, [0, 1], [5, 10], { extrapolateLeft: "identity" })).toBe(-3);
  });

  it("applies easing inside segments only", () => {
    const easeIn = (t: number) => t * t;
    expect(interpolate(0.5, [0, 1], [0, 100], { easing: easeIn })).toBe(25);
    expect(interpolate(2, [0, 1], [0, 100], { easing: easeIn })).toBe(200);
  });

  it("validates ranges", () => {
    expect(() => interpolate(0, [0], [0])).toThrow();
    expect(() => interpolate(0, [0, 1], [0, 1, 2])).toThrow();
    expect(() => interpolate(0, [1, 0], [0, 1])).toThrow();
  });
});

describe("cubicBezier", () => {
  it("hits the end points and is monotonic for standard curves", () => {
    const ease = easings.standard;
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    let previous = 0;
    for (let x = 0.05; x < 1; x += 0.05) {
      const y = ease(x);
      expect(y).toBeGreaterThanOrEqual(previous);
      previous = y;
    }
  });

  it("matches known values", () => {
    // CSS `ease` = cubic-bezier(0.25, 0.1, 0.25, 1) is ≈ 0.8024 at x = 0.5.
    expect(cubicBezier(0.25, 0.1, 0.25, 1)(0.5)).toBeCloseTo(0.8024, 3);
    expect(cubicBezier(0, 0, 1, 1)(0.3)).toBeCloseTo(0.3, 6);
  });

  it("allows overshoot on the y axis", () => {
    const max = Math.max(
      ...Array.from({ length: 99 }, (_, i) => easings.emphasized((i + 1) / 100)),
    );
    expect(max).toBeGreaterThan(1);
  });
});

describe("spring", () => {
  it("starts at rest and settles on the target", () => {
    for (const config of Object.values(springs)) {
      expect(spring(0, config)).toBe(0);
      expect(spring(5, config)).toBeCloseTo(1, 3);
    }
  });

  it("overshoots only when under-damped", () => {
    const peak = (config: Parameters<typeof spring>[1]) =>
      Math.max(...Array.from({ length: 300 }, (_, i) => spring(i / 100, config)));
    expect(peak(springs.bouncy)).toBeGreaterThan(1.05);
    expect(peak({ stiffness: 100, damping: 20 })).toBeLessThanOrEqual(1); // critically damped
    expect(peak({ stiffness: 100, damping: 60 })).toBeLessThanOrEqual(1); // over-damped
  });

  it("reports a settle time and a CSS linear() easing", () => {
    const snappy = springDuration(springs.snappy);
    const bouncy = springDuration(springs.bouncy);
    expect(snappy).toBeGreaterThan(0.1);
    expect(bouncy).toBeGreaterThan(snappy);
    const css = springToCss(springs.bouncy, 10);
    expect(css.easing).toMatch(/^linear\(0, .+, 1\)$/);
    expect(css.duration).toBe(Math.round(bouncy * 1000));
  });
});
