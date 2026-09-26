"use client";
import { getWeekdayNames, getWeekStart } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { useEffect, useState, type HTMLAttributes } from "react";
import { useLocale } from "../../provider/context.js";

export interface OpeningPeriod {
  /** 0 = Sunday … 6 = Saturday. */
  day: number;
  /** `HH:mm` 24h. */
  open: string;
  /** `HH:mm` 24h; may be past midnight (e.g. "02:00"). */
  close: string;
}

export interface OpeningStatus {
  open: boolean;
  /** Next change time, `HH:mm`. */
  next?: string;
}

const toMin = (t: string) => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Computes whether a place is open at `now` from weekly periods. */
export function getOpeningStatus(periods: OpeningPeriod[], now: Date = new Date()): OpeningStatus {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const p of periods) {
    const open = toMin(p.open);
    let close = toMin(p.close);
    if (close <= open) close += 24 * 60;
    if (p.day === day && minutes >= open && minutes < close) return { open: true, next: p.close };
    const yesterday = (day + 6) % 7;
    if (p.day === yesterday && close > 24 * 60 && minutes < close - 24 * 60)
      return { open: true, next: p.close };
  }
  const later = periods
    .filter((p) => p.day === day && toMin(p.open) > minutes)
    .sort((a, b) => toMin(a.open) - toMin(b.open));
  return { open: false, next: later[0]?.open };
}

function useNow(interval = 60_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

export interface OpenStatusProps extends HTMLAttributes<HTMLSpanElement> {
  periods: OpeningPeriod[];
  /** Localized labels. */
  labels?: {
    open?: string;
    closed?: string;
    closes?: (time: string) => string;
    opens?: (time: string) => string;
  };
}

/** "Open · closes 18:00" / "Closed · opens 09:00" with a status dot and text. */
export function OpenStatus({ periods, labels = {}, className, ...props }: OpenStatusProps) {
  const { locale } = useLocale();
  const now = useNow();
  if (!now) return <span className={cn("inline-block h-5 w-24", className)} aria-hidden />;
  const status = getOpeningStatus(periods, now);
  const fmt = (t: string) => {
    const [h = 0, m = 0] = t.split(":").map(Number);
    return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(
      new Date(2024, 0, 1, h, m),
    );
  };
  return (
    <span className={cn("inline-block text-sm", className)} {...props}>
      <span
        aria-hidden
        className={cn(
          "me-1.5 inline-block size-2 rounded-full align-middle",
          status.open ? "bg-success" : "bg-destructive",
        )}
      />
      <span className={cn("font-medium", status.open ? "text-success" : "text-destructive")}>
        {status.open ? (labels.open ?? "Open") : (labels.closed ?? "Closed")}
      </span>
      {status.next ? (
        <span className="text-muted-foreground">
          {" "}
          ·{" "}
          {status.open
            ? (labels.closes ?? ((t) => `closes ${t}`))(fmt(status.next))
            : (labels.opens ?? ((t) => `opens ${t}`))(fmt(status.next))}
        </span>
      ) : null}
    </span>
  );
}

export interface OpeningHoursProps extends HTMLAttributes<HTMLTableElement> {
  periods: OpeningPeriod[];
  closedLabel?: string;
  caption?: string;
}

/** Weekly hours table, localized day names, today highlighted. */
export function OpeningHours({
  periods,
  closedLabel = "Closed",
  caption = "Opening hours",
  className,
  ...props
}: OpeningHoursProps) {
  const { locale } = useLocale();
  const now = useNow();
  const weekStart = getWeekStart(locale);
  const names = getWeekdayNames(locale, 0, "long");
  const order = Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
  const fmt = (t: string) => {
    const [h = 0, m = 0] = t.split(":").map(Number);
    return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(
      new Date(2024, 0, 1, h, m),
    );
  };
  return (
    <table className={cn("w-full text-sm", className)} {...props}>
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {order.map((day) => {
          const today = now?.getDay() === day;
          const list = periods.filter((p) => p.day === day);
          return (
            <tr
              key={day}
              aria-current={today ? "date" : undefined}
              className={cn("border-b border-border last:border-0", today && "font-semibold")}
            >
              <th scope="row" className="py-1.5 pe-4 text-start font-[inherit] capitalize">
                {names[day]}
              </th>
              <td className="py-1.5 text-end tabular-nums text-muted-foreground">
                {list.length
                  ? list.map((p) => `${fmt(p.open)} – ${fmt(p.close)}`).join(", ")
                  : closedLabel}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
