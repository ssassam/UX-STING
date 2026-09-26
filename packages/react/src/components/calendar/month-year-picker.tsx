"use client";
import { useControllableState } from "@ux-sting/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@ux-sting/icons";
import { getMonthNames } from "@ux-sting/primitives";
import { cn } from "@ux-sting/utils";
import { useState } from "react";
import { useLocale, useMessages } from "../../provider/context.js";

const cellClass =
  "inline-flex h-10 items-center justify-center rounded-md text-sm capitalize outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground disabled:opacity-40";
const navClass =
  "ui-hit-area inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 rtl:[&_svg]:rotate-180";

export interface MonthPickerProps {
  /** Selected month as the first day of that month. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  className?: string;
}

/** Pick a month and year (billing periods, reports). */
export function MonthPicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  className,
}: MonthPickerProps) {
  const { locale } = useLocale();
  const messages = useMessages();
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: (v) => v && onValueChange?.(v),
  });
  const [year, setYear] = useState((value ?? new Date()).getFullYear());
  const names = getMonthNames(locale, "short");
  const yearFmt = new Intl.NumberFormat(locale, { useGrouping: false });
  return (
    <div className={cn("grid w-64 gap-3 p-3", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          className={navClass}
          aria-label={messages.previous}
          onClick={() => setYear(year - 1)}
        >
          <ChevronLeftIcon />
        </button>
        <span aria-live="polite" className="text-sm font-semibold tabular-nums">
          {yearFmt.format(year)}
        </span>
        <button
          type="button"
          className={navClass}
          aria-label={messages.next}
          onClick={() => setYear(year + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div role="group" className="grid grid-cols-3 gap-1">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            className={cellClass}
            aria-pressed={value?.getFullYear() === year && value?.getMonth() === i}
            onClick={() => setValue(new Date(year, i, 1))}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface YearPickerProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

/** Pick a year from a paged 12-year grid. */
export function YearPicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min = 1900,
  max = 2100,
  className,
}: YearPickerProps) {
  const { locale } = useLocale();
  const messages = useMessages();
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: (v) => v !== null && onValueChange?.(v),
  });
  const [start, setStart] = useState(Math.floor((value ?? new Date().getFullYear()) / 12) * 12);
  const fmt = new Intl.NumberFormat(locale, { useGrouping: false });
  return (
    <div className={cn("grid w-64 gap-3 p-3", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          className={navClass}
          aria-label={messages.previous}
          onClick={() => setStart(start - 12)}
          disabled={start <= min}
        >
          <ChevronLeftIcon />
        </button>
        <span aria-live="polite" className="text-sm font-semibold tabular-nums">
          {fmt.format(start)} – {fmt.format(start + 11)}
        </span>
        <button
          type="button"
          className={navClass}
          aria-label={messages.next}
          onClick={() => setStart(start + 12)}
          disabled={start + 11 >= max}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div role="group" className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }, (_, i) => start + i).map((y) => (
          <button
            key={y}
            type="button"
            className={cn(cellClass, "tabular-nums")}
            aria-pressed={value === y}
            disabled={y < min || y > max}
            onClick={() => setValue(y)}
          >
            {fmt.format(y)}
          </button>
        ))}
      </div>
    </div>
  );
}
