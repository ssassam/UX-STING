import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText } from "../skeleton/skeleton.js";
import { Spinner } from "../spinner/spinner.js";
import { CircularProgress, Progress } from "./progress.js";

const meta = { title: "Feedback/Progress & loading", component: Progress } satisfies Meta<
  typeof Progress
>;
export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-md gap-5">
      <Progress value={64} label="Profile" showValue id="p1" />
      {(["success", "warning", "destructive", "info"] as const).map((v, i) => (
        <Progress key={v} value={20 * (i + 1)} variant={v} aria-label={v} />
      ))}
      <Progress aria-label="Indeterminate" />
      <div className="flex items-center gap-4 text-primary">
        <CircularProgress value={72} showValue aria-label="Goal" />
        <CircularProgress aria-label="Loading" />
        <Spinner size="lg" />
      </div>
    </div>
  ),
};
export const Skeletons: Story = {
  render: () => (
    <div className="grid max-w-sm gap-3">
      <Skeleton className="aspect-video" />
      <SkeletonText lines={3} />
    </div>
  ),
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
