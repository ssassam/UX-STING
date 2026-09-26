import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./calendar.js";

const today = new Date(2026, 3, 15);
const meta = { title: "Date & time/Calendar", component: Calendar } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { today, defaultMonth: today, defaultValue: new Date(2026, 3, 18) },
};
export const Range: Story = {
  args: {
    mode: "range",
    today,
    numberOfMonths: 2,
    defaultMonth: today,
    defaultValue: { from: new Date(2026, 3, 18), to: new Date(2026, 4, 2) },
  } as never,
};
export const DisabledDays: Story = {
  args: { today, defaultMonth: today, min: today, isDisabled: (d: Date) => d.getDay() === 0 },
};
export const French: Story = { ...Single, globals: { locale: "fr" } };
export const Arabic: Story = { ...Single, globals: { locale: "ar" } };
export const DarkMode: Story = { ...Range, globals: { mode: "dark" } };
