import { ArrowRightIcon } from "@ux-sting/icons";
import { Alert, AlertDescription } from "@ux-sting/react/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Progress } from "@ux-sting/react/progress";
import { StatCard } from "@ux-sting/react/stat";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { Change, CoinMark } from "../components/bits";
import { ChartCard } from "../components/chart-card";
import { CoinsTable } from "../components/coins-table";
import { NewsItem } from "../components/news-list";
import { coins, formatPct, formatUsd, stats, totalMarketCap } from "../lib/market";
import { articles } from "../lib/news";
import { jsonLd, pageMeta, SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "Crypto market overview with interactive price charts, top movers, a sortable asset table and news (sample data).",
});

export default function MarketsPage() {
  const withChange = coins
    .filter((c) => c.category !== "Stablecoin")
    .map((c) => ({ coin: c, change: stats(c, "1D").change }));
  const gainers = [...withChange].sort((a, b) => b.change - a.change).slice(0, 4);
  const losers = [...withChange].sort((a, b) => a.change - b.change).slice(0, 4);
  const btc = coins[0]!;
  const volume = coins.reduce((n, c) => n + stats(c).volume, 0);
  const capChange =
    withChange.reduce((n, c) => n + c.change * c.coin.price * c.coin.supply, 0) / totalMarketCap;
  const fearGreed = 62;
  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: "Crypto market analytics and news (sample data).",
        })}
      />
      <div className="grid gap-1">
        <Heading level={1} size="2xl">
          Market overview
        </Heading>
        <Text variant="muted">12 tracked assets · updated every 15 minutes</Text>
      </div>
      <Alert variant="warning">
        <AlertDescription>
          This is a design demo. All numbers are generated sample data — not real prices and not
          financial advice.
        </AlertDescription>
      </Alert>
      <section aria-label="Market summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Market cap"
          value={formatUsd(totalMarketCap, true)}
          delta={formatPct(capChange)}
          trend={capChange >= 0 ? "up" : "down"}
          helpText="24h"
        />
        <StatCard
          label="24h volume"
          value={formatUsd(volume, true)}
          helpText="Across tracked assets"
        />
        <StatCard
          label="BTC dominance"
          value={formatPct((btc.price * btc.supply) / totalMarketCap).replace("+", "")}
          helpText="Share of market cap"
        />
        <StatCard
          label="Fear & Greed"
          value={`${fearGreed} · Greed`}
          helpText={
            <Progress
              value={fearGreed}
              aria-label="Fear and greed index, 62 of 100"
              size="sm"
              variant="success"
              className="mt-1"
            />
          }
        />
      </section>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ChartCard coinId="bitcoin" />
        <div className="grid content-start gap-6 sm:grid-cols-2 xl:grid-cols-1">
          {[
            { title: "Top gainers · 24h", list: gainers },
            { title: "Top losers · 24h", list: losers },
          ].map((group) => (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle as="h2" className="text-md">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3">
                  {group.list.map(({ coin, change }) => (
                    <li key={coin.id} className="flex items-center justify-between gap-3">
                      <NextLink
                        href={`/coin/${coin.id}`}
                        className="flex min-w-0 items-center gap-2 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <CoinMark coin={coin} />
                        <span className="truncate font-medium">{coin.name}</span>
                      </NextLink>
                      <span className="grid justify-items-end text-sm">
                        <span className="tabular-nums">{formatUsd(coin.price)}</span>
                        <Change value={change} className="text-xs" />
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <section aria-labelledby="assets-title" className="grid gap-3">
        <Heading level={2} size="lg" id="assets-title">
          All assets
        </Heading>
        <CoinsTable />
      </section>
      <section aria-labelledby="news-title" className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <Heading level={2} size="lg" id="news-title">
            Latest news
          </Heading>
          <NextLink
            href="/news"
            className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            All news <ArrowRightIcon aria-hidden className="size-4 rtl:rotate-180" />
          </NextLink>
        </div>
        <ul className="grid divide-y divide-border lg:grid-cols-2 lg:gap-x-8 lg:divide-y-0 [&>li]:border-border lg:[&>li]:border-b">
          {articles.slice(0, 4).map((a) => (
            <li key={a.id}>
              <NewsItem a={a} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
