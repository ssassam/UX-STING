import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartLineItem } from "./cart-line-item.js";

const meta = {
  title: "Commerce/CartLineItem",
  component: CartLineItem,
  args: {
    name: "Ceramic tagine, hand painted",
    image: { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", alt: "Tagine" },
    options: [
      { label: "Size", value: "Large" },
      { label: "Pattern", value: "Fes blue" },
    ],
    price: 38,
    compareAt: 45,
    currency: "EUR",
    quantity: 2,
    onRemove: () => {},
  },
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
} satisfies Meta<typeof CartLineItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const DarkMode: Story = { globals: { mode: "dark" } };
