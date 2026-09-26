"use client";
import { DatePicker, DateRangePicker, DateTimePicker } from "@ux-sting/react/date-picker";
import { Field } from "@ux-sting/react/field";

export function Basic() {
  return (
    <Field label="Check-in" className="max-w-xs">
      <DatePicker min={new Date()} name="checkin" />
    </Field>
  );
}

export function Range() {
  return (
    <Field label="Stay" className="max-w-sm">
      <DateRangePicker min={new Date()} name="stay" />
    </Field>
  );
}

export function WithTime() {
  return (
    <Field label="Appointment" className="max-w-xs">
      <DateTimePicker timeStep={15} />
    </Field>
  );
}
