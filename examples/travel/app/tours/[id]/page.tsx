import { CalendarDaysIcon, CheckIcon, MountainIcon, UsersIcon } from "@ux-sting/icons";
import { Image } from "@ux-sting/react/media";
import { ReviewStars } from "@ux-sting/react/rating";
import { Stat, StatGroup } from "@ux-sting/react/stat";
import { Timeline, TimelineItem } from "@ux-sting/react/timeline";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { TourBooking } from "../../../components/tour-booking";
import { getDestination, getTour, tours } from "../../../lib/data";

export function generateStaticParams() {
  return tours.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const t = getTour((await params).id);
  return t ? { title: t.title, description: t.summary } : {};
}

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
  const tour = getTour((await params).id);
  if (!tour) notFound();
  const d = getDestination(tour.destination)!;
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tours", href: "/tours" },
          { label: tour.title },
        ]}
      />
      <header className="grid gap-2">
        <Text size="sm" variant="muted" weight="medium" className="uppercase tracking-wide">
          {d.name}, {d.country}
        </Text>
        <Heading level={1} size="3xl">
          {tour.title}
        </Heading>
        <ReviewStars value={tour.rating} count={tour.reviews} showValue />
      </header>
      <Image src={tour.image.src} alt={tour.image.alt} ratio={21 / 9} radius="xl" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid content-start gap-10">
          <StatGroup>
            <Stat icon={<CalendarDaysIcon />} label="Duration" value={`${tour.days} days`} />
            <Stat icon={<UsersIcon />} label="Group size" value={`Max ${tour.groupSize}`} />
            <Stat icon={<MountainIcon />} label="Activity level" value={tour.level} />
          </StatGroup>
          <Text className="max-w-prose text-lg text-pretty">{tour.summary}</Text>
          <section aria-labelledby="itinerary-title" className="grid gap-4">
            <Heading level={2} size="lg" id="itinerary-title">
              Itinerary
            </Heading>
            <Timeline>
              {tour.itinerary.map((step, i) => (
                <TimelineItem
                  key={step.title}
                  time={`Stop ${i + 1}`}
                  title={step.title}
                  description={step.description}
                  variant={i === 0 ? "primary" : "default"}
                />
              ))}
            </Timeline>
          </section>
          <section aria-labelledby="included-title" className="grid gap-3">
            <Heading level={2} size="lg" id="included-title">
              What&apos;s included
            </Heading>
            <ul className="grid gap-2">
              {tour.included.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon aria-hidden className="size-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <TourBooking tour={tour} />
      </div>
    </div>
  );
}
