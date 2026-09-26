const RTL_LANGS = new Set([
  "ar",
  "arc",
  "dv",
  "fa",
  "ha",
  "he",
  "khw",
  "ks",
  "ku",
  "ps",
  "sd",
  "ur",
  "yi",
]);

/** Returns the writing direction for a BCP 47 locale. */
export function getDirection(locale: string): "ltr" | "rtl" {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & {
      getTextInfo?: () => { direction: "ltr" | "rtl" };
      textInfo?: { direction: "ltr" | "rtl" };
    };
    const info = loc.getTextInfo?.() ?? loc.textInfo;
    if (info?.direction) return info.direction;
    return RTL_LANGS.has(loc.language) ? "rtl" : "ltr";
  } catch {
    return RTL_LANGS.has(locale.split("-")[0] ?? "") ? "rtl" : "ltr";
  }
}

export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  locale?: string,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, ...options }).format(value);
}

export function formatCompact(value: number, locale?: string) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatPercent(value: number, locale?: string, fractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDate(
  value: Date | number | string,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(
  value: Date | number,
  locale?: string,
  now: Date | number = Date.now(),
) {
  const seconds = Math.round((new Date(value).getTime() - new Date(now).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size || unit === "second") {
      return rtf.format(Math.round(seconds / size), unit);
    }
  }
  return rtf.format(0, "second");
}

export function formatFileSize(bytes: number, locale?: string) {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: units[i],
    unitDisplay: "short",
    maximumFractionDigits: i === 0 ? 0 : 1,
  }).format(value);
}
