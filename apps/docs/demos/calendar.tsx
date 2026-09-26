"use client";
import { useState } from "react";
import { Calendar, MonthPicker, YearPicker, type DateRange } from "@unified-ui/react/calendar";

export function Single() {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <Calendar value={date} onValueChange={setDate} className="rounded-lg border border-border" />
  );
}

export function Range() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      value={range}
      onValueChange={setRange}
      min={new Date()}
      className="rounded-lg border border-border"
    />
  );
}

export function DisabledDays() {
  return (
    <Calendar
      isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      className="rounded-lg border border-border"
    />
  );
}

export function MonthAndYear() {
  return (
    <div className="flex flex-wrap gap-4">
      <MonthPicker className="rounded-lg border border-border" />
      <YearPicker className="rounded-lg border border-border" />
    </div>
  );
}
