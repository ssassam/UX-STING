"use client";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { Button } from "@ux-sting/react/button";
import { useState } from "react";

export function CountUp() {
  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      <div>
        <dt className="text-sm text-muted-foreground">Revenue</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber
            value={48210}
            from={0}
            formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
          />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Visitors</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber value={18442} from={0} spring="gentle" />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Conversion</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber
            value={0.034}
            from={0}
            formatOptions={{ style: "percent", minimumFractionDigits: 1 }}
          />
        </dd>
      </div>
    </dl>
  );
}

export function LiveTotal() {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline" onClick={() => setQty((q) => q + 1)}>
        Add one
      </Button>
      <p className="text-xl font-semibold">
        Total:{" "}
        <AnimatedNumber
          value={qty * 38}
          spring="bouncy"
          formatOptions={{ style: "currency", currency: "USD" }}
        />
      </p>
    </div>
  );
}
