import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductGallery } from "./product-gallery.js";

// Inline pixels keep visual tests deterministic (no network).
const images = ["Front", "Detail", "Rolled", "In room"].map((alt, i) => ({
  src: `data:image/gif;base64,R0lGODlhAQABAAAAACw=#${i}`,
  alt,
}));

const meta = {
  title: "Commerce/ProductGallery",
  component: ProductGallery,
  args: { images },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof ProductGallery>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SideThumbnails: Story = { args: { thumbnails: "start", ratio: 4 / 5 } };
export const DarkMode: Story = { globals: { mode: "dark" } };
