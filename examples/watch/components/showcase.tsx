"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { Heading, Text } from "@ux-sting/react/typography";
import { CheckIcon } from "@ux-sting/icons";
import { finishes, WatchArt, type Screen } from "./watch-art";

const modes: { id: Screen; label: string; title: string; body: string; points: string[] }[] = [
  {
    id: "health",
    label: "Health",
    title: "Know your body, day and night",
    body: "Continuous heart rate, blood-oxygen and stress, plus sleep stages with a morning readiness score.",
    points: [
      "24/7 heart rate with alerts",
      "SpO₂ and skin temperature",
      "Sleep stages and readiness",
    ],
  },
  {
    id: "workout",
    label: "Training",
    title: "GPS that doesn't drift",
    body: "Dual-band GPS locks on in seconds and stays accurate between tall buildings and under trees.",
    points: ["Dual-band GPS + GLONASS", "Live pace and heart-rate zones", "Offline route maps"],
  },
  {
    id: "time",
    label: "Everyday",
    title: "Smart, without the noise",
    body: "Notifications, contactless payments and music controls — with an always-on display that still lasts two weeks.",
    points: ["Contactless payments", "Smart notifications", "Always-on display mode"],
  },
];

export function Showcase() {
  return (
    <Tabs defaultValue="health" className="grid gap-8">
      <TabsList className="mx-auto" aria-label="Pulse One features">
        {modes.map((m) => (
          <TabsTrigger key={m.id} value={m.id}>
            {m.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {modes.map((m, i) => (
        <TabsContent key={m.id} value={m.id}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <WatchArt
              finish={finishes[i % finishes.length]!}
              screen={m.id}
              className="mx-auto w-52 sm:w-64"
            />
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
