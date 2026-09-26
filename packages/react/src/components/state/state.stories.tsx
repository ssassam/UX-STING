import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { EmptyState, ErrorState, LoadingState, SuccessState } from "./state.js";

const meta = {
  title: "Feedback/States",
  component: EmptyState,
  args: { title: "No results" },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <EmptyState
        title="No places match"
        description="Try removing a filter."
        actions={<Button variant="outline">Clear filters</Button>}
      />
      <ErrorState
        title="Couldn't load reviews"
        description="The server did not respond."
        actions={<Button variant="outline">Retry</Button>}
      />
      <SuccessState title="Listing published" />
      <LoadingState title="Preparing report" />
    </div>
  ),
};
export const DarkMode: Story = { ...All, globals: { mode: "dark" } };
