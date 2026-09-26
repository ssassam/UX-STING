import { CalendarDaysIcon, LuggageIcon, MapPinIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Card, CardContent } from "@ux-sting/react/card";
import { Image } from "@ux-sting/react/media";
import { Progress } from "@ux-sting/react/progress";
import { EmptyState } from "@ux-sting/react/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { getDestination, getStay, getTour } from "../../lib/data";
import { sized } from "../../lib/photos";

export const metadata = { title: "My trips" };

const upcoming = [
  {
    ref: "WF-7KQ2ZD",
    stay: getStay("riad-yasmine")!,
    dates: "12–16 Oct 2026",
    status: "Confirmed",
    daysAway: 16,
  },
  {
    ref: "WF-3HD9PL",
    tour: getTour("kyoto-food-and-temples")!,
    dates: "14–17 Nov 2026",
    status: "Deposit paid",
    daysAway: 49,
  },
];

export default function TripsPage() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
      <div className="grid gap-1">
        <Heading level={1} size="2xl">
          My trips
        </Heading>
        <Text variant="muted">Signed in as a demo traveller.</Text>
      </div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="pt-6">
          <ul className="grid gap-4">
            {upcoming.map((trip) => {
              const name = trip.stay?.name ?? trip.tour!.title;
              const place = getDestination(trip.stay?.destination ?? trip.tour!.destination)!;
              const href = trip.stay ? `/stays/${trip.stay.id}` : `/tours/${trip.tour!.id}`;
              return (
                <li key={trip.ref}>
                  <Card className="overflow-hidden sm:flex">
                    <div className="sm:w-56 sm:shrink-0">
                      <Image
                        src={sized(trip.stay?.image ?? trip.tour!.image, 960)}
                        alt=""
                        ratio={16 / 10}
                        radius="none"
                      />
                    </div>
                    <CardContent className="grid flex-1 gap-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={trip.status === "Confirmed" ? "success" : "warning"} dot>
                          {trip.status}
                        </Badge>
                        <Text size="sm" variant="muted" tabular>
                          Ref. {trip.ref}
                        </Text>
                      </div>
                      <Heading level={2} size="md">
                        {name}
                      </Heading>
                      <Text size="sm" variant="muted" className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon aria-hidden className="size-4" /> {place.name},{" "}
                          {place.country}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDaysIcon aria-hidden className="size-4" /> {trip.dates}
                        </span>
                      </Text>
                      <Progress
                        value={Math.max(5, 100 - trip.daysAway)}
                        label={`${trip.daysAway} days to go`}
                        showValue={false}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <NextLink href={href}>View details</NextLink>
                        </Button>
                        <Button size="sm" variant="outline">
                          Manage booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </TabsContent>
        <TabsContent value="past" className="pt-6">
          <EmptyState
            headingLevel={2}
            icon={<LuggageIcon />}
            title="No past trips yet"
            description="Trips you've completed will appear here, ready to review."
          />
        </TabsContent>
        <TabsContent value="saved" className="pt-6">
          <EmptyState
            headingLevel={2}
            title="Nothing saved yet"
            description="Tap the heart on any stay to save it for later."
            actions={
              <Button asChild>
                <NextLink href="/search">Browse stays</NextLink>
              </Button>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
