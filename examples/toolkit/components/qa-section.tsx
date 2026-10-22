"use client";
import { useNumberPop, useReorder, useTabIndicator } from "@ux-sting/motion/react";
import { Badge } from "@ux-sting/react/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { useRef, useState } from "react";
import { withBase } from "../lib/base";
import { qaRuns, type Finding, type QaRun } from "../lib/data";
import { Command } from "./command";
import { CreditedFigure } from "./figure";
import { Section } from "./section";

const SEVERITY = { critical: 0, serious: 1, moderate: 2, minor: 3 } as const;
const tone = {
  critical: "destructive",
  serious: "warning",
  moderate: "info",
  minor: "outline",
} as const;

type SortKey = "severity" | "category" | "breadth";
const sorters: Record<SortKey, (a: Finding, b: Finding) => number> = {
  severity: (a, b) => SEVERITY[a.severity] - SEVERITY[b.severity],
  category: (a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
  breadth: (a, b) => b.viewports.length - a.viewports.length,
};

function Report({ run }: { run: QaRun }) {
  const [sort, setSort] = useState<SortKey>("severity");
  const list = useRef<HTMLOListElement>(null);
  const score = useRef<HTMLSpanElement>(null);
  const reorder = useReorder(list, { key: "data-key" });
  useNumberPop(score, run.score);
  const findings = [...run.findings].sort(sorters[sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid min-w-0 content-start gap-5">
        <Command>{run.command}</Command>
        <p className="text-muted-foreground">{run.note}</p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="font-display text-5xl tabular-nums">
            <span ref={score} className="us-number-pop">
              {run.score}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <Badge variant={run.passed ? "success" : "destructive"} size="lg">
            {run.passed ? "Passed" : "Failed"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {run.findings.length} finding{run.findings.length === 1 ? "" : "s"}
          </p>
        </div>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Sort findings</legend>
          <span aria-hidden="true" className="me-1 text-sm text-muted-foreground">
            Sort by
          </span>
          {(Object.keys(sorters) as SortKey[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={sort === k}
              onClick={() => reorder(() => setSort(k))}
              className="rounded-sm border border-border px-3 py-1 text-sm aria-pressed:border-primary aria-pressed:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {k}
            </button>
          ))}
        </fieldset>

        <ol ref={list} className="us-reorder ledger border-y border-border" aria-live="polite">
          {findings.map((f) => (
            <li
              key={f.id}
              data-key={f.id}
              className="us-reorder-item grid gap-1 bg-background py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
            >
              <span>
                <Badge variant={tone[f.severity]} size="sm">
                  {f.severity}
                </Badge>
              </span>
              <span className="grid min-w-0 gap-0.5">
                <span className="font-mono text-sm break-words">{f.id}</span>
                <span className="text-sm text-muted-foreground">{f.message}</span>
                {f.viewports.length ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    @ {f.viewports.join(" · ")}px
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figure className="grid content-start gap-2">
        {/* Plain img: real QA screenshot */}
        <img
          src={withBase(run.shot)}
          alt={`Screenshot QA took of the ${run.label.toLowerCase()} page.`}
          className="h-auto max-h-[48rem] w-full rounded-sm border border-border object-contain object-top"
          loading="lazy"
        />
        <figcaption className="text-xs text-muted-foreground">
          {run.shot.includes("full")
            ? "Full-page screenshot from the QA run at 375px: the page is 1600px wide."
            : "First-screen screenshot from the QA run at 1440px."}
        </figcaption>
      </figure>
    </div>
  );
}

export function QaSection() {
  const tablist = useRef<HTMLDivElement>(null);
  useTabIndicator(tablist);
  return (
    <Section
      id="qa"
      number="01"
      kicker="Browser QA"
      title="It looks at the page, the way a reviewer would."
      intro={
        <>
          <p>
            Agents usually stop at &ldquo;it compiles&rdquo;. <code>ux-sting qa</code> opens the
            page in a real browser at three widths and writes a short report with the three fixes to
            make first. The <code>ux-sting-qa</code> skill then fixes them and runs QA again, up to
            three rounds.
          </p>
        </>
      }
    >
      <div className="grid gap-10">
        <CreditedFigure
          file="measured-drawing-of-a-horse-facing-left-recto-ca-1480-88.jpg"
          alt="Verrocchio's pen drawing of a standing horse, its body divided by ruled lines annotated with handwritten measurements."
          className="max-w-xl"
        />
        <Tabs defaultValue="broken">
          <TabsList ref={tablist} className="us-tabs" aria-label="QA runs">
            {qaRuns.map((r) => (
              <TabsTrigger
                key={r.key}
                value={r.key}
                className="data-[state=active]:border-transparent"
              >
                {r.label}
              </TabsTrigger>
            ))}
            <span className="us-tab-indicator" aria-hidden="true" />
          </TabsList>
          {qaRuns.map((r) => (
            <TabsContent key={r.key} value={r.key} className="pt-6">
              <Report run={r} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
  );
}
