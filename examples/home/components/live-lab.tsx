"use client";

import { ArrowRightIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { AreaChart } from "@ux-sting/react/chart";
import { DataGrid, type DataTableColumn } from "@ux-sting/react/data-table";
import { UIProvider } from "@ux-sting/react/provider";
import { Spotlight } from "@ux-sting/react/spotlight";
import { useState } from "react";

const themes = [
  { name: "Ion", primary: "sky", neutral: "slate" },
  { name: "Cobalt", primary: "blue", neutral: "slate" },
  { name: "Solar", primary: "orange", neutral: "gray" },
] as const;

const traffic = [
  { day: "01", visits: 22, signups: 8 },
  { day: "02", visits: 32, signups: 12 },
  { day: "03", visits: 27, signups: 10 },
  { day: "04", visits: 48, signups: 17 },
  { day: "05", visits: 39, signups: 15 },
  { day: "06", visits: 57, signups: 21 },
  { day: "07", visits: 54, signups: 23 },
  { day: "08", visits: 72, signups: 30 },
  { day: "09", visits: 67, signups: 29 },
  { day: "10", visits: 91, signups: 38 },
  { day: "11", visits: 86, signups: 35 },
  { day: "12", visits: 108, signups: 45 },
];

type Row = { id: string; component: string; family: string; state: string };
const rows: Row[] = [
  { id: "01", component: "AreaChart", family: "Data", state: "Ready" },
  { id: "02", component: "DataGrid", family: "Data", state: "Ready" },
  { id: "03", component: "Spotlight", family: "Motion", state: "Ready" },
  { id: "04", component: "UIProvider", family: "Theme", state: "Ready" },
  { id: "05", component: "Reveal", family: "Motion", state: "Ready" },
];
const columns: DataTableColumn<Row>[] = [
  { id: "component", header: "Component", accessor: "component", sortable: true },
  { id: "family", header: "Family", accessor: "family", sortable: true },
  {
    id: "state",
    header: "Status",
    accessor: "state",
    cell: () => (
      <Badge variant="success" size="sm">
        Ready
      </Badge>
    ),
  },
];

export function LiveLab() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [view, setView] = useState<"chart" | "grid">("chart");
  const [playing, setPlaying] = useState(true);
  const selected = themes[themeIndex]!;

  return (
    <UIProvider
      target="scope"
      theme={{
        name: `lab-${selected.name.toLowerCase()}`,
        primary: selected.primary,
        neutral: selected.neutral,
        radius: "large",
      }}
      colorMode="dark"
      className={`lab-experience lab-theme-${themeIndex} ${playing ? "" : "scene-paused"}`}
    >
      <div className="lab-atmosphere lab-atmosphere-ion" aria-hidden />
      <div className="lab-atmosphere lab-atmosphere-cobalt" aria-hidden />
      <div className="lab-atmosphere lab-atmosphere-solar" aria-hidden />
      <Spotlight size={620} className="lab-field">
        <div className="lab-field-top">
          <span className="spec-label">LIVE CANVAS / {selected.name.toUpperCase()}</span>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-pressed={!playing}
            className="lab-pause"
          >
            {playing ? "Pause motion" : "Play motion"}
          </button>
        </div>
        <div className="lab-stage">
          <div className="lab-story">
            <span className="lab-index">01 / REAL COMPONENTS</span>
            <h3>
              Color changes.
              <br />
              <em>Everything responds.</em>
            </h3>
            <p>
              Select an atmosphere, inspect the chart, then sort the grid. Every control is running
              on UX-STING.
            </p>
            <fieldset className="lab-palette">
              <legend className="spec-label">Choose a color world</legend>
              <div className="lab-theme-options">
                {themes.map((theme, index) => (
                  <button
                    key={theme.name}
                    type="button"
                    aria-pressed={themeIndex === index}
                    onClick={() => setThemeIndex(index)}
                    className="lab-theme-button"
                  >
                    <span className={`lab-swatch lab-swatch-${index}`} aria-hidden />
                    {theme.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <Button
              asChild
              variant="outline"
              endIcon={<ArrowRightIcon aria-hidden className="rtl:rotate-180" />}
            >
              <a href="#inside">Explore the full system</a>
            </Button>
          </div>
          <div className="lab-workspace">
            <div className="lab-workspace-head">
              <div>
                <span className="spec-label">UX-STING / DATA</span>
                <strong>{view === "chart" ? "Performance in motion" : "A grid you can use"}</strong>
              </div>
              <div className="lab-view-switch" aria-label="Choose a component">
                {(["chart", "grid"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="lab-data">
              {view === "chart" ? (
                <AreaChart
                  data={traffic}
                  index="day"
                  label="Illustrative visits and signups across twelve days"
                  series={[
                    { key: "visits", label: "Visits", color: "var(--ui-primary)" },
                    { key: "signups", label: "Signups", color: "var(--ui-success)" },
                  ]}
                  height={235}
                />
              ) : (
                <DataGrid
                  label="UX-STING component examples"
                  data={rows}
                  columns={columns}
                  getRowId={(row) => row.id}
                  pageSize={false}
                  responsive="stack"
                />
              )}
            </div>
            <span className="lab-data-note">Illustrative data · actual library controls</span>
          </div>
        </div>
        <div className="lab-field-bottom">
          <span>REACT / TOKENS / MOTION / DATA</span>
          <span>MOVE YOUR POINTER ↗</span>
        </div>
      </Spotlight>
    </UIProvider>
  );
}
