import { TrendingDownIcon, TrendingUpIcon } from "@ux-sting/icons";
import { formatPct, type Coin, type Point } from "../lib/market";

/** Price change with an arrow icon and sign, so it never relies on colour alone. */
export function Change({ value, className = "" }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium tabular-nums ${up ? "text-success" : "text-destructive"} ${className}`}
    >
      {up ? (
        <TrendingUpIcon aria-hidden className="size-4" />
      ) : (
        <TrendingDownIcon aria-hidden className="size-4" />
      )}
      <span className="sr-only">{up ? "up" : "down"} </span>
      <bdi>{formatPct(value)}</bdi>
    </span>
  );
}

/** Decorative trend line; the adjacent Change carries the information. */
export function Sparkline({
  data,
  up,
  width = 96,
  height = 28,
}: {
  data: Point[];
  up: boolean;
  width?: number;
  height?: number;
}) {
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const d = data
    .map(
      (p, i) =>
        `${i ? "L" : "M"}${((i / (data.length - 1)) * width).toFixed(1)},${(height - 2 - ((p.price - min) / (max - min || 1)) * (height - 4)).toFixed(1)}`,
    )
    .join("");
  return (
    <svg width={width} height={height} aria-hidden className="block">
      <path
        d={d}
        fill="none"
        stroke={up ? "var(--ui-success)" : "var(--ui-destructive)"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoinMark({ coin, size = "md" }: { coin: Coin; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary-subtle-foreground ${size === "lg" ? "size-12 text-sm" : "size-8 text-[0.625rem]"}`}
    >
      {coin.symbol.slice(0, 4)}
    </span>
  );
}
