import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@unified-ui/react/accordion";
import { Alert, AlertDescription, AlertTitle } from "@unified-ui/react/alert";
import { Avatar } from "@unified-ui/react/avatar";
import { Badge } from "@unified-ui/react/badge";
import { Button } from "@unified-ui/react/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@unified-ui/react/card";
import { Checkbox } from "@unified-ui/react/checkbox";
import { Field } from "@unified-ui/react/field";
import { Input } from "@unified-ui/react/input";
import { Pagination } from "@unified-ui/react/pagination";
import { Progress } from "@unified-ui/react/progress";
import { Slider } from "@unified-ui/react/slider";
import { Spinner } from "@unified-ui/react/spinner";
import { EmptyState } from "@unified-ui/react/state";
import { Stepper } from "@unified-ui/react/stepper";
import { Switch } from "@unified-ui/react/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unified-ui/react/tabs";
import { Chip, Tag } from "@unified-ui/react/tag";
import { Toggle } from "@unified-ui/react/toggle";
import { ArrowRightIcon, BoldIcon, PlusIcon } from "@unified-ui/icons";
import type { ReactNode } from "react";

export type Control =
  | { prop: string; type: "select"; options: string[]; default: string }
  | { prop: string; type: "boolean"; default: boolean }
  | { prop: string; type: "number"; min: number; max: number; step?: number; default: number }
  | { prop: string; type: "text"; default: string };

export interface Lab {
  name: string;
  controls: Control[];
  render: (p: Record<string, unknown>) => ReactNode;
}

const s = (v: unknown) => v as string;
const b = (v: unknown) => Boolean(v);
const n = (v: unknown) => Number(v);

export const labs: Lab[] = [
  {
    name: "Button",
    controls: [
      { prop: "variant", type: "select", options: ["default", "secondary", "outline", "ghost", "link", "destructive", "success", "warning"], default: "default" },
      { prop: "size", type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "md" },
      { prop: "label", type: "text", default: "Save changes" },
      { prop: "loading", type: "boolean", default: false },
      { prop: "disabled", type: "boolean", default: false },
      { prop: "active", type: "boolean", default: false },
      { prop: "startIcon", type: "boolean", default: false },
      { prop: "endIcon", type: "boolean", default: false },
      { prop: "fullWidth", type: "boolean", default: false },
    ],
    render: (p) => (
      <Button
        variant={s(p.variant) as never}
        size={s(p.size) as never}
        loading={b(p.loading)}
        disabled={b(p.disabled)}
        active={b(p.active)}
        fullWidth={b(p.fullWidth)}
        startIcon={p.startIcon ? <PlusIcon /> : undefined}
        endIcon={p.endIcon ? <ArrowRightIcon className="rtl:rotate-180" /> : undefined}
      >
        {s(p.label)}
      </Button>
    ),
  },
  {
    name: "Badge",
    controls: [
      { prop: "variant", type: "select", options: ["default", "secondary", "outline", "primary", "success", "warning", "destructive", "info"], default: "success" },
      { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "dot", type: "boolean", default: true },
      { prop: "label", type: "text", default: "Open now" },
    ],
    render: (p) => (
      <Badge variant={s(p.variant) as never} size={s(p.size) as never} dot={b(p.dot)}>
        {s(p.label)}
      </Badge>
    ),
  },
  {
    name: "Alert",
    controls: [
      { prop: "variant", type: "select", options: ["default", "info", "success", "warning", "destructive"], default: "info" },
      { prop: "title", type: "text", default: "Heads up" },
      { prop: "description", type: "text", default: "Your listing will be reviewed within 24 hours." },
    ],
    render: (p) => (
      <Alert variant={s(p.variant) as never} className="max-w-lg">
        <AlertTitle>{s(p.title)}</AlertTitle>
        <AlertDescription>{s(p.description)}</AlertDescription>
      </Alert>
    ),
  },
  {
    name: "Input",
    controls: [
      { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "variant", type: "select", options: ["default", "filled"], default: "default" },
      { prop: "label", type: "text", default: "Email" },
      { prop: "description", type: "text", default: "We never share it." },
      { prop: "error", type: "text", default: "" },
      { prop: "required", type: "boolean", default: true },
      { prop: "disabled", type: "boolean", default: false },
    ],
    render: (p) => (
      <Field label={s(p.label)} description={s(p.description) || undefined} error={s(p.error) || undefined} required={b(p.required)} disabled={b(p.disabled)} className="w-full max-w-sm">
        <Input size={s(p.size) as never} variant={s(p.variant) as never} type="email" placeholder="you@example.com" />
      </Field>
    ),
  },
  {
    name: "Card",
    controls: [
      { prop: "variant", type: "select", options: ["default", "elevated", "filled", "ghost"], default: "default" },
      { prop: "interactive", type: "boolean", default: false },
    ],
    render: (p) => (
      <Card variant={s(p.variant) as never} interactive={b(p.interactive)} className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Monthly revenue</CardTitle>
          <CardDescription>March 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">€48,210</p>
        </CardContent>
        <CardFooter>
          <Badge variant="success">+12.4%</Badge>
        </CardFooter>
      </Card>
    ),
  },
  {
    name: "Tabs",
    controls: [
      { prop: "variant", type: "select", options: ["line", "pills", "enclosed"], default: "line" },
      { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "orientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    ],
    render: (p) => (
      <Tabs defaultValue="a" variant={s(p.variant) as never} size={s(p.size) as never} orientation={s(p.orientation) as never}>
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">Overview</TabsTrigger>
          <TabsTrigger value="b">Reviews</TabsTrigger>
          <TabsTrigger value="c">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="text-sm">Overview panel</TabsContent>
        <TabsContent value="b" className="text-sm">Reviews panel</TabsContent>
        <TabsContent value="c" className="text-sm">Photos panel</TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Progress",
    controls: [
      { prop: "value", type: "number", min: 0, max: 100, default: 60 },
      { prop: "indeterminate", type: "boolean", default: false },
      { prop: "variant", type: "select", options: ["default", "success", "warning", "destructive", "info"], default: "default" },
      { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "md" },
    ],
    render: (p) => (
      <Progress className="w-full max-w-md" value={p.indeterminate ? null : n(p.value)} variant={s(p.variant) as never} size={s(p.size) as never} label="Upload" showValue id="lab-progress" />
    ),
  },
  {
    name: "Avatar",
    controls: [
      { prop: "size", type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "lg" },
      { prop: "shape", type: "select", options: ["circle", "square"], default: "circle" },
      { prop: "status", type: "select", options: ["none", "online", "offline", "busy", "away"], default: "online" },
      { prop: "image", type: "boolean", default: false },
    ],
    render: (p) => (
      <Avatar
        name="Yasmine Benali"
        size={s(p.size) as never}
        shape={s(p.shape) as never}
        status={p.status === "none" ? undefined : (s(p.status) as never)}
        src={p.image ? "https://i.pravatar.cc/160?img=47" : undefined}
      />
    ),
  },
  {
    name: "Tag & Chip",
    controls: [
      { prop: "variant", type: "select", options: ["default", "primary", "success", "warning", "destructive", "info", "outline"], default: "primary" },
      { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "removable", type: "boolean", default: true },
      { prop: "selected", type: "boolean", default: true },
    ],
    render: (p) => (
      <div className="flex flex-wrap items-center gap-3">
        <Tag variant={s(p.variant) as never} size={s(p.size) as never} onRemove={p.removable ? () => {} : undefined}>
          Vegan
        </Tag>
        <Chip selected={b(p.selected)} size={s(p.size) as never}>Open now</Chip>
      </div>
    ),
  },
  {
    name: "Form controls",
    controls: [
      { prop: "switchSize", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "checked", type: "boolean", default: true },
      { prop: "disabled", type: "boolean", default: false },
      { prop: "slider", type: "number", min: 0, max: 100, default: 40 },
    ],
    render: (p) => (
      <div className="grid w-full max-w-sm gap-4">
        <Switch label="Notifications" size={s(p.switchSize) as never} checked={b(p.checked)} disabled={b(p.disabled)} />
        <Checkbox label="Accept terms" checked={b(p.checked)} disabled={b(p.disabled)} />
        <Slider aria-label="Distance" value={[n(p.slider)]} disabled={b(p.disabled)} showValue formatValue={(v) => `${v} km`} />
        <Toggle aria-label="Bold" pressed={b(p.checked)} disabled={b(p.disabled)}>
          <BoldIcon />
        </Toggle>
      </div>
    ),
  },
  {
    name: "Accordion",
    controls: [{ prop: "variant", type: "select", options: ["default", "separated", "bordered"], default: "separated" }],
    render: (p) => (
      <Accordion type="single" collapsible defaultValue="1" variant={s(p.variant) as never} className="w-full max-w-md">
        <AccordionItem value="1">
          <AccordionTrigger>Is parking available?</AccordionTrigger>
          <AccordionContent>Yes, free parking behind the building.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Do you take reservations?</AccordionTrigger>
          <AccordionContent>Recommended on weekends.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Navigation",
    controls: [
      { prop: "pages", type: "number", min: 1, max: 50, default: 20 },
      { prop: "paginationVariant", type: "select", options: ["default", "compact"], default: "default" },
      { prop: "step", type: "number", min: 0, max: 3, default: 1 },
      { prop: "stepperOrientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    ],
    render: (p) => (
      <div className="grid w-full gap-8">
        <Pagination totalPages={n(p.pages)} defaultPage={Math.min(5, n(p.pages))} variant={s(p.paginationVariant) as never} />
        <Stepper current={n(p.step)} orientation={s(p.stepperOrientation) as never} steps={[{ title: "Details" }, { title: "Location" }, { title: "Photos" }, { title: "Review" }]} />
      </div>
    ),
  },
  {
    name: "Feedback states",
    controls: [
      { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { prop: "spinner", type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "lg" },
    ],
    render: (p) => (
      <div className="grid w-full gap-6">
        <EmptyState size={s(p.size) as never} title="No saved places" description="Tap the heart on any place to save it." actions={<Button size="sm">Explore</Button>} />
        <div className="flex justify-center text-primary">
          <Spinner size={s(p.spinner) as never} />
        </div>
      </div>
    ),
  },
];
