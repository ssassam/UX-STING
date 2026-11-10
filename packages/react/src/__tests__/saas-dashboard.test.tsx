import { fireEvent, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { renderWithProvider, expectNoA11yViolations } from "../test-utils.js";
import {
  DashboardPanel,
  DashboardToolbar,
  DashboardGrid,
  MetricSummary,
  WorkBoard,
  ScheduleView,
  Conversation,
  AuthPanel,
  PieChart,
  GaugeChart,
  RingChart,
  SegmentChart,
  HorizontalBarChart,
  ScatterChart,
  ComboChart,
} from "../index.js";
const rows = [
  { month: "Jan", actual: 10, target: 15 },
  { month: "Feb", actual: null, target: 20 },
];
describe("SaaS compositions", () => {
  it("names panels and groups without introducing toolbar arrow-key traps", async () => {
    const { container } = renderWithProvider(
      <>
        <DashboardToolbar label="Filters" summary="Actual reports">
          <label>
            Category
            <select>
              <option>All</option>
            </select>
          </label>
        </DashboardToolbar>
        <DashboardGrid>
          <DashboardPanel title="Performance">
            <MetricSummary label="Clicks" value="1K" detail="Google Search Console" />
          </DashboardPanel>
        </DashboardGrid>
        <AuthPanel title="Sign in">
          <label>
            Email
            <input type="email" />
          </label>
        </AuthPanel>
      </>,
    );
    expect(screen.getByRole("region", { name: "Performance" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Filters" })).toBeTruthy();
    await expectNoA11yViolations(container);
  });
  it("moves a controlled board item using a native keyboard-operable select", () => {
    function Demo() {
      const [items, set] = useState([{ id: "one", column: "todo", title: "Audit" }]);
      return (
        <WorkBoard
          label="Tasks"
          columns={[
            { id: "todo", label: "To do" },
            { id: "done", label: "Done" },
          ]}
          items={items}
          onMove={(id, column) =>
            set((old) => old.map((item) => (item.id === id ? { ...item, column } : item)))
          }
        />
      );
    }
    renderWithProvider(<Demo />);
    fireEvent.change(screen.getByRole("combobox", { name: "Move Audit" }), {
      target: { value: "done" },
    });
    expect(within(screen.getByRole("region", { name: "Done" })).getByText("Audit")).toBeTruthy();
  });
  it("sorts an agenda by real ISO time and excludes invalid dates", () => {
    renderWithProvider(
      <ScheduleView
        label="Agenda"
        items={[
          { id: "b", title: "Later", start: "2026-11-06T12:00:00Z" },
          { id: "bad", title: "Invalid", start: "bad" },
          { id: "a", title: "First", start: "2026-11-05T12:00:00Z" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")[0]?.textContent).toContain("First");
    expect(screen.queryByText("Invalid")).toBeNull();
  });
  it("preserves a failed message draft and only clears after a successful retry", async () => {
    const send = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    const { container } = renderWithProvider(
      <Conversation label="Project chat" messages={[]} onSend={send} />,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Hello");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await vi.waitFor(() =>
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(""),
    );
    expect(send).toHaveBeenCalledTimes(2);
    await expectNoA11yViolations(container);
  });
});
describe("expanded charts", () => {
  it("does not turn missing gauge values into zero", async () => {
    const { container } = renderWithProvider(<GaugeChart label="Coverage" value={null} />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Coverage: —");
    await expectNoA11yViolations(container);
  });
  it("clamps gauge geometry while retaining the actual reported value", () => {
    const { container } = renderWithProvider(<GaugeChart label="Goal" value={120} />);
    expect(container.querySelector('[stroke-dasharray="100 100"]')).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("aria-label")).toContain("120");
  });
  it("makes pie categories operable and handles zero totals without NaN", async () => {
    const { container } = renderWithProvider(
      <PieChart
        label="Devices"
        data={[
          { name: "Desktop", value: 0 },
          { name: "Mobile", value: 0 },
        ]}
        innerRadius={0.65}
        semicircle
      />,
    );
    fireEvent.focus(screen.getByRole("button", { name: /Desktop/ }));
    expect(container.innerHTML).not.toContain("NaN");
    await expectNoA11yViolations(container);
  });
  it("renders rings and segments with stable supplied colors and explicit maximums", async () => {
    const { container } = renderWithProvider(
      <>
        <RingChart
          label="Targets"
          data={[{ name: "Clicks", value: 30, max: 100, color: "var(--ui-primary)" }]}
        />
        <SegmentChart
          label="Reviews"
          data={[
            { name: "No reviews", value: 0 },
            { name: "Positive", value: 2, colorSlot: 3 },
          ]}
        />
      </>,
    );
    expect(container.querySelector('svg[width="180"]')).toBeTruthy();
    expect(container.querySelector('[style*="--ui-chart-3"]')).toBeTruthy();
    await expectNoA11yViolations(container);
  });
  it("normalizes each horizontal stack and retains the raw values in its table", async () => {
    const { container } = renderWithProvider(
      <HorizontalBarChart
        label="Demographics"
        data={[{ name: "18–24", a: 25, b: 75 }]}
        index="name"
        series={[
          { key: "a", label: "A", color: "var(--ui-primary)" },
          { key: "b", label: "B" },
        ]}
        stacked
        normalized
      />,
    );
    expect(container.querySelector('[style*="width: 25%"]')).toBeTruthy();
    expect(screen.getByRole("table").textContent).toContain("75");
    await expectNoA11yViolations(container);
  });
  it("walks bubbles by keyboard and excludes invalid observations", async () => {
    const { container } = renderWithProvider(
      <ScatterChart
        label="Portfolio"
        data={[
          { id: "a", name: "A", x: 1, y: 2 },
          { id: "b", name: "B", x: 2, y: 4 },
          { id: "bad", name: "Invalid", x: NaN, y: 2 },
        ]}
        xLabel="Clicks"
        yLabel="Sessions"
      />,
    );
    fireEvent.keyDown(screen.getByRole("group", { name: "Portfolio" }), { key: "End" });
    expect(container.querySelector("[aria-live]")?.textContent).toContain("B · Clicks: 2");
    expect(screen.queryByText("Invalid")).toBeNull();
    await expectNoA11yViolations(container);
  });
  it("keeps missing mixed-chart observations as gaps and announces exact values", async () => {
    const { container } = renderWithProvider(
      <ComboChart
        label="Sales"
        data={rows}
        index="month"
        series={[
          { key: "actual", label: "Actual", type: "bar" },
          { key: "target", label: "Target", type: "line", dashed: true },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getByRole("group", { name: "Sales" }), { key: "End" });
    expect(container.querySelector("[aria-live]")?.textContent).toContain("Actual: —");
    expect(container.querySelector('[stroke-dasharray="5 4"]')).toBeTruthy();
    await expectNoA11yViolations(container);
  });
});

describe("SaaS records and scheduling", () => {
  it("calculates invoice totals and removes a controlled row", async () => {
    const { InvoiceComposer } = await import("../components/saas-dashboard/index.js");
    function Demo() {
      const [items, set] = useState([
        { id: "one", description: "Audit", quantity: 2, unitPrice: 12.5 },
      ]);
      return (
        <InvoiceComposer
          label="Invoice"
          items={items}
          onChange={set}
          currency="USD"
          taxRate={0.2}
        />
      );
    }
    const { container } = renderWithProvider(<Demo />);
    expect(container.textContent).toContain("$30.00");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity 1" }), {
      target: { value: "3" },
    });
    expect(container.textContent).toContain("$45.00");
    fireEvent.click(screen.getByRole("button", { name: "Remove 1" }));
    expect(container.textContent).toContain("$0.00");
    fireEvent.click(screen.getByRole("button", { name: "Add line" }));
    expect(screen.getByRole("textbox", { name: "Description 1" })).toBeTruthy();
    await expectNoA11yViolations(container);
  });
  it("keeps record values on save failure and renders password fields securely", async () => {
    const { RecordEditor } = await import("../components/saas-dashboard/index.js");
    const save = vi.fn().mockRejectedValue(new Error("offline"));
    const { container } = renderWithProvider(
      <RecordEditor
        label="Login"
        fields={[{ key: "password", label: "Password", type: "password" }]}
        values={{ password: "private" }}
        onChange={() => {}}
        onSave={save}
      />,
    );
    expect(container.querySelector('input[type="password"]')).toBeTruthy();
    fireEvent.submit(screen.getByRole("form", { name: "Login" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("private");
    await expectNoA11yViolations(container);
  });
  it("filters day schedules and clips timeline tasks to the specified range", async () => {
    const { ScheduleCalendar, TaskTimeline } =
      await import("../components/saas-dashboard/index.js");
    const { container } = renderWithProvider(
      <>
        <ScheduleCalendar
          label="Calendar"
          date={new Date(2026, 10, 5)}
          onDateChange={() => {}}
          view="day"
          items={[
            { id: "one", title: "Today", start: "2026-11-05T10:00:00" },
            { id: "two", title: "Tomorrow", start: "2026-11-06T10:00:00" },
          ]}
        />
        <TaskTimeline
          label="Tasks"
          start="2026-11-01"
          end="2026-11-30"
          tasks={[
            { id: "outside", title: "Outside", start: "2026-12-01", end: "2026-12-05" },
            { id: "inside", title: "Audit", start: "2026-10-25", end: "2026-11-15" },
          ]}
        />
      </>,
    );
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.queryByText("Tomorrow")).toBeNull();
    expect(screen.queryByText("Outside")).toBeNull();
    expect(container.querySelector('[style*="margin-inline-start: 0%"]')).toBeTruthy();
    await expectNoA11yViolations(container);
  });
});

it("range charts reject invalid intervals and announce all four observations", async () => {
  const { RangeChart } = await import("../components/chart/index.js");
  const { container } = renderWithProvider(
    <RangeChart
      label="Trading range"
      data={[
        { name: "Mon", low: 10, high: 30, open: 15, close: 25 },
        { name: "Bad", low: 30, high: 10, open: 20, close: 15 },
      ]}
    />,
  );
  fireEvent.keyDown(screen.getByRole("group", { name: "Trading range" }), { key: "Home" });
  expect(container.querySelector("[aria-live]")?.textContent).toContain(
    "low 10 · high 30 · open 15 · close 25",
  );
  expect(screen.queryByText("Bad")).toBeNull();
  await expectNoA11yViolations(container);
});

it("horizontal comparisons keep missing observations unavailable", () => {
  renderWithProvider(
    <HorizontalBarChart
      label="Missing data"
      data={[{ name: "A", clicks: null }]}
      index="name"
      series={[{ key: "clicks", label: "Clicks" }]}
    />,
  );
  expect(screen.getByRole("table").textContent).toContain("—");
  expect(screen.getByText("Clicks: —")).toBeTruthy();
});
