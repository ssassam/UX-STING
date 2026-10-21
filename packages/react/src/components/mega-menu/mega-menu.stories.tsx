import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaMenu } from "./mega-menu.js";

const meta = {
  title: "Commerce/MegaMenu",
  component: MegaMenu,
  args: {
    label: "Shop",
    currentHref: "#sale",
    items: [
      {
        label: "Home",
        allHref: "#home",
        allLabel: "Shop all home",
        columns: [
          {
            title: "Living",
            links: [
              { label: "Rugs", href: "#rugs" },
              { label: "Lighting", href: "#lighting" },
            ],
          },
          {
            title: "Kitchen",
            links: [
              { label: "Tagines", href: "#tagines" },
              { label: "Tea sets", href: "#tea" },
            ],
          },
        ],
      },
      { label: "Sale", href: "#sale" },
    ],
  },
} satisfies Meta<typeof MegaMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkMode: Story = { globals: { mode: "dark" } };
