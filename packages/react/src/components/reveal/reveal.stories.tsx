import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedNumber } from "../animated-number/animated-number.js";
import { Reveal } from "./reveal.js";

const meta = { title: "Motion/Reveal", component: Reveal } satisfies Meta<typeof Reveal>;
export default meta;
type Story = StoryObj;

export const Group: Story = {
  render: () => (
    <Reveal stagger={80} className="grid max-w-xl gap-3 sm:grid-cols-2">
      {["Tokens", "Accessible", "RTL", "Tree-shakeable"].map((t) => (
        <div key={t} className="rounded-lg border border-border bg-card p-6 text-sm">
          {t}
        </div>
      ))}
    </Reveal>
  ),
};
export const Numbers: Story = {
  render: () => (
    <p className="text-3xl font-semibold">
      <AnimatedNumber value={48210} format={{ style: "currency", currency: "EUR" }} />
    </p>
  ),
};
