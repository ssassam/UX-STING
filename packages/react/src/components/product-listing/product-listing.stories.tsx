import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterSection } from "../filter-panel/filter-panel.js";
import { ProductListing } from "./product-listing.js";

const meta = {
  title: "Commerce/ProductListing",
  component: ProductListing,
  args: {
    title: "Home & living",
    resultCount: 128,
    filters: <FilterSection title="Material">Wool · Cotton · Clay</FilterSection>,
    activeFilters: [{ id: "wool", label: "Material: Wool" }],
    onRemoveFilter: () => {},
    onClearFilters: () => {},
    children: (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted" />
        ))}
      </div>
    ),
  },
} satisfies Meta<typeof ProductListing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkMode: Story = { globals: { mode: "dark" } };
