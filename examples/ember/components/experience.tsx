"use client";
import { CheckIcon, FlameIcon, LockIcon, UsersIcon } from "@ux-sting/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { Heading, Text } from "@ux-sting/react/typography";
import type { ReactNode } from "react";

const modes: {
  id: string;
  label: string;
  icon: ReactNode;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    id: "room",
    label: "Dining room",
    icon: <UsersIcon />,
    title: "Sixteen seats, one seating a night",
    body: "Low tables around the open kitchen, candlelight and a single sitting so every course arrives unhurried.",
    points: ["Doors at 18:00, last course by 21:30", "Shared or private tables of 2–8", "Dress: smart casual"],
  },
  {
    id: "counter",
    label: "Chef's counter",
    icon: <FlameIcon />,
    title: "Six seats facing the pass",
    body: "Watch every plate assembled at arm's length, with the chef talking you through the ingredients as they go.",
    points: ["Extended 12-course format", "Wine pairing included", "Best for parties of 1–4"],
  },
  {
    id: "private",
    label: "Private room",
    icon: <LockIcon />,
    title: "A closed room for up to ten",
    body: "The same tasting menu, served course by course behind a sliding door — for anniversaries, teams and quiet celebrations.",
    points: ["Minimum six guests", "Custom menu notes on request", "Available Tuesday–Thursday"],
  },
];

export function Experience() {
  return (
    <Tabs defaultValue="room" className="grid gap-8">
      <TabsList className="mx-auto" aria-label="Ways to dine at Ember">
        {modes.map((m) => (
          <TabsTrigger key={m.id} value={m.id}>
            {m.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {modes.map((m) => (
        <TabsContent key={m.id} value={m.id}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div
              aria-hidden
              className="mx-auto grid aspect-square w-full max-w-xs place-items-center rounded-3xl bg-primary-subtle text-primary-subtle-foreground [&_svg]:size-16"
            >
              {m.icon}
            </div>
            <div className="grid gap-4">
              <Heading level={3} size="xl">
                {m.title}
              </Heading>
              <Text variant="muted" size="lg">
                {m.body}
              </Text>
              <ul className="grid gap-2">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckIcon aria-hidden className="size-4 text-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
