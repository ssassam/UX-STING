import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { Button } from "../button/button.js";
import { toast } from "./toast-store.js";
import { Toaster } from "./toaster.js";

const meta = { title: "Feedback/Toast", component: Toaster, tags: ["no-visual"] } satisfies Meta<typeof Toaster>;
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Draft saved")}>Default</Button>
      <Button variant="outline" onClick={() => toast.success("Published", { description: "Visible in search." })}>Success</Button>
      <Button variant="outline" onClick={() => toast.error("Could not save", { description: "Retry in a moment." })}>Error</Button>
      <Button variant="outline" onClick={() => toast("Review archived", { action: { label: "Undo", onClick: () => toast.success("Restored") } })}>With undo</Button>
    </div>
  ),
};

function Stack() {
  useEffect(() => {
    toast.success("Listing published", { duration: Infinity });
    toast.warning("Photo is low resolution", { duration: Infinity });
    toast("Review archived", { duration: Infinity, action: { label: "Undo", onClick: () => {} } });
    return () => toast.dismiss();
  }, []);
  return <p className="text-sm text-muted-foreground">Three persistent toasts.</p>;
}
export const Stacked: Story = { render: () => <Stack /> };
