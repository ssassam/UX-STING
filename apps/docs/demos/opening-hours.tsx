"use client";
import { OpeningHours, OpenStatus, type OpeningPeriod } from "@unified-ui/react/opening-hours";

const periods: OpeningPeriod[] = [1, 2, 3, 4, 5].map((day) => ({ day, open: "08:00", close: "19:00" })).concat([
  { day: 6, open: "09:00", close: "23:00" },
  { day: 0, open: "10:00", close: "16:00" },
]);

export function Weekly() {
  return (
    <div className="grid max-w-xs gap-3">
      <OpenStatus periods={periods} />
      <OpeningHours periods={periods} />
    </div>
  );
}
