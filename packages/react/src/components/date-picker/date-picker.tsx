"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@unified-ui/hooks";
import { CalendarIcon } from "@unified-ui/icons";
import { toISODate } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { forwardRef, useState, type ReactNode } from "react";
import { controlVariants, type ControlSize } from "../../lib/control.js";
import { useFieldControlProps } from "../../lib/field.js";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { useLocale, useMessages, usePortalContainer } from "../../provider/context.js";
import { Calendar, type DateRange } from "../calendar/calendar.js";
import { TimePicker } from "../time-picker/time-picker.js";

interface PickerBaseProps {
  placeholder?: string;
  size?: ControlSize;
  disabled?: boolean;
  invalid?: boolean;
  min?: Date | null;
  max?: Date | null;
  isDisabled?: (date: Date) => boolean;
  /** Intl format for the trigger text. */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Hidden input name for form submission (ISO `YYYY-MM-DD`). */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Extra content under the calendar (presets, time). */
  footer?: ReactNode;
}

function TriggerButton({
  label,
  empty,
  open,
  size,
  className,
  fieldProps,
  aria,
  ...rest
}: {
  label: string;
  empty: boolean;
  open: boolean;
  size?: ControlSize;
  className?: string;
  fieldProps: ReturnType<typeof useFieldControlProps>;
  aria: { "aria-label"?: string; "aria-labelledby"?: string };
}) {
  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        id={fieldProps.id}
        disabled={fieldProps.disabled}
        data-invalid={fieldProps["aria-invalid"] ? "" : undefined}
        aria-describedby={fieldProps["aria-describedby"]}
        {...aria}
        className={cn(controlVariants({ size }), "flex items-center gap-2 text-start data-invalid:border-destructive", empty && "text-muted-foreground", className)}
        {...rest}
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate tabular-nums">{label}</span>
      </button>
    </PopoverPrimitive.Trigger>
  );
}

export interface DatePickerProps extends PickerBaseProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

/** Date field that opens a calendar popover. Typing-free and keyboard-accessible. */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  { value: valueProp, defaultValue = null, onValueChange, placeholder, size, disabled, invalid, min, max, isDisabled, formatOptions = { dateStyle: "medium" }, name, id, className, footer, ...aria },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const { locale } = useLocale();
  const messages = useMessages();
  const container = usePortalContainer();
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined });
  const label = value ? new Intl.DateTimeFormat(locale, formatOptions).format(value) : (placeholder ?? messages.chooseDate);

  return (
    <div ref={ref} className="contents">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <TriggerButton label={label} empty={!value} open={open} size={size} className={className} fieldProps={fieldProps} aria={aria} />
        <PopoverPrimitive.Portal container={container}>
          <PopoverPrimitive.Content align="start" sideOffset={6} collisionPadding={8} className={cn(floatingSurfaceClass, "p-0")}>
            <Calendar
              value={value}
              onValueChange={(d) => {
                setValue(d);
                setOpen(false);
              }}
              min={min}
              max={max}
              isDisabled={isDisabled}
            />
            {footer ? <div className="border-t border-border p-3">{footer}</div> : null}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {name ? <input type="hidden" name={name} value={value ? toISODate(value) : ""} /> : null}
    </div>
  );
});

export interface DateRangePickerProps extends PickerBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  numberOfMonths?: 1 | 2;
}

/** Start/end date selection (bookings, reports). Two months on wide screens. */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  { value: valueProp, defaultValue = { from: null, to: null }, onValueChange, placeholder, size, disabled, invalid, min, max, isDisabled, formatOptions = { dateStyle: "medium" }, name, id, className, footer, numberOfMonths = 2, ...aria },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const { locale } = useLocale();
  const messages = useMessages();
  const container = usePortalContainer();
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined });
  const fmt = new Intl.DateTimeFormat(locale, formatOptions);
  const label =
    value.from && value.to
      ? fmt.formatRange(value.from, value.to)
      : value.from
        ? `${fmt.format(value.from)} – …`
        : (placeholder ?? messages.chooseDate);

  return (
    <div ref={ref} className="contents">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <TriggerButton label={label} empty={!value.from} open={open} size={size} className={className} fieldProps={fieldProps} aria={aria} />
        <PopoverPrimitive.Portal container={container}>
          <PopoverPrimitive.Content align="start" sideOffset={6} collisionPadding={8} className={cn(floatingSurfaceClass, "max-w-[calc(100vw-1rem)] overflow-auto p-0")}>
            <Calendar
              mode="range"
              numberOfMonths={numberOfMonths}
              value={value}
              onValueChange={(r) => {
                setValue(r);
                if (r.from && r.to) setOpen(false);
              }}
              min={min}
              max={max}
              isDisabled={isDisabled}
            />
            {footer ? <div className="border-t border-border p-3">{footer}</div> : null}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {name ? (
        <>
          <input type="hidden" name={`${name}From`} value={value.from ? toISODate(value.from) : ""} />
          <input type="hidden" name={`${name}To`} value={value.to ? toISODate(value.to) : ""} />
        </>
      ) : null}
    </div>
  );
});

export interface DateTimePickerProps extends Omit<DatePickerProps, "footer"> {
  timeStep?: number;
}

/** Date + time selection combined into one `Date` value. */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(function DateTimePicker(
  { value: valueProp, defaultValue = null, onValueChange, timeStep = 30, formatOptions = { dateStyle: "medium", timeStyle: "short" }, name, ...props },
  ref,
) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const time = value ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}` : null;
  const merge = (date: Date | null, t: string | null) => {
    if (!date) return null;
    const [h = 0, m = 0] = (t ?? "09:00").split(":").map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  };
  return (
    <>
      <DatePicker
        ref={ref}
        value={value}
        onValueChange={(d) => setValue(merge(d, time))}
        formatOptions={formatOptions}
        footer={<TimePicker aria-label="Time" size="sm" step={timeStep} value={time} onValueChange={(t) => setValue(merge(value ?? new Date(), t))} />}
        {...props}
      />
      {name ? <input type="hidden" name={name} value={value ? value.toISOString() : ""} /> : null}
    </>
  );
});
