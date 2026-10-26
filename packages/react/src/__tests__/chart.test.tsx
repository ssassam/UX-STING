import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  AreaChart,
  BarChart,
  BarList,
  ChartMetrics,
  DonutChart,
  LineChart,
  niceTicks,
  slotColor,
  Sparkline,
  tickIndices,
} from "../index.js";

const days = [
  { date: "Oct 1", clicks: 120, impressions: 3400 },
  { date: "Oct 2", clicks: 98, impressions: 3100 },
  { date: "Oct 3", clicks: 143, impressions: 3900 },
];

describe("chart utils", () => {
  it("builds round ticks that cover the range", () => {
    expect(niceTicks(0, 143)).toEqual([0, 50, 100, 150]);
    expect(niceTicks(3, 3)).toEqual([2.6, 2.8, 3, 3.2, 3.4]);
    expect(niceTicks(0, 0)).toEqual([0, 1]);
  });

  it("thins x labels to the width and keeps the last one", () => {
    expect(tickIndices(5, 1000)).toEqual([0, 1, 2, 3, 4]);
    const few = tickIndices(90, 300);
    expect(few[0]).toBe(0);
    expect(few[few.length - 1]).toBe(89);
    expect(few.length).toBeLessThanOrEqual(5);
  });

  it("assigns slots in order and never cycles", () => {
    expect(slotColor(undefined, 0)).toBe("var(--ui-chart-1)");
    expect(slotColor(undefined, 7)).toBe("var(--ui-chart-8)");
    expect(slotColor(undefined, 8)).toBe("var(--ui-muted-foreground)");
    expect(slotColor(3, 0)).toBe("var(--ui-chart-3)");
  });
});

describe("LineChart", () => {
  it("renders an accessible chart with a data table", async () => {
    const { container } = render(
      <LineChart
        data={days}
        index="date"
        label="Clicks per day"
        series={[{ key: "clicks", label: "Clicks" }]}
      />,
    );
    expect(screen.getByRole("group", { name: "Clicks per day" })).toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Clicks per day" });
    expect(within(table).getByRole("rowheader", { name: "Oct 3" })).toBeInTheDocument();
    expect(within(table).getByText("143")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("shows a legend only for two or more series", () => {
    const { rerender } = render(
      <LineChart data={days} index="date" label="Traffic" series={[{ key: "clicks", label: "Clicks" }]} />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    rerender(
      <LineChart
        data={days}
        index="date"
        label="Traffic"
        series={[
          { key: "clicks", label: "Clicks" },
          { key: "impressions", label: "Impressions" },
        ]}
      />,
    );
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(2);
  });

  it("moves through points with the keyboard and announces them", () => {
    render(
      <AreaChart
        data={days}
        index="date"
        label="Clicks per day"
        series={[{ key: "clicks", label: "Clicks", format: (v) => `${v} clicks` }]}
      />,
    );
    const chart = screen.getByRole("group", { name: "Clicks per day" });
    chart.focus();
    fireEvent.keyDown(chart, { key: "ArrowRight" });
    expect(screen.getByText("Oct 1: Clicks 120 clicks")).toBeInTheDocument();
    fireEvent.keyDown(chart, { key: "End" });
    expect(screen.getByText("Oct 3: Clicks 143 clicks")).toBeInTheDocument();
    fireEvent.keyDown(chart, { key: "ArrowLeft" });
    expect(screen.getByText("Oct 2: Clicks 98 clicks")).toBeInTheDocument();
    fireEvent.keyDown(chart, { key: "Escape" });
    expect(screen.queryByText(/Oct 2:/)).not.toBeInTheDocument();
  });

  it("renders the empty state", () => {
    render(<LineChart data={[]} index="date" label="Clicks" series={[]} empty="Waiting for data" />);
    expect(screen.getByText("Waiting for data")).toBeInTheDocument();
  });
});

describe("BarChart", () => {
  it("renders an accessible column chart", async () => {
    const { container } = render(
      <BarChart
        data={days}
        index="date"
        label="Requests"
        stacked
        series={[
          { key: "clicks", label: "Clicks" },
          { key: "impressions", label: "Impressions" },
        ]}
      />,
    );
    expect(screen.getByRole("table", { name: "Requests" })).toBeInTheDocument();
    const chart = screen.getByRole("group", { name: "Requests" });
    chart.focus();
    fireEvent.keyDown(chart, { key: "Home" });
    expect(screen.getByText("Oct 1: Clicks 120, Impressions 3,400")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("BarList", () => {
  it("sorts, limits and prints every value", async () => {
    const { container } = render(
      <BarList
        label="Top countries"
        limit={2}
        showShare
        data={[
          { name: "France", value: 20 },
          { name: "Morocco", value: 70, href: "/ma" },
          { name: "Spain", value: 10 },
        ]}
      />,
    );
    const items = within(screen.getByRole("list", { name: "Top countries" })).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Morocco");
    expect(items[0]).toHaveTextContent("70.0%");
    expect(screen.getByRole("link", { name: "Morocco" })).toHaveAttribute("href", "/ma");
    await expectNoA11yViolations(container);
  });
});

describe("DonutChart", () => {
  it("labels the ring and lists shares", async () => {
    const { container } = render(
      <DonutChart
        label="Sessions by device"
        centerLabel="sessions"
        data={[
          { name: "Mobile", value: 75 },
          { name: "Desktop", value: 25 },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Sessions by device" })).toBeInTheDocument();
    expect(screen.getAllByText("75.0%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("100").length).toBeGreaterThan(0);
    await expectNoA11yViolations(container);
  });
});

describe("Sparkline", () => {
  it("is a labelled image", () => {
    render(<Sparkline data={[1, 3, 2, 5]} label="Clicks, last 4 days" />);
    expect(screen.getByRole("img", { name: "Clicks, last 4 days" })).toBeInTheDocument();
  });
});

describe("ChartMetrics", () => {
  const metrics = [
    { key: "clicks", label: "Clicks", value: "1.2K", delta: "+12%", trend: "up" as const },
    {
      key: "position",
      label: "Avg. position",
      value: "10.5",
      delta: "+0.9",
      trend: "up" as const,
      trendMeaning: "positive-down" as const,
    },
  ];

  it("works uncontrolled with arrow keys", async () => {
    const onValueChange = vi.fn();
    const { container } = render(<ChartMetrics label="Metric" metrics={metrics} onValueChange={onValueChange} />);
    const [clicks, position] = screen.getAllByRole("radio");
    expect(clicks).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(clicks!, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith("position");
    expect(position).toHaveAttribute("aria-checked", "true");
    expect(position).toHaveFocus();
    await expectNoA11yViolations(container);
  });

  it("works controlled", () => {
    const onValueChange = vi.fn();
    render(<ChartMetrics label="Metric" metrics={metrics} value="position" onValueChange={onValueChange} />);
    const [clicks, position] = screen.getAllByRole("radio");
    expect(position).toHaveAttribute("aria-checked", "true");
    fireEvent.click(clicks!);
    expect(onValueChange).toHaveBeenCalledWith("clicks");
    expect(position).toHaveAttribute("aria-checked", "true");
  });
});
