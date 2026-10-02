import { ArrowRightIcon } from "@ux-sting/icons";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import type { ReactNode } from "react";

/** Page section with a heading, optional intro and "see all" link. */
export function Section({
  id,
  title,
  intro,
  href,
  hrefLabel,
  children,
  className,
}: {
  id: string;
  title: string;
  intro?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 sm:px-6 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <Heading level={2} size="xl" id={`${id}-title`} className="text-balance">
            {title}
          </Heading>
          {intro ? (
            <Text variant="muted" className="max-w-2xl">
              {intro}
            </Text>
          ) : null}
        </div>
        {href ? (
          <NextLink
            href={href}
            className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {hrefLabel ?? "See all"}
            <ArrowRightIcon aria-hidden className="size-4 rtl:rotate-180" />
          </NextLink>
        ) : null}
      </div>
      {children}
    </section>
  );
}
