"use client";

import { ArrowRightIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { AreaChart } from "@ux-sting/react/chart";
import { DataGrid, type DataTableColumn } from "@ux-sting/react/data-table";
import { UIProvider } from "@ux-sting/react/provider";
import { Spotlight, Tilt } from "@ux-sting/react/spotlight";
import { useState } from "react";

const themes = [
  { name: "Signal", primary: "amber", neutral: "gray" },
  { name: "Electric", primary: "violet", neutral: "slate" },
  { name: "Current", primary: "sky", neutral: "slate" },
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
  { id: "state", header: "Status", accessor: "state", cell: () => <Badge variant="success" size="sm">Ready</Badge> },
];

export function LiveLab() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [view, setView] = useState<"chart" | "grid">("chart");
  const [playing, setPlaying] = useState(true);
  const selected = themes[themeIndex]!;

  return (
    <div className="lab-shell grid gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-10">
      <div className="grid content-between gap-8 p-6 sm:p-9 lg:p-12">
        <div className="grid content-start gap-6">
          <span className="spec-label text-primary">01 / The live system</span>
          <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Change the signal. The whole interface follows.
          </h3>
          <p className="max-w-md text-muted-foreground">
            These are real UX-STING components. Switch the theme, inspect the chart, then sort the grid. No screenshot is doing the work.
          </p>
          <fieldset className="grid gap-3">
            <legend className="spec-label mb-3 text-muted-foreground">Accent preset</legend>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme, index) => (
                <button
                  key={theme.name}
                  type="button"
                  aria-pressed={themeIndex === index}
                  onClick={() => setThemeIndex(index)}
                  className="lab-theme-button rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className={`lab-swatch lab-swatch-${index}`} aria-hidden />
                  {theme.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="grid gap-4">
          <span className="spec-label text-muted-foreground">React · tokens · motion · data</span>
          <Button asChild variant="outline" endIcon={<ArrowRightIcon aria-hidden className="rtl:rotate-180" />}>
            <a href="#inside">Explore the full system</a>
          </Button>
        </div>
      </div>

      <UIProvider
        target="scope"
        theme={{ name: `lab-${selected.name.toLowerCase()}`, primary: selected.primary, neutral: selected.neutral, radius: "medium" }}
        colorMode="dark"
        className="lab-preview relative min-w-0 overflow-hidden border-t border-border p-4 sm:p-6 lg:border-s lg:border-t-0"
      >
        <div className="lab-preview-grid" aria-hidden />
        <div className="relative z-10 grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="spec-label text-muted-foreground">Live canvas / {selected.name}</span>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-pressed={!playing}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {playing ? "Pause motion" : "Play motion"}
            </button>
          </div>

          <Spotlight size={420} className={`lab-orbit relative flex min-h-48 items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:min-h-60 ${playing ? "" : "lab-paused"}`}>
            <div className="lab-orbit-ring lab-orbit-ring-outer" aria-hidden />
            <div className="lab-orbit-ring lab-orbit-ring-inner" aria-hidden />
            <div className="lab-orbit-line" aria-hidden />
            <Tilt max={5} className="relative z-10">
              <div className="lab-core flex size-28 flex-col items-center justify-center rounded-2xl border border-primary/70 bg-background/90 text-center shadow-2xl shadow-primary/20 sm:size-36">
                <span className="spec-label text-primary">UX</span>
                <strong className="text-3xl tracking-[-0.09em] sm:text-4xl">STING</strong>
                <span className="spec-label text-muted-foreground">system / active</span>
              </div>
            </Tilt>
            <span className="lab-orbit-note spec-label absolute bottom-3 left-4 text-muted-foreground">Pointer reactive</span>
            <span className="lab-orbit-note spec-label absolute right-4 top-3 text-primary">● Live</span>
          </Spotlight>

          <div className="rounded-lg border border-border bg-card/95 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-1">
                <span className="spec-label text-muted-foreground">Component laboratory</span>
                <strong className="text-lg">{view === "chart" ? "Chart / hover a point" : "Grid / sort a column"}</strong>
              </div>
              <div className="flex rounded-md border border-border p-1" aria-label="Choose a component">
                {(["chart", "grid"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                    className="rounded px-3 py-1.5 text-xs font-semibold capitalize aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >{item}</button>
                ))}
              </div>
            </div>
            <div className="min-h-64 min-w-0">
              {view === "chart" ? (
                <AreaChart
                  data={traffic}
                  index="day"
                  label="Illustrative visits and signups across twelve days"
                  series={[{ key: "visits", label: "Visits", color: "var(--ui-primary)" }, { key: "signups", label: "Signups", color: "var(--ui-success)" }]}
                  height={215}
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
          </div>
          <p className="text-xs text-muted-foreground">Illustrative chart data · actual library controls</p>
        </div>
      </UIProvider>
    </div>
  );
}
