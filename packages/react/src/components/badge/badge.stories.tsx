import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, CountBadge } from "./badge.js";

const meta = {
  title: "Data display/Badge",
  component: Badge,
  args: { children: "Open" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const variants = [
  "default",
  "secondary",
  "outline",
  "primary",
  "success",
  "warning",
  "destructive",
  "info",
] as const;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <Badge key={v} variant={v} dot>
          {v}
        </Badge>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">sm</Badge>
      <Badge>md</Badge>
      <Badge size="lg">lg</Badge>
      <CountBadge count={120} label="120 notifications" />
    </div>
  ),
};
export const LongContent: Story = {
  args: {
    children: "Extremely long badge label that should truncate gracefully",
    className: "max-w-48",
  },
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
