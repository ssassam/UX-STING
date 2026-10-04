import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Price } from "../price/price.js";
import { ProductDetails } from "./product-details.js";

const meta = {
  title: "Commerce/ProductDetails",
  component: ProductDetails,
  args: {
    gallery: <div className="aspect-square rounded-xl bg-muted" />,
    brand: "Atlas Loom",
    title: "Handwoven Berber rug",
    rating: 4.8,
    reviewCount: 88,
    price: <Price amount={420} compareAt={520} currency="EUR" size="xl" />,
    description: "Knotted by hand from undyed wool in the Middle Atlas.",
    actions: <Button size="lg">Add to cart</Button>,
  },
} satisfies Meta<typeof ProductDetails>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkMode: Story = { globals: { mode: "dark" } };
