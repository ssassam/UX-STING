"use client";
import { ClockIcon } from "@ux-sting/icons";
import { forwardRef, useMemo } from "react";
import { useLocale } from "../../provider/context.js";
import { Combobox, type ComboboxProps } from "../combobox/combobox.js";

export interface TimePickerProps extends Omit<
  ComboboxProps,
  "options" | "value" | "defaultValue" | "onValueChange"
> {
  /** Time as `HH:mm` (24h), independent of display locale. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Minutes between options. */
  step?: number;
  /** Earliest/latest selectable time, `HH:mm`. */
  min?: string;
  max?: string;
  /** Force 12h/24h display; defaults to the locale's convention. */
  hour12?: boolean;
}

const toMinutes = (t: string) => {
  const [h = "0", m = "0"] = t.split(":");
  return Number(h) * 60 + Number(m);
};

/** Searchable time selector with locale-formatted options (type "9:30" or "14"). */
export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  { step = 30, min = "00:00", max = "23:59", hour12, placeholder = "--:--", ...props },
  ref,
) {
  const { locale } = useLocale();
  const options = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12 });
    const list = [];
    for (let t = toMinutes(min); t <= toMinutes(max); t += step) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      list.push({
        value,
        label: fmt.format(new Date(2024, 0, 1, h, m)),
        keywords: [value, `${h}${String(m).padStart(2, "0")}`],
      });
    }
    return list;
  }, [locale, step, min, max, hour12]);
  return (
    <Combobox
      ref={ref}
      options={options}
      placeholder={placeholder}
      {...props}
      renderOption={(o) => (
        <span className="flex items-center gap-2 tabular-nums">
          <ClockIcon className="size-3.5 text-muted-foreground" />
          {o.label}
        </span>
      )}
    />
  );
});
