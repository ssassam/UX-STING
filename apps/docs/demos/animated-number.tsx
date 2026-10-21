"use client";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { Button } from "@ux-sting/react/button";
import { useState } from "react";

export function Stats() {
  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      <div>
        <dt className="text-sm text-muted-foreground">Bookings</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber value={12840} />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Revenue</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber
            value={2.4e6}
            format={{ style: "currency", currency: "EUR", notation: "compact" }}
          />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Satisfaction</dt>
        <dd className="text-3xl font-semibold">
          <AnimatedNumber value={0.982} format={{ style: "percent", maximumFractionDigits: 1 }} />
        </dd>
      </div>
    </dl>
  );
}

export function PricingToggle() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="grid justify-items-start gap-3">
      <p className="text-4xl font-semibold">
        <AnimatedNumber
          value={yearly ? 190 : 19}
          duration={500}
          format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
        />
        <span className="text-base font-normal text-muted-foreground">
          {yearly ? " / year" : " / month"}
        </span>
      </p>
      <Button variant="outline" size="sm" onClick={() => setYearly((y) => !y)}>
        {yearly ? "Show monthly" : "Show yearly"}
      </Button>
    </div>
  );
}
