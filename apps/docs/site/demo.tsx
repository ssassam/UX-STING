"use client";
import { MonitorIcon, MoonIcon, SmartphoneIcon, SunIcon, TabletIcon } from "@unified-ui/icons";
import { UIProvider, useColorMode } from "@unified-ui/react/provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unified-ui/react/tabs";
import { ToggleGroup, ToggleGroupItem } from "@unified-ui/react/toggle";
import { lazy, Suspense, useEffect, useMemo, useState, type ComponentType } from "react";
import { demoLoaders, demoOrder, type DemoModule } from "../demos/index";
import sources from "../demos/sources.json";
import { CodeBlock } from "./code-block";

const allSources = sources as Record<string, Record<string, string>>;
const widths = { mobile: "24rem", tablet: "48rem", desktop: "100%" } as const;

const moduleCache = new Map<string, Promise<DemoModule>>();
function loadModule(name: string) {
  if (!moduleCache.has(name)) moduleCache.set(name, demoLoaders[name]!());
  return moduleCache.get(name)!;
}

export const titleFromExport = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1 $2");

function DemoFrame({ component, example }: { component: string; example: string }) {
  const Example = useMemo(
    () => lazy(async () => ({ default: ((await loadModule(component))[example] ?? (() => null)) as ComponentType })),
    [component, example],
  );
  const { resolvedColorMode } = useColorMode();
  const siteMode = resolvedColorMode === "dark" ? "dark" : "light";
  const [mode, setMode] = useState<"light" | "dark">(siteMode);
  useEffect(() => setMode(siteMode), [siteMode]);
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [width, setWidth] = useState<keyof typeof widths>("desktop");
  const id = `${component}-${example}`.toLowerCase();

  return (
    <section aria-labelledby={id} className="grid grid-cols-[minmax(0,1fr)] gap-2">
      <h3 id={id} className="text-md font-semibold">{titleFromExport(example)}</h3>
      <Tabs defaultValue="preview" variant="enclosed" size="sm" className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList aria-label={`${titleFromExport(example)} view`}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-1">
            <ToggleGroup type="single" size="sm" value={mode} onValueChange={(v) => v && setMode(v as "light" | "dark")} aria-label="Color mode">
              <ToggleGroupItem value="light" aria-label="Light"><SunIcon /></ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark"><MoonIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" size="sm" value={dir} onValueChange={(v) => v && setDir(v as "ltr" | "rtl")} aria-label="Direction">
              <ToggleGroupItem value="ltr">LTR</ToggleGroupItem>
              <ToggleGroupItem value="rtl">RTL</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" size="sm" value={width} onValueChange={(v) => v && setWidth(v as keyof typeof widths)} aria-label="Viewport width" className="hidden md:inline-flex">
              <ToggleGroupItem value="mobile" aria-label="Mobile width"><SmartphoneIcon /></ToggleGroupItem>
              <ToggleGroupItem value="tablet" aria-label="Tablet width"><TabletIcon /></ToggleGroupItem>
              <ToggleGroupItem value="desktop" aria-label="Desktop width"><MonitorIcon /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <TabsContent value="preview">
          <UIProvider
            colorMode={mode}
            dir={dir}
            locale={dir === "rtl" ? "ar" : "en"}
            className="overflow-hidden rounded-xl border border-border"
          >
            <div className="mx-auto p-4 transition-[max-width] sm:p-8" style={{ maxWidth: widths[width] }}>
              <Suspense fallback={<div className="h-24 animate-pulse rounded-md bg-muted" aria-busy="true" />}>
                <Example />
              </Suspense>
            </div>
          </UIProvider>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={allSources[component]?.[example] ?? ""} language="tsx" className="my-0" />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function ComponentDemos({ name }: { name: string }) {
  const examples = demoOrder[name] ?? [];
  if (!examples.length) return <p className="text-sm text-muted-foreground">No examples yet.</p>;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10">
      {examples.map((example) => (
        <DemoFrame key={example} component={name} example={example} />
      ))}
    </div>
  );
}

export function FirstDemo({ name }: { name: string }) {
  const first = demoOrder[name]?.[0];
  return first ? <DemoFrame component={name} example={first} /> : null;
}
