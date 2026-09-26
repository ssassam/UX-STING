import { ArticleCard } from "@ux-sting/react/article-card";
import { Avatar } from "@ux-sting/react/avatar";
import { Badge } from "@ux-sting/react/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ux-sting/react/breadcrumb";
import { Image } from "@ux-sting/react/media";
import { ProfileCard } from "@ux-sting/react/profile-card";
import { Blockquote, Heading, Prose, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Newsletter } from "../../../components/newsletter";
import { ShareBar } from "../../../components/share-bar";
import { articles, formatDate } from "../../../lib/data";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);
  return (
    <article className="grid grid-cols-[minmax(0,1fr)] gap-10">
      <header className="mx-auto grid w-full max-w-3xl gap-5">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NextLink href="/">Home</NextLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NextLink href={`/search?q=${encodeURIComponent(article.category)}`}>
                {article.category}
              </NextLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <Badge variant="primary" className="justify-self-start">
          {article.category}
        </Badge>
        <Heading level={1} size="3xl">
          {article.title}
        </Heading>
        <Text size="lg" variant="muted">
          {article.excerpt}
        </Text>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={article.author.name} src={article.author.avatar} alt="" />
            <div className="grid text-sm">
              <span className="font-medium">{article.author.name}</span>
              <span className="text-muted-foreground">
                <time dateTime={article.date}>{formatDate(article.date)}</time> ·{" "}
                {article.readingMinutes} min read
              </span>
            </div>
          </div>
          <ShareBar title={article.title} />
        </div>
      </header>
      <Image
        src={article.image}
        alt=""
        ratio={16 / 9}
        radius="xl"
        loading="eager"
        containerClassName="mx-auto w-full max-w-5xl"
      />
      <Prose className="mx-auto w-full">
        {article.body.slice(0, 2).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <Blockquote>
          “The city rewards the curious walker — and punishes the one in a hurry.”
        </Blockquote>
        <h2>Where to eat</h2>
        {article.body.slice(2).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <ul>
          <li>Go early: most pastry shops open at 7 am.</li>
          <li>Carry small change for markets and taxis.</li>
          <li>Friday afternoons are quiet — many shops close for prayers.</li>
        </ul>
      </Prose>
      <div className="mx-auto w-full max-w-3xl">
        <ProfileCard
          layout="horizontal"
          headingLevel={2}
          name={article.author.name}
          avatar={article.author.avatar}
          subtitle={article.author.role}
          bio={article.author.bio}
        />
      </div>
      <section aria-labelledby="related" className="grid gap-6">
        <Heading id="related" level={2} size="md">
          Related stories
        </Heading>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard
              key={a.slug}
              href={`/article/${a.slug}`}
              title={a.title}
              excerpt={a.excerpt}
              image={{ src: a.image, alt: "" }}
              category={a.category}
              date={{ display: formatDate(a.date), dateTime: a.date }}
            />
          ))}
        </div>
      </section>
      <Newsletter />
    </article>
  );
}
