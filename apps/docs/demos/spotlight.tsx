"use client";
import { Card, CardContent } from "@ux-sting/react/card";
import { Spotlight, Tilt } from "@ux-sting/react/spotlight";

export function SpotlightCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {["Starter", "Pro"].map((plan) => (
        <Spotlight key={plan} className="rounded-lg">
          <Card className="bg-transparent">
            <CardContent className="pt-6">
              <p className="font-semibold">{plan}</p>
              <p className="text-sm text-muted-foreground">Move your mouse over the card.</p>
            </CardContent>
          </Card>
        </Spotlight>
      ))}
    </div>
  );
}

export function TiltMedia() {
  return (
    <Tilt className="max-w-sm">
      <div className="grid aspect-video place-items-center rounded-lg border border-border bg-primary-subtle text-primary-subtle-foreground">
        Hover me
      </div>
    </Tilt>
  );
}
