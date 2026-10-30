import { AnimatedArrowRightIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import type { ReactNode } from "react";

/**
 * One stage of the roadbook: a mono index in the left gutter, the route line
 * that draws itself as the section passes, then the content. Every section on
 * the site uses this, which is what makes the page read as one publication.
 */
export function Section({
  id,
  index,
  title,
  kicker,
  intro,
  href,
  hrefLabel,
  children,
  className,
  bodyClassName,
}: {
  id: string;
  /** Roadbook stage number, e.g. "01". */
  index: string;
  title: string;
  /** Mono label above the title ("· ELECTRIC FLEET ·"). */
  kicker?: string;
  intro?: ReactNode;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
  /** Extra classes on the content column (e.g. a wider grid). */
  bodyClassName?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`border-t border-border ${className ?? ""}`}
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10 md:py-24">
        <div className="relative ps-4 md:ps-0">
          <span aria-hidden className="route-line absolute inset-y-0 start-0 w-px overflow-hidden">
            <span className="route-line-fill" />
          </span>
          <p className="roadbook-label text-primary">
            <span className="text-muted-foreground">STAGE</span> {index}
          </p>
        </div>
        <div className="grid min-w-0 gap-6">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="grid gap-2">
              {kicker ? <p className="roadbook-label text-muted-foreground">{kicker}</p> : null}
              <Heading
                level={2}
                size="2xl"
                id={`${id}-title`}
                className="font-display text-balance tracking-tight"
              >
                {title}
              </Heading>
              {intro ? (
                <Text variant="muted" className="max-w-2xl text-pretty">
                  {intro}
                </Text>
              ) : null}
            </div>
            {href ? (
              <NextLink
                href={href}
                className={`${ICON_ANCHOR_CLASS} inline-flex items-center gap-2 rounded-sm text-sm font-semibold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring`}
              >
                {hrefLabel ?? "See all"}
                <AnimatedArrowRightIcon aria-hidden className="size-4 rtl:rotate-180" />
              </NextLink>
            ) : null}
          </div>
          <div className={bodyClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}
