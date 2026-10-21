import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./logo.js";

const mark = (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M64 16h128a48 48 0 0 1 48 48v128a48 48 0 0 1-48 48H64a48 48 0 0 1-48-48V64a48 48 0 0 1 48-48Zm8 168a112 112 0 0 1 112-112v56a56 56 0 0 0-56 56Z"
    />
  </svg>
);

const meta = {
  title: "Foundations/Logo",
  component: Logo,
  args: { name: "Northwind", mark },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stacked: Story = { args: { layout: "stacked", size: "lg" } };
export const Reversed: Story = {
  args: { tone: "reversed" },
  decorators: [(Story) => <div className="inline-block rounded-lg bg-primary p-4">{Story()}</div>],
};
export const DarkMode: Story = { globals: { mode: "dark" } };
