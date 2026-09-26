import { cn } from "@ux-sting/utils";
import type { ReactNode } from "react";
import { Avatar } from "../avatar/avatar.js";
import { Card, CardLink } from "../card/card.js";
import { Image } from "../media/image.js";

export interface ArticleCardProps {
  title: string;
  href: string;
  excerpt?: ReactNode;
  image?: { src: string; alt: string };
  category?: ReactNode;
  author?: { name: string; avatar?: string; href?: string };
  /** Display date string and machine-readable `dateTime`. */
  date?: { display: ReactNode; dateTime: string };
  readingTime?: ReactNode;
  layout?: "vertical" | "horizontal" | "featured";
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Editorial card (blog, news, guides) rendered as an `<article>`. */
export function ArticleCard({
  title,
  href,
  excerpt,
  image,
  category,
  author,
  date,
  readingTime,
  layout = "vertical",
  headingLevel = 3,
  className,
}: ArticleCardProps) {
  const Heading = `h${headingLevel}` as const;
  const featured = layout === "featured";
  return (
    <Card
      asChild
      variant="ghost"
      className={cn("gap-3", layout === "horizontal" && "sm:flex-row sm:gap-5", className)}
    >
      <article>
        {image ? (
          <div
            className={cn(
              "overflow-hidden rounded-xl",
              layout === "horizontal" && "sm:w-2/5 sm:shrink-0",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              ratio={featured ? 16 / 9 : 3 / 2}
              radius="none"
              className="transition-transform duration-(--ui-duration-slow) group-hover/card:scale-[1.02]"
            />
          </div>
        ) : null}
        <div className="grid content-start gap-2">
          {category ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{category}</p>
          ) : null}
          <Heading
            className={cn(
              "font-semibold leading-snug tracking-tight text-foreground text-balance",
              featured ? "text-2xl sm:text-3xl" : "text-lg",
            )}
          >
            <CardLink href={href}>{title}</CardLink>
          </Heading>
          {excerpt ? (
            <p
              className={cn("text-muted-foreground", featured ? "text-md" : "line-clamp-3 text-sm")}
            >
              {excerpt}
            </p>
          ) : null}
          {author || date || readingTime ? (
            <div className="relative z-[2] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {author ? (
                <span className="inline-flex items-center gap-2">
                  <Avatar size="xs" src={author.avatar} name={author.name} alt="" />
                  {author.href ? (
                    <a href={author.href} className="font-medium text-foreground hover:underline">
                      {author.name}
                    </a>
                  ) : (
                    <span className="font-medium text-foreground">{author.name}</span>
                  )}
                </span>
              ) : null}
              {date ? (
                <>
                  {author ? <span aria-hidden>·</span> : null}
                  <time dateTime={date.dateTime}>{date.display}</time>
                </>
              ) : null}
              {readingTime ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{readingTime}</span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </Card>
  );
}
