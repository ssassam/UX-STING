"use client";
import { useState } from "react";
import { Button } from "@unified-ui/react/button";
import { Stepper } from "@unified-ui/react/stepper";

const steps = [
  { title: "Business details", description: "Name & category" },
  { title: "Location", description: "Address & hours" },
  { title: "Photos", description: "Up to 10" },
  { title: "Review" },
];

export function Horizontal() {
  const [current, setCurrent] = useState(1);
  return (
    <div className="grid gap-6">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} />
      <div className="flex gap-2">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Back
        </Button>
        <Button disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function Vertical() {
  return (
    <Stepper
      orientation="vertical"
      steps={[
        ...steps.slice(0, 2),
        { title: "Photos", error: true, description: "2 files failed" },
        steps[3]!,
      ]}
      current={2}
    />
  );
}
