/**
 * Dependency-free date math for calendars and date pickers. All functions
 * operate on local calendar dates and never mutate their inputs.
 */

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), endOfMonth(target).getDate());
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return Boolean(
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function isWithinRange(date: Date, start: Date | null | undefined, end: Date | null | undefined): boolean {
  if (!start || !end) return false;
  const [lo, hi] = compareDays(start, end) <= 0 ? [start, end] : [end, start];
  return compareDays(date, lo) >= 0 && compareDays(date, hi) <= 0;
}

export function isDateDisabled(date: Date, { min, max }: { min?: Date | null; max?: Date | null } = {}): boolean {
  return Boolean((min && compareDays(date, min) < 0) || (max && compareDays(date, max) > 0));
}

export function startOfWeek(date: Date, weekStartsOn: WeekDay = 0): Date {
  const diff = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -diff);
}

/** Returns 6 weeks × 7 days covering the month (stable grid height). */
export function getMonthGrid(month: Date, weekStartsOn: WeekDay = 0): Date[][] {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)));
}

/** First day of week for a locale (Intl weekInfo when available). */
export function getWeekStart(locale?: string): WeekDay {
  try {
    const loc = new Intl.Locale(locale ?? "en-US") as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info) return (info.firstDay % 7) as WeekDay;
    const region = loc.maximize().region ?? "US";
    if (["US", "CA", "JP", "BR", "IL", "MX", "PH", "KR", "TW", "IN"].includes(region)) return 0;
    if (["SA", "EG", "AE", "QA", "KW", "DZ", "IQ", "JO", "SY"].includes(region)) return 6;
    return 1;
  } catch {
    return 0;
  }
}

export function getWeekdayNames(
  locale?: string,
  weekStartsOn: WeekDay = 0,
  format: "narrow" | "short" | "long" = "short",
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: format });
  const base = startOfWeek(new Date(2024, 0, 7), weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(base, i)));
}

export function getMonthNames(locale?: string, format: "short" | "long" = "long"): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: format });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2024, i, 1)));
}

/** Formats as `YYYY-MM-DD` (local), suitable for form values. */
export function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses `YYYY-MM-DD` as a local date; returns null if invalid. */
export function parseISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toISODate(date) === value ? date : null;
}
