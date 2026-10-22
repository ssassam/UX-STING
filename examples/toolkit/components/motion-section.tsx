"use client";
import { useAnimateSize } from "@ux-sting/motion/react";
import { useFlipLayout } from "@ux-sting/motion/gsap";
import { Button } from "@ux-sting/react/button";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBase } from "../lib/base";
import { Section } from "./section";

function Bench({ title, file, children }: { title: string; file: string; children: ReactNode }) {
  return (
    <article className="grid content-start gap-4 border-t border-border pt-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl">{title}</h3>
        <code className="text-xs text-muted-foreground">{file}</code>
      </header>
      {children}
    </article>
  );
}

function CardResize() {
  const card = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const run = useAnimateSize(card);
  return (
    <Bench title="Card resize" file="animateSize()">
      <div ref={card} className="grid gap-2 rounded-sm border border-border bg-surface p-4">
        <p className="font-medium">Order 4821 · shipped</p>
        <p className="text-sm text-muted-foreground">Arriving Friday.</p>
        {open ? (
          <p className="text-sm text-muted-foreground">
            Carrier PostNL, tracking 3SABC123456. Signature required; leave-at-door is off for this
            order.
          </p>
        ) : null}
      </div>
      <Button
        variant="outline"
        size="sm"
        aria-expanded={open}
        onClick={() => run(() => setOpen((o) => !o))}
      >
        {open ? "Hide details" : "Show details"}
      </Button>
    </Bench>
  );
}

const NOTES = [
  "Report written to ux-sting-qa/",
  "Top fix: images must have alternative text",
  "Page scrolls sideways by 1225px",
  "1 console error: boom from fixture",
];
function NotificationStack() {
  const [items, setItems] = useState<Array<{ id: number; text: string }>>([
    { id: 1, text: NOTES[0]! },
  ]);
  const add = () =>
    setItems((xs) => [
      ...xs.slice(-3),
      { id: (xs.at(-1)?.id ?? 0) + 1, text: NOTES[(xs.at(-1)?.id ?? 0) % NOTES.length]! },
    ]);
  return (
    <Bench title="Notification stack" file="notification-stack.css">
      <ol className="us-stack min-h-24" aria-label="Notifications">
        {items.map((n) => (
          <li
            key={n.id}
            tabIndex={0}
            className="us-stack-item rounded-sm border border-border bg-surface px-4 py-3 text-sm"
          >
            {n.text}
          </li>
        ))}
      </ol>
      <Button variant="outline" size="sm" onClick={add}>
        Add notification
      </Button>
    </Bench>
  );
}

function Accordion() {
  return (
    <Bench title="Accordion" file="accordion.css">
      <div className="grid gap-2">
        <details className="us-accordion rounded-sm border border-border bg-surface px-4 py-3">
          <summary className="cursor-pointer font-medium">Does it need JavaScript?</summary>
          <p className="pt-2 text-sm text-muted-foreground">
            No. Native details opens to its natural height with ::details-content.
          </p>
        </details>
        <details className="us-accordion rounded-sm border border-border bg-surface px-4 py-3">
          <summary className="cursor-pointer font-medium">And with reduced motion?</summary>
          <p className="pt-2 text-sm text-muted-foreground">It opens at once.</p>
        </details>
      </div>
    </Bench>
  );
}

function PopoverToast() {
  const toast = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    const el = toast.current;
    if (!el) return;
    if (!el.matches(":popover-open")) el.showPopover();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => el.hidePopover(), 3500);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Bench title="Toast" file="toast.css">
      <p className="text-sm text-muted-foreground">
        Popover API, top layer, exits faster than it enters.
      </p>
      <Button variant="outline" size="sm" onClick={show}>
        Save changes
      </Button>
      <div
        ref={toast}
        popover="manual"
        role="status"
        className="us-toast rounded-sm border border-border bg-surface px-4 py-3 text-sm shadow-lg"
      >
        Changes saved
      </div>
    </Bench>
  );
}

function SkeletonSwap() {
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => setBusy(false), 1600);
    return () => clearTimeout(t);
  }, [busy]);
  return (
    <Bench title="Skeleton → content" file="skeleton.css">
      <div
        className="us-swap rounded-sm border border-border bg-surface p-4"
        aria-busy={busy}
        aria-live="polite"
      >
        <div className="us-swap-skeleton grid gap-2" aria-hidden="true">
          <span className="us-skeleton block h-5 w-1/2" />
          <span className="us-skeleton block h-4 w-11/12" />
          <span className="us-skeleton block h-4 w-3/4" />
        </div>
        <div className="us-swap-content grid gap-1">
          <p className="font-medium">Planted-bugs report</p>
          <p className="text-sm text-muted-foreground">
            Score 57/100, ten findings. Top fix: give the image alternative text.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setBusy(true)} disabled={busy}>
        Reload
      </Button>
    </Bench>
  );
}

const INSTRUMENTS = [
  { id: "qa", label: "qa", kind: "check" },
  { id: "extract", label: "extract", kind: "measure" },
  { id: "theme", label: "theme import", kind: "measure" },
  { id: "dna", label: "dna", kind: "measure" },
  { id: "images", label: "images", kind: "source" },
  { id: "taste", label: "taste", kind: "direct" },
  { id: "motion", label: "motion", kind: "build" },
  { id: "review", label: "review", kind: "check" },
] as const;
const KINDS = ["all", "measure", "check", "source", "direct", "build"] as const;

function FlipFilter() {
  const scope = useRef<HTMLUListElement>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const { capture } = useFlipLayout(scope, { absolute: false });
  const shown = INSTRUMENTS.filter((i) => kind === "all" || i.kind === kind);
  return (
    <Bench title="Flip layout (GSAP)" file="useFlipLayout()">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Filter instruments</legend>
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => {
              capture();
              setKind(k);
            }}
            className="rounded-sm border border-border px-3 py-1 text-sm aria-pressed:border-primary aria-pressed:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {k}
          </button>
        ))}
      </fieldset>
      <ul ref={scope} className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
        {shown.map((i) => (
          <li
            key={i.id}
            data-flip-id={i.id}
            className="rounded-sm border border-border bg-surface px-3 py-2 font-mono text-sm"
          >
            {i.label}
          </li>
        ))}
      </ul>
    </Bench>
  );
}

const PAGES = [
  ["card-resize", "Card resize"],
  ["number-pop", "Number pop-in"],
  ["notification-stack", "Notification stack"],
  ["list-reorder", "List reorder"],
  ["accordion", "Accordion"],
  ["tab-indicator", "Tab indicator"],
  ["toast", "Toast"],
  ["skeleton", "Skeleton → content"],
] as const;

export function MotionSection() {
  return (
    <Section
      id="motion"
      number="05"
      kicker="Motion"
      title="Motion that explains a change, and stops when asked."
      intro={
        <p>
          Eight transitions in plain CSS on UX-STING tokens, with tiny helpers. You have already
          used three: the QA tabs slide their indicator, the score pops, and sorting the findings
          reorders them with the View Transitions API. The GSAP layer drives the split headline at
          the top, the scrubbed pipeline above and the filter below. Turn on &ldquo;reduce
          motion&rdquo; in your system settings and all of it holds still.
        </p>
      }
    >
      <div className="grid gap-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <CardResize />
          <NotificationStack />
          <Accordion />
          <PopoverToast />
          <SkeletonSwap />
          <FlipFilter />
        </div>
        <div className="grid gap-3">
          <h3 className="font-display text-2xl">Standalone demo pages</h3>
          <p className="text-muted-foreground">
            Each transition also has a plain HTML page with no framework and an LTR/RTL switch.
          </p>
          <ul className="flex flex-wrap gap-2">
            {PAGES.map(([file, label]) => (
              <li key={file}>
                <a
                  href={withBase(`/motion/demos/${file}.html`)}
                  className="inline-block rounded-sm border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
