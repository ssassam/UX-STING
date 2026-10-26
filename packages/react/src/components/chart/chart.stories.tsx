import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Card } from "../card/card.js";
import { AreaChart, LineChart } from "./line-chart.js";
import { BarChart } from "./bar-chart.js";
import { BarList } from "./bar-list.js";
import { ChartMetrics } from "./chart-metrics.js";
import { DonutChart } from "./donut-chart.js";
import { Sparkline } from "./sparkline.js";

// The charts are generic over their data, so stories are render-only.
const meta = {
  title: "Data display/Chart",
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Deterministic sample data so visual baselines are stable.
const days = Array.from({ length: 28 }, (_, i) => {
  const wave = Math.sin(i / 3) * 18 + Math.cos(i / 5) * 9;
  return {
    date: `Oct ${i + 1}`,
    clicks: Math.round(120 + wave + i * 2.2),
    impressions: Math.round(3400 + wave * 40 + i * 35),
    ctr: (120 + wave + i * 2.2) / (3400 + wave * 40 + i * 35),
    position: 12.4 - i * 0.07 + Math.sin(i / 2) * 0.4,
  };
});

const METRICS = [
  { key: "clicks", label: "Clicks", value: "4.2K", delta: "+18.4%", trend: "up", colorSlot: 1 },
  { key: "impressions", label: "Impressions", value: "112K", delta: "+9.1%", trend: "up", colorSlot: 7 },
  { key: "ctr", label: "Average CTR", value: "3.7%", delta: "+0.3 pts", trend: "up", colorSlot: 3 },
  {
    key: "position",
    label: "Average position",
    value: "10.9",
    delta: "1.5 places better",
    trend: "down",
    trendMeaning: "positive-down",
    colorSlot: 2,
  },
] as const;

function SearchPerformance() {
  const [metric, setMetric] = useState<string>("clicks");
  const m = METRICS.find((x) => x.key === metric)!;
  const format =
    metric === "ctr" ? (v: number) => `${(v * 100).toFixed(1)}%` : metric === "position" ? (v: number) => v.toFixed(1) : undefined;
  return (
    <Card className="grid gap-5 p-5">
      <ChartMetrics label="Metric" metrics={[...METRICS]} value={metric} onValueChange={setMetric} />
      <AreaChart
        data={days}
        index="date"
        label={`${m.label} per day`}
        series={[{ key: m.key, label: m.label, colorSlot: m.colorSlot, format }]}
        reversed={metric === "position"}
        zeroBaseline={metric !== "position"}
      />
    </Card>
  );
}

export const Default: Story = {
  render: () => <SearchPerformance />,
};

export const MultiSeries: Story = {
  render: () => (
    <Card className="p-5">
      <LineChart
        data={days.map((d) => ({ date: d.date, web: d.clicks, maps: Math.round(d.clicks * 0.6), images: Math.round(d.clicks * 0.25) }))}
        index="date"
        label="Clicks by surface"
        series={[
          { key: "web", label: "Web" },
          { key: "maps", label: "Maps" },
          { key: "images", label: "Images" },
        ]}
      />
    </Card>
  ),
};

export const Columns: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5">
        <BarChart
          data={days.slice(-7).map((d) => ({ date: d.date, requests: d.impressions * 9 }))}
          index="date"
          label="Requests per day"
          series={[{ key: "requests", label: "Requests" }]}
          showValues
        />
      </Card>
      <Card className="p-5">
        <BarChart
          data={days.slice(-7).map((d) => ({ date: d.date, hit: d.impressions * 6, miss: d.impressions * 2, dynamic: d.impressions }))}
          index="date"
          label="Requests by cache status"
          stacked
          series={[
            { key: "hit", label: "Hit" },
            { key: "miss", label: "Miss" },
            { key: "dynamic", label: "Dynamic" },
          ]}
        />
      </Card>
    </div>
  ),
};

export const Rankings: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5">
        <BarList
          label="Top countries"
          showShare
          data={[
            { name: "Morocco", value: 18234 },
            { name: "France", value: 4120 },
            { name: "United States", value: 2210 },
            { name: "Spain", value: 1302 },
            { name: "Belgium", value: 840 },
          ]}
        />
      </Card>
      <Card className="p-5">
        <DonutChart
          label="Sessions by device"
          centerLabel="sessions"
          data={[
            { name: "Mobile", value: 7421 },
            { name: "Desktop", value: 2310 },
            { name: "Tablet", value: 412 },
          ]}
        />
      </Card>
      <Card className="grid gap-2 p-5">
        <span className="text-sm text-muted-foreground">Clicks, last 28 days</span>
        <span className="text-2xl font-semibold">4,212</span>
        <Sparkline data={days.map((d) => d.clicks)} label="Clicks, last 28 days" />
      </Card>
    </div>
  ),
};
