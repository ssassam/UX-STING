"use client";
import { useEffect, useState } from "react";

export const DAY = 86_400_000;
export const iso = (d: Date) => d.toISOString().slice(0, 10);

export type Range = { from: Date | null; to: Date | null };

/**
 * Today plus a default trip a week out. The pages are static exports, so
 * "today" at build time is not today in the visitor's browser: both stay null
 * through hydration and are filled in once mounted.
 */
export function useDefaultTrip() {
  const [today, setToday] = useState<Date | undefined>();
  const [dates, setDates] = useState<Range>({ from: null, to: null });
  useEffect(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    setToday(t);
    setDates((d) =>
      d.from || d.to
        ? d
        : { from: new Date(t.getTime() + 7 * DAY), to: new Date(t.getTime() + 10 * DAY) },
    );
  }, []);
  return { today, dates, setDates };
}
