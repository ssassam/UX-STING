import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DashboardPanel, DashboardToolbar, MetricSummary } from "./layout.js";
import { WorkBoard, Conversation } from "./work.js";
const meta = { title: "Patterns/SaaS dashboard" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: () => (
    <DashboardPanel title="Portfolio" description="Fictional example">
      <DashboardToolbar label="Filters" summary="Last 28 days">
        <button type="button">Period</button>
      </DashboardToolbar>
      <MetricSummary label="Clicks" value="1.2K" />
    </DashboardPanel>
  ),
};
export const Board: Story = {
  render: function Demo() {
    const [items, set] = useState([{ id: "one", column: "todo", title: "Review analytics" }]);
    return (
      <WorkBoard
        label="Tasks"
        items={items}
        columns={[
          { id: "todo", label: "To do" },
          { id: "done", label: "Done" },
        ]}
        onMove={(id, column) =>
          set((old) => old.map((item) => (item.id === id ? { ...item, column } : item)))
        }
      />
    );
  },
};
export const EmptyChat: Story = {
  render: () => <Conversation label="Chat" messages={[]} onSend={() => {}} />,
};
