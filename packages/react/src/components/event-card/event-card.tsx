"use client";
import { ClockIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import type { ReactNode } from "react";
import { useLocale } from "../../provider/context.js";
import { Card, CardLink } from "../card/card.js";
import { Image } from "../media/image.js";
import { Location } from "../location/location.js";

export interface EventCardProps {
  title: string;
  href?: string;
  start: Date;
  end?: Date;
  venue?: ReactNode;
  image?: { src: string; alt: string };
  price?: ReactNode;
  /** e.g. `<AvatarGroup>` of attendees or "120 going". */
  attendees?: ReactNode;
  badges?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Event listing with a localized date block and time range. */
export function EventCard({
  title,
  href,
  start,
  end,
  venue,
  image,
  price,
  attendees,
  badges,
  action,
  headingLevel = 3,
  className,
}: EventCardProps) {
  const { locale } = useLocale();
  const Heading = `h${headingLevel}` as const;
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(start);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(start);
  const timeFmt = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  const time = end ? timeFmt.formatRange(start, end) : timeFmt.format(start);
  return (
    <Card interactive={Boolean(href)} className={className}>
      {image ? (
        <div className="relative">
          <Image src={image.src} alt={image.alt} ratio={16 / 9} radius="none" />
          {badges ? <div className="absolute start-3 top-3 flex gap-1.5">{badges}</div> : null}
        </div>
      ) : null}
      <div className="flex gap-4 p-4">
        <time
          dateTime={start.toISOString()}
          className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-surface"
        >
          <span className="text-xs font-semibold uppercase text-primary">{month}</span>
          <span className="text-lg font-bold leading-none tabular-nums">{day}</span>
        </time>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <Heading className="font-semibold leading-snug">
            {href ? <CardLink href={href}>{title}</CardLink> : title}
          </Heading>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground [&_svg]:size-4">
            <ClockIcon aria-hidden />
            {time}
          </p>
          {venue ? <Location address={venue} /> : null}
          {price || attendees ? (
            <div className={cn("mt-1 flex flex-wrap items-center justify-between gap-2")}>
              {attendees}
              {price}
            </div>
          ) : null}
          {action ? <div className="relative z-[2] mt-2">{action}</div> : null}
        </div>
      </div>
    </Card>
  );
}
