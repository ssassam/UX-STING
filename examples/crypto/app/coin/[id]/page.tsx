import { Badge } from "@ux-sting/react/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ux-sting/react/card";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { Change, CoinMark } from "../../../components/bits";
import { ChartCard } from "../../../components/chart-card";
import { NewsItem } from "../../../components/news-list";
import { coins, formatUsd, getCoin, stats } from "../../../lib/market";
import { articles } from "../../../lib/news";

export function generateStaticParams() {
  return coins.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const c = getCoin((await params).id);
  return c ? { title: `${c.name} (${c.symbol}) price`, description: c.about } : {};
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const coin = getCoin((await params).id);
  if (!coin) notFound();
  const day = stats(coin, "1D");
  const week = stats(coin, "1W");
  const year = stats(coin, "1Y");
  const news = articles.filter((a) => a.coins.includes(coin.id));
  const facts: [string, React.ReactNode][] = [
    ["Market cap", formatUsd(day.marketCap, true)],
    ["24h volume", formatUsd(day.volume, true)],
    [
      "Circulating supply",
      `${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(coin.supply)} ${coin.symbol}`,
    ],
    ["24h range", `${formatUsd(day.low)} – ${formatUsd(day.high)}`],
    ["52-week high", formatUsd(year.high)],
    ["52-week low", formatUsd(year.low)],
  ];
  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Markets", href: "/" }, { label: coin.name }]} />
      <header className="flex flex-wrap items-center gap-4">
        <CoinMark coin={coin} size="lg" />
        <div className="grid gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Heading level={1} size="2xl">
              {coin.name}
            </Heading>
            <Badge>{coin.symbol}</Badge>
            <Badge variant="primary">{coin.category}</Badge>
          </div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>
              24h <Change value={day.change} />
            </span>
            <span>
              7d <Change value={week.change} />
            </span>
            <span>
              1y <Change value={year.change} />
            </span>
          </p>
        </div>
      </header>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ChartCard coinId={coin.id} />
        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-md">
                Key stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-end font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-md">
                About {coin.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text size="sm" variant="muted">
                {coin.about}
              </Text>
            </CardContent>
          </Card>
        </div>
      </div>
      <section aria-labelledby="coin-news" className="grid gap-2">
        <Heading level={2} size="lg" id="coin-news">
          {coin.name} news
        </Heading>
        {news.length ? (
          <ul className="grid divide-y divide-border">
            {news.map((a) => (
              <li key={a.id}>
                <NewsItem a={a} />
              </li>
            ))}
          </ul>
        ) : (
          <Text variant="muted">No recent stories for {coin.name}.</Text>
        )}
      </section>
    </div>
  );
}
