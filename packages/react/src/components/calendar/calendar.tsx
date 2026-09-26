"use client";
import { useControllableState } from "@unified-ui/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@unified-ui/icons";
import {
  addDays,
  addMonths,
  compareDays,
  getMonthGrid,
  getWeekdayNames,
  getWeekStart,
  isDateDisabled,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfMonth,
  startOfWeek,
  type WeekDay,
} from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useMessages } from "../../provider/context.js";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface CalendarBaseProps {
  /** Month shown initially (defaults to the selected date or today). */
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date | null;
  max?: Date | null;
  /** Return `true` to disable a date (e.g. closed days). */
  isDisabled?: (date: Date) => boolean;
  weekStartsOn?: WeekDay;
  numberOfMonths?: 1 | 2;
  showOutsideDays?: boolean;
  className?: string;
  /** Today's date (injectable for tests/SSR consistency). */
  today?: Date;
  "aria-label"?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/**
 * Accessible month grid (ARIA grid pattern). Keyboard: arrows move by
 * day/week (mirrored in RTL), Home/End to week edges, PageUp/PageDown by
 * month (+Shift by year), Enter/Space selects. Locale sets names and the
 * first day of the week.
 */
export function Calendar(props: CalendarProps) {
  const { locale, dir } = useLocale();
  const messages = useMessages();
  const today = props.today ?? new Date();
  const weekStartsOn = props.weekStartsOn ?? getWeekStart(locale);
  const numberOfMonths = props.numberOfMonths ?? 1;

  const [single, setSingle] = useControllableState<Date | null>({
    value: props.mode !== "range" ? props.value : undefined,
    defaultValue: props.mode !== "range" ? (props.defaultValue ?? null) : null,
    onChange: props.mode !== "range" ? props.onValueChange : undefined,
  });
  const [range, setRange] = useControllableState<DateRange>({
    value: props.mode === "range" ? props.value : undefined,
    defaultValue:
      props.mode === "range"
        ? (props.defaultValue ?? { from: null, to: null })
        : { from: null, to: null },
    onChange: props.mode === "range" ? props.onValueChange : undefined,
  });
  const anchor = props.mode === "range" ? range.from : single;
  const [month, setMonth] = useControllableState({
    value: props.month,
    defaultValue: startOfMonth(props.defaultMonth ?? anchor ?? today),
    onChange: props.onMonthChange,
  });
  const [focused, setFocused] = useState<Date>(anchor ?? today);
  const [hovered, setHovered] = useState<Date | null>(null);
  const focusRequested = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusRequested.current) return;
    focusRequested.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus();
  }, [focused, month]);

  const disabled = (d: Date) =>
    isDateDisabled(d, { min: props.min, max: props.max }) || Boolean(props.isDisabled?.(d));

  const moveFocus = (next: Date) => {
    focusRequested.current = true;
    setFocused(next);
    const lastVisible = addMonths(month, numberOfMonths - 1);
    if (
      compareDays(next, startOfMonth(month)) < 0 ||
      compareDays(next, addMonths(startOfMonth(lastVisible), 1)) >= 0
    ) {
      setMonth(startOfMonth(next));
    }
  };

  const select = (date: Date) => {
    if (disabled(date)) return;
    if (props.mode === "range") {
      if (!range.from || range.to) setRange({ from: date, to: null });
      else if (compareDays(date, range.from) < 0) setRange({ from: date, to: range.from });
      else setRange({ from: range.from, to: date });
    } else {
      setSingle(isSameDay(single, date) ? single : date);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const rtl = dir === "rtl" ? -1 : 1;
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1 * rtl),
      ArrowRight: () => addDays(focused, 1 * rtl),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused, weekStartsOn),
      End: () => addDays(startOfWeek(focused, weekStartsOn), 6),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      moveFocus(keys[e.key]!());
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(focused);
    }
  };

  const monthFmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const dayFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const numFmt = new Intl.DateTimeFormat(locale, { day: "numeric" });
  const weekdays = getWeekdayNames(locale, weekStartsOn, "short");
  const weekdaysLong = getWeekdayNames(locale, weekStartsOn, "long");
  const months = Array.from({ length: numberOfMonths }, (_, i) => addMonths(month, i));
  const rangeEnd = props.mode === "range" ? (range.to ?? hovered) : null;

  const navButton =
    "ui-hit-area inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 [&_svg]:size-4 rtl:[&_svg]:rotate-180";

  return (
    <div
      ref={gridRef}
      className={cn("inline-flex flex-col gap-3 p-3", props.className)}
      aria-label={props["aria-label"]}
    >
      <div className={cn("grid gap-6", numberOfMonths === 2 && "sm:grid-cols-2")}>
        {months.map((m, mi) => {
          const labelId = `cal-${m.getFullYear()}-${m.getMonth()}`;
          return (
            <div key={labelId} className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                {mi === 0 ? (
                  <button
                    type="button"
                    aria-label={messages.previousMonth}
                    className={navButton}
                    onClick={() => setMonth(addMonths(month, -1))}
                    disabled={Boolean(
                      props.min && compareDays(startOfMonth(month), startOfMonth(props.min)) <= 0,
                    )}
                  >
                    <ChevronLeftIcon />
                  </button>
                ) : (
                  <span className="size-8" />
                )}
                <h2 id={labelId} aria-live="polite" className="text-sm font-semibold capitalize">
                  {monthFmt.format(m)}
                </h2>
                {mi === months.length - 1 ? (
                  <button
                    type="button"
                    aria-label={messages.nextMonth}
                    className={navButton}
                    onClick={() => setMonth(addMonths(month, 1))}
                    disabled={Boolean(
                      props.max && compareDays(addMonths(startOfMonth(m), 1), props.max) > 0,
                    )}
                  >
                    <ChevronRightIcon />
                  </button>
                ) : (
                  <span className="size-8" />
                )}
              </div>
              <table
                role="grid"
                aria-labelledby={labelId}
                className="border-collapse"
                onKeyDown={onKeyDown}
              >
                <thead>
                  <tr>
                    {weekdays.map((d, i) => (
                      <th
                        key={d}
                        scope="col"
                        abbr={weekdaysLong[i]}
                        className="size-9 text-center text-xs font-medium text-muted-foreground"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getMonthGrid(m, weekStartsOn).map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day) => {
                        const outside = !isSameMonth(day, m);
                        if (outside && !props.showOutsideDays)
                          return <td key={day.toISOString()} className="size-9 p-0" />;
                        const isDisabled = disabled(day);
                        const selectedSingle = props.mode !== "range" && isSameDay(single, day);
                        const isStart = props.mode === "range" && isSameDay(range.from, day);
                        const isEnd = props.mode === "range" && isSameDay(range.to, day);
                        const inRange =
                          props.mode === "range" && isWithinRange(day, range.from, rangeEnd);
                        const selected = selectedSingle || isStart || isEnd;
                        const isFocused = isSameDay(day, focused) && isSameMonth(day, m);
                        return (
                          <td
                            key={day.toISOString()}
                            role="gridcell"
                            aria-selected={selected || inRange || undefined}
                            className={cn(
                              "relative size-9 p-0 text-center",
                              inRange && !isStart && !isEnd && "bg-primary-subtle",
                              isStart && rangeEnd && "rounded-s-md bg-primary-subtle",
                              isEnd && "rounded-e-md bg-primary-subtle",
                            )}
                          >
                            <button
                              type="button"
                              tabIndex={isFocused ? 0 : -1}
                              data-focused={isFocused}
                              disabled={isDisabled}
                              aria-label={dayFmt.format(day)}
                              aria-current={isSameDay(day, today) ? "date" : undefined}
                              onClick={() => {
                                setFocused(day);
                                select(day);
                              }}
                              onFocus={() => setFocused(day)}
                              onPointerEnter={() => setHovered(day)}
                              className={cn(
                                "inline-flex size-9 items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors",
                                "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-muted-foreground disabled:line-through disabled:opacity-50",
                                outside && "text-muted-foreground",
                                isSameDay(day, today) && !selected && "font-semibold text-primary",
                                inRange && "text-primary-subtle-foreground",
                                selected &&
                                  "bg-primary text-primary-foreground hover:bg-primary-hover",
                              )}
                            >
                              {numFmt.format(day)}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
