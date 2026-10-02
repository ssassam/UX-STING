import { ArrowRightIcon, ClockIcon, FlameIcon, UsersIcon, UtensilsIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent } from "@ux-sting/react/card";
import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";

const stats = [
  { icon: <UtensilsIcon />, value: "9", label: "courses" },
  { icon: <UsersIcon />, value: "16", label: "seats" },
  { icon: <ClockIcon />, value: "1", label: "seating / night" },
  { icon: <FlameIcon />, value: "4.9", label: "average rating" },
];

const preview = [
  "Cured mackerel, dill oil, cucumber",
  "Heritage tomato, burrata, basil seed oil",
  "North Sea turbot, brown shrimp, sea aster",
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_40%,var(--ui-primary-subtle),transparent)] opacity-80"
      />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:pb-24 md:pt-16">
        <div className="grid gap-6">
          <Badge variant="primary" className="w-fit">
            Seasonal tasting menu · Ghent
          </Badge>
          <h1
            id="hero-title"
            className="text-5xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl"
          >
            A nine-course story, <span className="text-primary">one table a night.</span>
          </h1>
          <Text size="lg" variant="muted" className="max-w-lg">
            Ember builds its tasting menu each morning around what the North Sea and nearby
            Flemish farms bring in — one seating, sixteen seats, every evening.
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" endIcon={<ArrowRightIcon className="rtl:rotate-180" />}>
              <a href="#reserve">Reserve a table</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#menu">View tonight&rsquo;s menu</a>
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
        <Card variant="elevated" className="justify-self-center md:justify-self-end">
          <CardContent className="grid w-full max-w-sm gap-4 p-6 sm:p-7">
            <div className="flex items-baseline justify-between gap-2">
              <Text size="sm" weight="semibold" className="uppercase tracking-widest text-primary">
                Tonight
              </Text>
              <Text size="sm" variant="muted">
                18:00 · 20:30
              </Text>
            </div>
            <p className="text-5xl font-bold tabular-nums">
              09 <span className="text-lg font-medium text-muted-foreground">courses</span>
            </p>
            <Separator />
            <ul className="grid gap-2">
              {preview.map((dish) => (
                <li key={dish} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                  {dish}
                </li>
              ))}
            </ul>
            <a
              href="#menu"
              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              See the full menu
              <ArrowRightIcon aria-hidden className="size-4 rtl:rotate-180" />
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
