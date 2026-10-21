import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { OrderSummary } from "./order-summary.js";

const meta = {
  title: "Commerce/OrderSummary",
  component: OrderSummary,
  args: {
    currency: "EUR",
    locale: "en-GB",
    note: "VAT included",
    lines: [
      { label: "Subtotal (3 items)", amount: 477 },
      { label: "Discount", amount: 47.7, kind: "discount", hint: "Code SPRING10" },
      { label: "Shipping", amount: 0, display: "Free" },
    ],
    children: (
      <Button size="lg" fullWidth>
        Checkout
      </Button>
    ),
  },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof OrderSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkMode: Story = { globals: { mode: "dark" } };
