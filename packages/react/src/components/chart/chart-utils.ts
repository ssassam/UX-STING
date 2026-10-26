/*
 * Pure helpers of the chart family (no hooks, server-safe), shared by the
 * client charts in chart-core.tsx and the server-safe Sparkline.
 *
 * Color rules (see --ui-chart-* in @ux-sting/tokens): series take the eight
 * categorical slots in order and are never cycled; a series past the eighth
 * renders in the muted ink, so callers fold extras into "Other". Text never
 * wears a series color: legends, ticks and tooltips use text tokens and key
 * the series with a colored mark beside the text.
 */

/** Categorical slot 1–8, or `"muted"` for an "Other"/baseline series. */
export type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "muted";

export interface ChartSeries<T> {
  /** Field of each datum that holds this series' numeric value. */
  key: Extract<keyof T, string>;
  label: string;
  /**
   * Categorical color slot. Defaults to the series' position (1, 2, …). Pin
   * it when a filter can hide series, so survivors keep their color.
   */
  colorSlot?: ChartSlot;
  /** Per-series value format (tooltip, table, ticks when it is the only series). */
  format?: (value: number) => string;
}

export function slotColor(slot: ChartSlot | undefined, index: number): string {
  const s = slot ?? (index < 8 ? ((index + 1) as ChartSlot) : "muted");
  return s === "muted" ? "var(--ui-muted-foreground)" : `var(--ui-chart-${s})`;
}

/** 0, 1, 2, 2.5 or 5 × 10ⁿ steps covering [min, max] in about `count` ticks. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) {
    if (min === 0) return [0, 1];
    const pad = Math.abs(min) * 0.1;
    min -= pad;
    max += pad;
  }
  const raw = (max - min) / Math.max(count, 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 2.5, 5, 10].find((m) => m * mag >= raw) ?? 10) * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

/** Evenly spaced subset of indices that fits `width` at ~`minGap`px per label. */
export function tickIndices(length: number, width: number, minGap = 72): number[] {
  if (length === 0) return [];
  const fit = Math.max(1, Math.floor(width / minGap));
  if (length <= fit) return Array.from({ length }, (_, i) => i);
  const step = Math.ceil((length - 1) / (fit - 1 || 1));
  const out: number[] = [];
  for (let i = 0; i < length; i += step) out.push(i);
  if (out[out.length - 1] !== length - 1) {
    // Keep the last label (the latest value) and drop the one it would crowd.
    if (length - 1 - (out[out.length - 1] ?? 0) < step / 2) out.pop();
    out.push(length - 1);
  }
  return out;
}

/** Rough text width for axis labels at 11px (avoids measuring the DOM). */
export const textWidth = (s: string) => s.length * 6.4;

