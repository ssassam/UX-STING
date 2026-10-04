import type { Meta, StoryObj } from "@storybook/react-vite";
import { Swatch, SwatchGroup } from "./swatch.js";

const meta = { title: "Commerce/Swatch", component: SwatchGroup } satisfies Meta<
  typeof SwatchGroup
>;
export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <SwatchGroup aria-label="Color" defaultValue="terracotta">
      <Swatch value="sand" label="Sand" color="oklch(0.82 0.06 80)" />
      <Swatch value="terracotta" label="Terracotta" color="oklch(0.6 0.13 40)" />
      <Swatch value="indigo" label="Indigo" color="oklch(0.4 0.12 270)" />
      <Swatch value="sage" label="Sage" color="oklch(0.72 0.05 150)" unavailable />
    </SwatchGroup>
  ),
};
export const Sizes: Story = {
  render: () => (
    <SwatchGroup aria-label="Size" defaultValue="m">
      {["XS", "S", "M", "L", "XL"].map((s) => (
        <Swatch key={s} value={s.toLowerCase()} label={s} unavailable={s === "XS"} />
      ))}
    </SwatchGroup>
  ),
};
export const DarkMode: Story = { ...Colors, globals: { mode: "dark" } };
