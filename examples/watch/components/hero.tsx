"use client";
import {
  ArrowRightIcon,
  BatteryFullIcon,
  DropletsIcon,
  ActivityIcon,
  WatchIcon,
} from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Text } from "@ux-sting/react/typography";
import { useState } from "react";
import { finishes, WatchArt } from "./watch-art";

const stats = [
  { icon: <BatteryFullIcon />, value: "14 days", label: "battery life" },
  { icon: <DropletsIcon />, value: "5 ATM", label: "water resistant" },
  { icon: <ActivityIcon />, value: "40+", label: "sport modes" },
  { icon: <WatchIcon />, value: '1.4"', label: "AMOLED display" },
];

export function Hero() {
  const [finish, setFinish] = useState<(typeof finishes)[number]>(finishes[0]);
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_40%,var(--ui-primary-subtle),transparent)] opacity-80"
      />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:pb-24 md:pt-16">
        <div className="grid gap-6">
          <Badge variant="primary" className="w-fit">
            New · Pre-orders open
          </Badge>
          <h1
            id="hero-title"
            className="text-5xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl"
          >
            Two weeks of battery. <span className="text-primary">Zero compromises.</span>
          </h1>
          <Text size="lg" variant="muted" className="max-w-lg">
            Pulse One tracks your heart, sleep and every run with dual-band GPS — then keeps going
            for 14 days on a single charge.
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" endIcon={<ArrowRightIcon className="rtl:rotate-180" />}>
              <a href="#buy">Pre-order from €249</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#features">Explore features</a>
            </Button>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="grid gap-1">
                <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
                <dd className="order-1 flex items-center gap-1.5 text-xl font-semibold tabular-nums [&_svg]:size-4 [&_svg]:text-primary">
                  <span aria-hidden>{s.icon}</span>
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid justify-items-center gap-6">
          <WatchArt
            finish={finish}
            className="w-56 drop-shadow-2xl transition-transform duration-(--ui-duration-slow) sm:w-72 md:w-80"
          />
          <div role="radiogroup" aria-label="Finish" className="flex items-center gap-3">
            {finishes.map((f) => {
              const on = f.id === finish.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={f.name}
                  onClick={() => setFinish(f)}
                  className={`ui-hit-area flex size-9 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${on ? "border-foreground" : "border-transparent"}`}
                >
                  <span
                    className="size-7 rounded-full border border-border-strong"
                    style={{ background: f.caseColor }}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {finish.name}
          </p>
        </div>
      </div>
    </section>
  );
}
