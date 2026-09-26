"use client";
import { SearchInput } from "@unified-ui/react/search-input";
import { SearchResult, SearchResults } from "@unified-ui/react/search-result";
import { EmptyState } from "@unified-ui/react/state";
import { Heading } from "@unified-ui/react/typography";
import { fuzzyScore } from "@unified-ui/utils";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { articles, formatDate } from "../lib/data";

export function SearchResultsView() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const results = useMemo(
    () =>
      articles
        .map((a) => ({ a, score: fuzzyScore(q, a.title, [a.category, a.excerpt, a.author.name]) }))
        .filter((r) => r.score > 0)
        .sort((x, y) => y.score - x.score)
        .map((r) => r.a),
    [q],
  );
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">Search</Heading>
      <SearchInput value={q} onValueChange={setQ} placeholder="Search stories" />
      <SearchResults summary={q ? `${results.length} results for “${q}”` : `${results.length} stories`}>
        {results.length ? (
          results.map((a) => (
            <SearchResult headingLevel={2} key={a.slug} href={`/article/${a.slug}`} title={a.title} description={a.excerpt} query={q} path={`${a.category} › ${formatDate(a.date)}`} meta={<span>{a.author.name} · {a.readingMinutes} min read</span>} />
          ))
        ) : (
          <EmptyState headingLevel={2} title="No stories found" description="Try a different keyword or browse the sections." />
        )}
      </SearchResults>
    </div>
  );
}
