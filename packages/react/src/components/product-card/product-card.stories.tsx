import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import { Price } from "../price/price.js";
import { ProductCard } from "./product-card.js";

const meta = {
  title: "Patterns/ProductCard",
  component: ProductCard,
  args: {
    name: "Handwoven Berber rug",
    image: { src: "", alt: "Rug" },
    price: <Price amount={420} currency="EUR" compareAt={520} />,
    href: "#",
    brand: "Atlas Loom",
    rating: 4.8,
    reviewCount: 88,
    badges: <Badge variant="destructive">Sale</Badge>,
    action: (
      <Button size="sm" fullWidth variant="outline">
        Add to cart
      </Button>
    ),
  },
} satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-60">
      <ProductCard {...args} />
    </div>
  ),
};
export const DarkMode: Story = { ...Default, globals: { mode: "dark" } };
