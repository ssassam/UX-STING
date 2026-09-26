import { ArticleCard } from "@unified-ui/react/article-card";
import { List, ListItem } from "@unified-ui/react/list";
import { Separator } from "@unified-ui/react/separator";
import { Heading } from "@unified-ui/react/typography";
import { Newsletter } from "../components/newsletter";
import { SectionTabs } from "../components/section-tabs";
import { articles, formatDate } from "../lib/data";

export default function Home() {
  const [featured, ...rest] = articles;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12">
      <h1 className="sr-only">The Medina Review</h1>
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <ArticleCard
          layout="featured"
          headingLevel={2}
          href={`/article/${featured!.slug}`}
          title={featured!.title}
          excerpt={featured!.excerpt}
          image={{ src: featured!.image, alt: "" }}
          category={featured!.category}
          author={{ name: featured!.author.name, avatar: featured!.author.avatar }}
          date={{ display: formatDate(featured!.date), dateTime: featured!.date }}
          readingTime={`${featured!.readingMinutes} min read`}
        />
        <section aria-labelledby="trending" className="grid content-start gap-3">
          <Heading id="trending" level={2} size="sm">
            Trending
          </Heading>
          <List variant="divided">
            {rest.slice(0, 4).map((a, i) => (
              <ListItem key={a.slug} asChild>
                <a href={`/article/${a.slug}`}>
                  <span
                    aria-hidden
                    className="text-2xl font-semibold tabular-nums text-muted-foreground"
                  >
                    {i + 1}
                  </span>
                  <span className="grid">
                    <span className="font-medium">{a.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.category} · {a.readingMinutes} min
                    </span>
                  </span>
                </a>
              </ListItem>
            ))}
          </List>
        </section>
      </div>
      <Separator />
      <section aria-labelledby="latest" className="grid gap-6">
        <Heading id="latest" level={2} size="md">
          Latest
        </Heading>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard
              key={a.slug}
              href={`/article/${a.slug}`}
              title={a.title}
              excerpt={a.excerpt}
              image={{ src: a.image, alt: "" }}
              category={a.category}
              author={{ name: a.author.name, avatar: a.author.avatar }}
              date={{ display: formatDate(a.date), dateTime: a.date }}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="by-section" className="grid gap-4">
        <Heading id="by-section" level={2} size="md">
          By section
        </Heading>
        <SectionTabs />
      </section>
      <Newsletter />
    </div>
  );
}
