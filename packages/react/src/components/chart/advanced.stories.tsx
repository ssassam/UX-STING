import type { Meta, StoryObj } from "@storybook/react-vite";
import { GaugeChart, PieChart, RingChart, SegmentChart } from "./radial-chart.js";
import { HorizontalBarChart, ScatterChart } from "./comparison-chart.js";
import { RangeChart } from "./range-chart.js";
import { ComboChart } from "./combo-chart.js";
const meta = { title: "Data display/Chart/Expanded" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const parts = [
  { name: "Desktop", value: 60 },
  { name: "Mobile", value: 30 },
  { name: "Tablet", value: 10 },
];
export const Radial: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <GaugeChart label="Goal" value={72} />
      <GaugeChart label="Unavailable goal" value={null} />
      <PieChart label="Devices" data={parts} />
      <RingChart label="Targets" data={parts.map((d) => ({ ...d, max: 100 }))} />
      <SegmentChart label="Composition" data={parts} />
    </div>
  ),
};
export const Cartesian: Story = {
  render: () => (
    <div className="grid gap-6">
      <HorizontalBarChart
        label="Activity"
        data={[
          { day: "Mon", value: 30 },
          { day: "Tue", value: 40 },
        ]}
        index="day"
        series={[{ key: "value", label: "Activity" }]}
      />
      <ScatterChart
        label="Distribution"
        xLabel="X"
        yLabel="Y"
        data={[{ id: "one", name: "First", x: 4, y: 8, size: 100 }]}
      />
      <ComboChart
        label="Mixed"
        data={[
          { day: "Mon", value: 30 },
          { day: "Tue", value: 50 },
        ]}
        index="day"
        series={[{ key: "value", label: "Activity", type: "lollipop" }]}
      />
    </div>
  ),
};

export const Ranges: Story = {
  render: () => (
    <RangeChart
      label="Fictional range observations"
      data={[
        { name: "Mon", low: 10, high: 30, open: 15, close: 25 },
        { name: "Tue", low: 15, high: 35, open: 30, close: 20 },
      ]}
    />
  ),
};
