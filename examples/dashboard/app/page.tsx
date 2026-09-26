import { CalendarIcon, EyeIcon, StarIcon, WalletIcon } from "@unified-ui/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@unified-ui/react/card";
import { StatCard } from "@unified-ui/react/stat";
import { Timeline, TimelineItem } from "@unified-ui/react/timeline";
import { Heading, Text } from "@unified-ui/react/typography";
import { Suspense } from "react";
import { BookingsTable } from "../components/bookings-table";
import { NewListingDialog } from "../components/new-listing-dialog";
import { RevenueChart } from "../components/revenue-chart";
import { activity } from "../lib/data";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Heading level={1} size="lg">
            Good morning, Salma
          </Heading>
          <Text variant="muted" size="sm">
            Here's what's happening with your listings today.
          </Text>
        </div>
        <Suspense>
          <NewListingDialog />
        </Suspense>
      </div>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue (Mar)"
          value="€36,900"
          delta="+33.7%"
          trend="up"
          helpText="vs Feb"
          icon={<WalletIcon />}
        />
        <StatCard label="Bookings" value="312" delta="+8.2%" trend="up" icon={<CalendarIcon />} />
        <StatCard label="Page views" value="18,442" delta="-2.1%" trend="down" icon={<EyeIcon />} />
        <StatCard label="Avg. rating" value="4.8" delta="+0.1" trend="up" icon={<StarIcon />} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <RevenueChart />
        <Card>
          <CardHeader>
            <CardTitle as="h2">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline>
              {activity.map((a) => (
                <TimelineItem key={a.title} title={a.title} time={a.time} variant={a.variant} />
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="recent" className="grid gap-3">
        <Heading id="recent" level={2} size="sm">
          Recent bookings
        </Heading>
        <BookingsTable compact />
      </section>
    </div>
  );
}
