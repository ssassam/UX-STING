"use client";
import {
  PieChart,
  GaugeChart,
  RingChart,
  SegmentChart,
  HorizontalBarChart,
  ScatterChart,
  ComboChart,
  RangeChart,
} from "@ux-sting/react/chart";
const parts = [
  { name: "Desktop", value: 60 },
  { name: "Mobile", value: 30 },
  { name: "Tablet", value: 10 },
];
export function Radial() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <PieChart label="Example devices" data={parts} />
      <PieChart
        label="Example semicircle"
        data={parts}
        semicircle
        innerRadius={0.65}
        center="100"
      />
      <GaugeChart label="Example goal" value={72} />
      <RingChart label="Example targets" data={parts.map((d) => ({ ...d, max: 100 }))} />
      <SegmentChart label="Example composition" data={parts} />
    </div>
  );
}
export function Comparisons() {
  return (
    <div className="grid gap-6">
      <HorizontalBarChart
        label="Example activity"
        data={[
          { day: "Mon", new: 30, returning: 20 },
          { day: "Tue", new: 40, returning: 30 },
        ]}
        index="day"
        series={[
          { key: "new", label: "New" },
          { key: "returning", label: "Returning" },
        ]}
        stacked
        normalized
      />
      <ScatterChart
        label="Example distribution"
        xLabel="Visits"
        yLabel="Clicks"
        data={[
          { id: "a", name: "A", x: 10, y: 4, size: 100 },
          { id: "b", name: "B", x: 25, y: 15, size: 400 },
        ]}
      />
      <ComboChart
        label="Example target comparison"
        data={[
          { day: "Mon", actual: 30, target: 40 },
          { day: "Tue", actual: 45, target: 50 },
          { day: "Wed", actual: 65, target: 55 },
        ]}
        index="day"
        series={[
          { key: "actual", label: "Actual", type: "bar" },
          { key: "target", label: "Target", type: "line", dashed: true },
        ]}
      />
    </div>
  );
}

export function Ranges() {
  return (
    <RangeChart
      label="Example price ranges"
      data={[
        { name: "Mon", low: 10, high: 30, open: 15, close: 25 },
        { name: "Tue", low: 15, high: 35, open: 30, close: 20 },
      ]}
    />
  );
}
