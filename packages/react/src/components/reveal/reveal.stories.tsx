import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedNumber } from "../animated-number/animated-number.js";
import { Reveal, RevealGroup } from "./reveal.js";

const meta = { title: "Motion/Reveal", component: Reveal } satisfies Meta<typeof Reveal>;
export default meta;
type Story = StoryObj;

export const Group: Story = {
  render: () => (
    <RevealGroup className="grid max-w-xl gap-3 sm:grid-cols-2">
      {["Tokens", "Accessible", "RTL", "Tree-shakeable"].map((t) => (
        <div key={t} className="rounded-lg border border-border bg-card p-6 text-sm">
          {t}
        </div>
      ))}
    </RevealGroup>
  ),
};
export const Numbers: Story = {
  render: () => (
    <p className="text-3xl font-semibold">
      <AnimatedNumber value={48210} formatOptions={{ style: "currency", currency: "EUR" }} />
    </p>
  ),
};
