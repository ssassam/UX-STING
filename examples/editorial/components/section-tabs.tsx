"use client";
import { ArticleCard } from "@unified-ui/react/article-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unified-ui/react/tabs";
import { articles, formatDate, sections } from "../lib/data";

/** Tab values become DOM ids — keep them free of spaces. */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function SectionTabs() {
  return (
    <Tabs defaultValue={slug(sections[0])} variant="pills">
      <TabsList aria-label="Sections">
        {sections.map((s) => (
          <TabsTrigger key={s} value={slug(s)}>
            {s}
          </TabsTrigger>
        ))}
      </TabsList>
      {sections.map((s) => (
        <TabsContent key={s} value={slug(s)} className="grid gap-6 pt-2 md:grid-cols-2">
          {articles
            .filter((a) => a.category === s)
            .map((a) => (
              <ArticleCard
                key={a.slug}
                layout="horizontal"
                href={`/article/${a.slug}`}
                title={a.title}
                excerpt={a.excerpt}
                image={{ src: a.image, alt: "" }}
                date={{ display: formatDate(a.date), dateTime: a.date }}
                readingTime={`${a.readingMinutes} min read`}
              />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
