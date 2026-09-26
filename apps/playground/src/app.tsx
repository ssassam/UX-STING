import { demoLoaders, demoOrder, type DemoModule } from "@demos/index";
import { MonitorIcon, SmartphoneIcon, TabletIcon } from "@unified-ui/icons";
import { Badge } from "@unified-ui/react/badge";
import { Field } from "@unified-ui/react/field";
import { Input } from "@unified-ui/react/input";
import { NativeSelect } from "@unified-ui/react/native-select";
import { UIProvider } from "@unified-ui/react/provider";
import { SearchInput } from "@unified-ui/react/search-input";
import { Slider } from "@unified-ui/react/slider";
import { Switch } from "@unified-ui/react/switch";
import { Toaster } from "@unified-ui/react/toast";
import { ToggleGroup, ToggleGroupItem } from "@unified-ui/react/toggle";
import { TooltipProvider } from "@unified-ui/react/tooltip";
import { cn } from "@unified-ui/utils";
import { lazy, Suspense, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import { labs, type Control } from "./labs";

type Density = "compact" | "comfortable" | "spacious";
const widths = { mobile: 375, tablet: 768, desktop: 1280, full: 0 } as const;

function useHashState(initial: string) {
  const [value, setValue] = useState(
    () => decodeURIComponent(window.location.hash.slice(1)) || initial,
  );
  return [
    value,
    (v: string) => {
      setValue(v);
      window.history.replaceState(null, "", `#${encodeURIComponent(v)}`);
    },
  ] as const;
}

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (control.type) {
    case "select":
      return (
        <Field label={control.prop}>
          <NativeSelect size="sm" value={String(value)} onChange={(e) => onChange(e.target.value)}>
            {control.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </NativeSelect>
        </Field>
      );
    case "boolean":
      return (
        <Switch
          size="sm"
          label={control.prop}
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      );
    case "number":
      return (
        <Field label={`${control.prop}: ${value}`}>
          <Slider
            aria-label={control.prop}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={[Number(value)]}
            onValueChange={([v]) => onChange(v)}
          />
        </Field>
      );
    case "text":
      return (
        <Field label={control.prop}>
          <Input size="sm" value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
  }
}

const cache = new Map<string, Promise<DemoModule>>();
function DemoGallery({ name }: { name: string }) {
  const examples = demoOrder[name] ?? [];
  return (
    <div className="grid gap-10">
      {examples.map((ex) => (
        <DemoExample key={ex} name={name} example={ex} />
      ))}
    </div>
  );
}
function DemoExample({ name, example }: { name: string; example: string }) {
  const Comp = useMemo(
    () =>
      lazy(async () => {
        if (!cache.has(name)) cache.set(name, demoLoaders[name]!());
        return { default: ((await cache.get(name)!)[example] ?? (() => null)) as ComponentType };
      }),
    [name, example],
  );
  return (
    <section aria-label={example} className="grid gap-3">
      <h3 className="text-sm font-semibold text-muted-foreground">
        {example.replace(/([a-z])([A-Z])/g, "$1 $2")}
      </h3>
      <Suspense fallback={<div className="h-20 animate-pulse rounded-md bg-muted" />}>
        <Comp />
      </Suspense>
    </section>
  );
}

export function App() {
  const [selection, setSelection] = useHashState("lab:Button");
  const [theme, setTheme] = useState("default");
  const [mode, setMode] = useState<"light" | "dark" | "high-contrast">("light");
  const [density, setDensity] = useState<Density>("comfortable");
  const [locale, setLocale] = useState("en");
  const [width, setWidth] = useState<keyof typeof widths>("full");
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(10);
  const [labProps, setLabProps] = useState<Record<string, Record<string, unknown>>>({});

  const [kind, key] = selection.split(":") as ["lab" | "demo", string];
  const lab = kind === "lab" ? labs.find((l) => l.name === key) : undefined;
  const props = lab
    ? { ...Object.fromEntries(lab.controls.map((c) => [c.prop, c.default])), ...labProps[lab.name] }
    : {};
  const demoNames = Object.keys(demoOrder).filter((d) => d.includes(query.toLowerCase()));

  return (
    <UIProvider
      theme={theme}
      colorMode={mode}
      density={density}
      locale={locale}
      target="document"
      className="min-h-dvh"
    >
      <TooltipProvider>
        <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-surface">
          <header className="flex flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-3">
            <h1 className="me-auto text-md font-semibold">unified-ui lab</h1>
            <NativeSelect
              size="sm"
              aria-label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-36"
            >
              {["default", "neutral", "modern", "compact", "soft", "high-contrast"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </NativeSelect>
            <NativeSelect
              size="sm"
              aria-label="Color mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              className="w-36"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="high-contrast">High contrast</option>
            </NativeSelect>
            <NativeSelect
              size="sm"
              aria-label="Density"
              value={density}
              onChange={(e) => setDensity(e.target.value as Density)}
              className="w-36"
            >
              <option>compact</option>
              <option>comfortable</option>
              <option>spacious</option>
            </NativeSelect>
            <NativeSelect
              size="sm"
              aria-label="Language and direction"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-36"
            >
              <option value="en">English (LTR)</option>
              <option value="fr">Français (LTR)</option>
              <option value="ar">العربية (RTL)</option>
            </NativeSelect>
            <ToggleGroup
              type="single"
              size="sm"
              value={width}
              onValueChange={(v) => v && setWidth(v as keyof typeof widths)}
              aria-label="Viewport"
            >
              <ToggleGroupItem value="mobile" aria-label="Mobile 375px">
                <SmartphoneIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="tablet" aria-label="Tablet 768px">
                <TabletIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="desktop" aria-label="Desktop 1280px">
                <MonitorIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="full">Full</ToggleGroupItem>
            </ToggleGroup>
          </header>
          <div className="grid min-h-0 md:grid-cols-[16rem_1fr_18rem]">
            <nav
              aria-label="Components"
              className="grid content-start gap-4 overflow-y-auto border-e border-border bg-background p-3 md:max-h-[calc(100dvh-4rem)]"
            >
              <div>
                <p className="px-2 pb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Labs (knobs)
                </p>
                {labs.map((l) => (
                  <button
                    key={l.name}
                    type="button"
                    aria-current={selection === `lab:${l.name}` ? "page" : undefined}
                    onClick={() => setSelection(`lab:${l.name}`)}
                    className="block w-full rounded-md px-2 py-1.5 text-start text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-primary-subtle aria-[current=page]:text-primary-subtle-foreground"
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <div className="grid gap-2">
                <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                  All examples{" "}
                  <Badge size="sm" variant="secondary">
                    {Object.keys(demoOrder).length}
                  </Badge>
                </p>
                <SearchInput
                  size="sm"
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Filter components"
                  aria-label="Filter components"
                />
                <div>
                  {demoNames.map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-current={selection === `demo:${d}` ? "page" : undefined}
                      onClick={() => setSelection(`demo:${d}`)}
                      className="block w-full rounded-md px-2 py-1 text-start text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-primary-subtle aria-[current=page]:text-primary-subtle-foreground"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
            <main
              data-ui-scope=""
              className="min-w-0 overflow-auto p-4 sm:p-8"
              style={{ "--ui-radius": `${radius / 16}rem` } as CSSProperties}
            >
              <div
                className={cn(
                  "mx-auto rounded-xl border border-border bg-background p-6 shadow-sm transition-[max-width]",
                )}
                style={{ maxWidth: widths[width] || undefined }}
              >
                <div className="flex min-h-48 flex-col items-center justify-center gap-4">
                  {lab ? (
                    lab.render(props)
                  ) : (
                    <div className="w-full">
                      <DemoGallery name={key} />
                    </div>
                  )}
                </div>
              </div>
            </main>
            <aside
              aria-label="Controls"
              className="grid content-start gap-4 border-s border-border bg-background p-4"
            >
              <Field label={`Base radius: ${radius}px`}>
                <Slider
                  aria-label="Base radius"
                  min={0}
                  max={20}
                  value={[radius]}
                  onValueChange={([v]) => setRadius(v ?? 10)}
                />
              </Field>
              {lab ? (
                <>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {lab.name} props
                  </p>
                  {lab.controls.map((c) => (
                    <ControlInput
                      key={c.prop}
                      control={c}
                      value={props[c.prop]}
                      onChange={(v) =>
                        setLabProps((prev) => ({
                          ...prev,
                          [lab.name]: { ...prev[lab.name], [c.prop]: v },
                        }))
                      }
                    />
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Examples are identical to the docs. Use the header to switch theme, mode, density,
                  direction and viewport.
                </p>
              )}
            </aside>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </UIProvider>
  );
}
