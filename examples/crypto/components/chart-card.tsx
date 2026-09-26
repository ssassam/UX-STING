"use client";
import { Card, CardContent, CardHeader } from "@ux-sting/react/card";
import { ToggleGroup, ToggleGroupItem } from "@ux-sting/react/toggle";
import { Heading, Text } from "@ux-sting/react/typography";
import { useState } from "react";
import { formatUsd, getCoin, series, stats, type Range } from "../lib/market";
import { Change } from "./bits";
import { PriceChart } from "./price-chart";

const ranges: Range[] = ["1D", "1W", "1M", "1Y"];

export function ChartCard({ coinId, headingLevel = 2 }: { coinId: string; headingLevel?: 2 | 3 }) {
  const coin = getCoin(coinId)!;
  const [range, setRange] = useState<Range>("1M");
  const data = series(coin, range);
  const s = stats(coin, range);
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Heading level={headingLevel} size="sm" className="text-muted-foreground">
            {coin.name} price · {range}
          </Heading>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-semibold tabular-nums">{formatUsd(coin.price)}</span>
            <Change value={s.change} />
          </p>
          <Text size="xs" variant="muted">
            Sample data · Low {formatUsd(s.low)} · High {formatUsd(s.high)}
          </Text>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={range}
          onValueChange={(v) => v && setRange(v as Range)}
          aria-label="Time range"
        >
          {ranges.map((r) => (
            <ToggleGroupItem
              key={r}
              value={r}
              aria-label={{ "1D": "1 day", "1W": "1 week", "1M": "1 month", "1Y": "1 year" }[r]}
            >
              {r}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <PriceChart data={data} range={range} label={`${coin.name} price`} />
      </CardContent>
    </Card>
  );
}
