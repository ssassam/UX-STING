import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";
import { Banner } from "./banner.js";

const meta = { title: "Feedback/Alert", component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj;

const variants = ["default", "info", "success", "warning", "destructive"] as const;

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      {variants.map((v) => (
        <Alert key={v} variant={v}>
          <AlertTitle>{v} alert</AlertTitle>
          <AlertDescription>Short supporting description for the {v} state.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
};
export const LongContent: Story = {
  render: () => (
    <Alert variant="warning" className="max-w-sm">
      <AlertTitle>Your plan renews soon and includes several changes you should review carefully</AlertTitle>
      <AlertDescription>
        https://example.com/a/very/long/url/that/should/wrap/instead/of/overflowing/the/container/on/small/screens
      </AlertDescription>
    </Alert>
  ),
};
export const Banners: Story = { render: () => <Banner dismissible>Spring promotion: list your business free for 3 months.</Banner> };
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
export const HighContrast: Story = { ...Variants, globals: { mode: "high-contrast" } };
