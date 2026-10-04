import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuantitySelector } from "./quantity-selector.js";

const meta = {
  title: "Commerce/QuantitySelector",
  component: QuantitySelector,
  args: { stock: 8, defaultValue: 2 },
} satisfies Meta<typeof QuantitySelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <QuantitySelector size="sm" aria-label="Small" />
      <QuantitySelector size="md" aria-label="Medium" />
      <QuantitySelector size="lg" aria-label="Large" />
    </div>
  ),
};
export const AtLimit: Story = { args: { stock: 3, defaultValue: 3 } };
export const Disabled: Story = { args: { disabled: true } };
export const DarkMode: Story = { globals: { mode: "dark" } };
