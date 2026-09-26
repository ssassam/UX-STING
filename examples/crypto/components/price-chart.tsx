"use client";
import { Button } from "@ux-sting/react/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ux-sting/react/table";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { formatUsd, type Point, type Range } from "../lib/market";

const H = 280;
const PAD = { top: 16, right: 64, bottom: 28, left: 8 };

const timeFmt: Record<Range, Intl.DateTimeFormatOptions> = {
  "1D": { hour: "2-digit", minute: "2-digit" },
  "1W": { weekday: "short", hour: "2-digit" },
  "1M": { day: "numeric", month: "short" },
  "1Y": { month: "short", year: "2-digit" },
};

/** "Nice" axis ticks for the price range. */
function ticks(min: number, max: number, count = 4) {
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let v = start; v <= max; v += step) out.push(v);
  return out;
}

/**
 * Single-series price chart: 2px line over a soft area, recessive grid,
 * crosshair + tooltip on hover and keyboard (arrow keys), and a table view.
 * The line uses the brand colour; up/down is conveyed in text elsewhere.
 */
export function PriceChart({ data, range, label }: { data: Point[]; range: Range; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setWidth(Math.max(280, Math.round(e!.contentRect.width))),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const prices = data.map((d) => d.price);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const padY = (hi - lo) * 0.08 || hi * 0.01;
    const min = lo - padY;
    const max = hi + padY;
    const innerW = width - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
    const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;
    const line = data
      .map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.price).toFixed(1)}`)
      .join("");
    const area = `${line}L${x(data.length - 1).toFixed(1)},${PAD.top + innerH}L${x(0).toFixed(1)},${PAD.top + innerH}Z`;
    const yTicks = ticks(min, max);
    const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * (data.length - 1)));
    return { x, y, line, area, yTicks, xTicks, innerH };
  }, [data, width]);

  const fmtTime = (t: number) =>
    new Intl.DateTimeFormat("en", { ...timeFmt[range], timeZone: "UTC" }).format(t);
  const pick = (clientX: number) => {
    const rect = wrap.current!.getBoundingClientRect();
    const rel = (clientX - rect.left - PAD.left) / (width - PAD.left - PAD.right);
    setActive(Math.min(data.length - 1, Math.max(0, Math.round(rel * (data.length - 1)))));
  };
  const onKey = (e: KeyboardEvent) => {
    const i = active ?? data.length - 1;
    const step = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft") setActive(Math.max(0, i - step));
    else if (e.key === "ArrowRight") setActive(Math.min(data.length - 1, i + step));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(data.length - 1);
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };

  const first = data[0]!.price;
  const last = data[data.length - 1]!.price;
  const point = active !== null ? data[active]! : null;
  const summary = `${label}, ${range}: from ${formatUsd(first)} to ${formatUsd(last)}, low ${formatUsd(Math.min(...data.map((d) => d.price)))}, high ${formatUsd(Math.max(...data.map((d) => d.price)))}.`;
  const tipLeft = point ? Math.min(width - 150, Math.max(0, geo.x(active!) - 70)) : 0;

  return (
    <div className="grid gap-3">
      <div
        ref={wrap}
        role="img"
        aria-label={`${summary} Use the arrow keys to read values.`}
        // Focusable so keyboard users can read values with the arrow keys (WCAG 2.1.1).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDown={onKey}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        className="relative touch-pan-y select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg width={width} height={H} className="block max-w-full" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--ui-primary)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--ui-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {geo.yTicks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={geo.y(v)}
                y2={geo.y(v)}
                stroke="var(--ui-border)"
                strokeDasharray="2 4"
              />
              <text
                x={width - PAD.right + 8}
                y={geo.y(v) + 4}
                fontSize="11"
                fill="var(--ui-muted-foreground)"
                className="tabular-nums"
              >
                {formatUsd(v, v >= 10_000)}
              </text>
            </g>
          ))}
          {geo.xTicks.map((i, n) => (
            <text
              key={i}
              x={geo.x(i)}
              y={H - 8}
              fontSize="11"
              fill="var(--ui-muted-foreground)"
              textAnchor={n === 0 ? "start" : n === geo.xTicks.length - 1 ? "end" : "middle"}
            >
              {fmtTime(data[i]!.t)}
            </text>
          ))}
          <path d={geo.area} fill={`url(#${gradId})`} />
          <path
            d={geo.line}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {point ? (
            <g>
              <line
                x1={geo.x(active!)}
                x2={geo.x(active!)}
                y1={PAD.top}
                y2={PAD.top + geo.innerH}
                stroke="var(--ui-muted-foreground)"
                strokeDasharray="3 3"
              />
              <circle
                cx={geo.x(active!)}
                cy={geo.y(point.price)}
                r="5"
                fill="var(--ui-primary)"
                stroke="var(--ui-background)"
                strokeWidth="2"
              />
            </g>
          ) : (
            <circle
              cx={geo.x(data.length - 1)}
              cy={geo.y(last)}
              r="4"
              fill="var(--ui-primary)"
              stroke="var(--ui-background)"
              strokeWidth="2"
            />
          )}
        </svg>
        {point ? (
          <div
            className="pointer-events-none absolute top-2 w-36 rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md"
            style={{ left: tipLeft }}
          >
            <p className="font-semibold tabular-nums text-popover-foreground">
              {formatUsd(point.price)}
            </p>
            <p className="text-xs text-muted-foreground">{fmtTime(point.t)} UTC</p>
          </div>
        ) : null}
        <p aria-live="polite" className="sr-only">
          {point ? `${fmtTime(point.t)}: ${formatUsd(point.price)}` : ""}
        </p>
      </div>
      <div>
        <Button
          variant="link"
          size="sm"
          className="px-0"
          aria-expanded={showTable}
          onClick={() => setShowTable((s) => !s)}
        >
          {showTable ? "Hide data table" : "View as table"}
        </Button>
        {showTable ? (
          <Table
            label={`${label} price table`}
            stickyHeader
            containerClassName="max-h-72 rounded-md border border-border"
          >
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Time (UTC)</TableHead>
                <TableHead scope="col" className="text-end">
                  Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((_, i) => i % Math.ceil(data.length / 24) === 0 || i === data.length - 1)
                .map((d) => (
                  <TableRow key={d.t}>
                    <TableCell>{fmtTime(d.t)}</TableCell>
                    <TableCell className="text-end tabular-nums">{formatUsd(d.price)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : null}
      </div>
    </div>
  );
}
