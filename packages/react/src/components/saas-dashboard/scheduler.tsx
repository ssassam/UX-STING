"use client";
import { type ReactNode } from "react";
import { cn } from "@ux-sting/utils";
import { Calendar } from "../calendar/index.js";
import { ScheduleView, type ScheduleItem } from "./work.js";
export interface ScheduleCalendarProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  view: "month" | "year" | "day";
  items: ScheduleItem[];
  onOpen?: (item: ScheduleItem) => void;
  locale?: string;
  dateLabel?: string;
  agendaLabel?: string;
  empty?: ReactNode;
  className?: string;
}
const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
/** Controlled month/year/day scheduler composed from the existing accessible Calendar. */
export function ScheduleCalendar({
  label,
  date,
  onDateChange,
  view,
  items,
  onOpen,
  locale = "en",
  dateLabel = "Date",
  agendaLabel,
  empty = "No events",
  className,
}: ScheduleCalendarProps) {
  const valid = items.filter((item) => Number.isFinite(Date.parse(item.start)));
  const selected = valid.filter((item) =>
    view === "day"
      ? dayKey(new Date(item.start)) === dayKey(date)
      : view === "month"
        ? new Date(item.start).getFullYear() === date.getFullYear() &&
          new Date(item.start).getMonth() === date.getMonth()
        : new Date(item.start).getFullYear() === date.getFullYear(),
  );
  return (
    <section aria-label={label} className={cn("grid min-w-0 gap-4", className)}>
      <label className="grid justify-self-start gap-1 text-xs">
        {dateLabel}
        <input
          type="date"
          value={dayKey(date)}
          onChange={(event) => {
            const value = new Date(event.target.value + "T12:00:00");
            if (Number.isFinite(value.getTime())) onDateChange(value);
          }}
          className="min-h-11 rounded border border-input bg-background px-3 text-base"
        />
      </label>
      {view === "year" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }, (_, month) => (
            <Calendar
              key={month}
              aria-label={new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
              }).format(new Date(date.getFullYear(), month, 1))}
              month={new Date(date.getFullYear(), month, 1)}
              min={new Date(date.getFullYear(), month, 1)}
              max={new Date(date.getFullYear(), month + 1, 0)}
              value={date}
              onValueChange={(value) => {
                if (value) onDateChange(value);
              }}
            />
          ))}
        </div>
      ) : view === "month" ? (
        <Calendar
          aria-label={label}
          month={new Date(date.getFullYear(), date.getMonth(), 1)}
          onMonthChange={onDateChange}
          value={date}
          onValueChange={(value) => {
            if (value) onDateChange(value);
          }}
        />
      ) : null}
      <ScheduleView
        label={agendaLabel || `${label} — agenda`}
        items={selected}
        onOpen={onOpen}
        locale={locale}
        empty={empty}
      />
    </section>
  );
}
export interface TimelineTask {
  id: string;
  title: string;
  start: string;
  end: string;
  detail?: ReactNode;
}
export interface TaskTimelineProps {
  label: string;
  tasks: TimelineTask[];
  start: string;
  end: string;
  locale?: string;
  onOpen?: (task: TimelineTask) => void;
  empty?: ReactNode;
  className?: string;
}
/** Date-proportional task spans, with explicit dates and a keyboard-operable task action. */
export function TaskTimeline({
  label,
  tasks,
  start,
  end,
  locale = "en",
  onOpen,
  empty = "No tasks",
  className,
}: TaskTimelineProps) {
  const first = Date.parse(start),
    last = Date.parse(end);
  const range = last - first;
  const valid =
    range > 0
      ? tasks.filter(
          (task) =>
            Number.isFinite(Date.parse(task.start)) &&
            Number.isFinite(Date.parse(task.end)) &&
            Date.parse(task.end) >= Date.parse(task.start) &&
            Date.parse(task.end) >= first &&
            Date.parse(task.start) <= last,
        )
      : [];
  const format = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
  return (
    <section aria-label={label} className={cn("grid min-w-0 gap-4", className)}>
      {valid.map((task) => {
        const a = Math.max(0, (Date.parse(task.start) - first) / range),
          b = Math.min(1, (Date.parse(task.end) - first) / range);
        return (
          <article key={task.id} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {onOpen ? (
                <button
                  type="button"
                  onClick={() => onOpen(task)}
                  className="min-h-11 rounded px-1 text-sm font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {task.title}
                </button>
              ) : (
                <h3 className="text-sm font-semibold">{task.title}</h3>
              )}
              <p className="text-xs text-muted-foreground">
                <time dateTime={task.start}>{format(task.start)}</time> —{" "}
                <time dateTime={task.end}>{format(task.end)}</time>
              </p>
            </div>
            <div aria-hidden className="h-3 overflow-hidden rounded bg-muted">
              <div
                className="h-full rounded bg-primary"
                style={{
                  marginInlineStart: `${a * 100}%`,
                  width: `${Math.max(0.5, (b - a) * 100)}%`,
                }}
              />
            </div>
            {task.detail}
          </article>
        );
      })}
      {!valid.length && <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}
