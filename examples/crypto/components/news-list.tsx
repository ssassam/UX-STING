"use client";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Pagination } from "@ux-sting/react/pagination";
import { SearchInput } from "@ux-sting/react/search-input";
import { EmptyState } from "@ux-sting/react/state";
import { Chip } from "@ux-sting/react/tag";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import { getCoin } from "../lib/market";
import { articles, publishedAt, timeAgo, topics, type Article, type Topic } from "../lib/news";

const sentiment = {
  bullish: { label: "Bullish", variant: "success", icon: <TrendingUpIcon /> },
  bearish: { label: "Bearish", variant: "destructive", icon: <TrendingDownIcon /> },
  neutral: { label: "Neutral", variant: "default", icon: <MinusIcon /> },
} as const;

export function NewsItem({ a, headingLevel = 3 }: { a: Article; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const s = sentiment[a.sentiment];
  return (
    <article className="grid gap-2 py-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{a.source}</span>
        <span aria-hidden>·</span>
        <time dateTime={publishedAt(a).toISOString()}>{timeAgo(a)}</time>
        <span aria-hidden>·</span>
        <span>{a.readMinutes} min read</span>
        <Badge size="sm" variant={s.variant} icon={s.icon}>
          {s.label}
        </Badge>
      </div>
      <H className="text-md font-semibold leading-snug text-balance">{a.title}</H>
      <p className="text-sm text-muted-foreground">{a.summary}</p>
      <ul aria-label="Related assets" className="flex flex-wrap gap-1.5">
        {a.coins.map((id) => {
          const c = getCoin(id)!;
          return (
            <li key={id}>
              <NextLink
                href={`/coin/${id}`}
                className="inline-flex h-6 items-center rounded-full border border-border px-2 text-xs font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                {c.symbol}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function NewsList({ pageSize = 6 }: { pageSize?: number }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = useMemo(
    () =>
      articles.filter(
        (a) =>
          (!topic || a.topic === topic) &&
          (!q || `${a.title} ${a.summary}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [topic, q],
  );
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const current = Math.min(page, pages);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Topic"
          className="-mx-1 flex min-w-0 basis-full gap-2 overflow-x-auto px-1 pb-1 sm:basis-0 sm:flex-1"
        >
          <Chip
            selected={!topic}
            onClick={() => {
              setTopic(null);
              setPage(1);
            }}
          >
            All
          </Chip>
          {topics.map((t) => (
            <Chip
              key={t}
              selected={topic === t}
              onClick={() => {
                setTopic(topic === t ? null : t);
                setPage(1);
              }}
            >
              {t}
            </Chip>
          ))}
        </div>
        <SearchInput
          value={q}
          onValueChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search headlines"
          className="w-full sm:w-64"
        />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {list.length} {list.length === 1 ? "story" : "stories"}
      </p>
      {list.length ? (
        <ul className="grid divide-y divide-border">
          {list.slice((current - 1) * pageSize, current * pageSize).map((a) => (
            <li key={a.id}>
              <NewsItem a={a} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          headingLevel={2}
          title="No stories match"
          description="Try another topic or search term."
        />
      )}
      {pages > 1 ? <Pagination totalPages={pages} page={current} onPageChange={setPage} /> : null}
    </div>
  );
}
