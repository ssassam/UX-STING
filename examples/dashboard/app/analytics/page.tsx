import { Progress } from "@unified-ui/react/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@unified-ui/react/card";
import { Stat, StatGroup } from "@unified-ui/react/stat";
import { Heading } from "@unified-ui/react/typography";
import { RevenueChart } from "../../components/revenue-chart";

export const metadata = { title: "Analytics" };

const sources = [
  ["Search", 46],
  ["Direct", 24],
  ["Social", 18],
  ["Referral", 12],
] as const;

export default function AnalyticsPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">
        Analytics
      </Heading>
      <StatGroup>
        <Stat label="Conversion" value="3.8%" delta="+0.4 pt" trend="up" />
        <Stat label="Avg. stay" value="2.9 nights" delta="+0.2" trend="up" />
        <Stat
          label="Cancellation rate"
          value="4.1%"
          delta="-1.2 pt"
          trend="down"
          trendMeaning="positive-down"
        />
        <Stat
          label="Response time"
          value="38 min"
          delta="+6 min"
          trend="up"
          trendMeaning="positive-down"
        />
      </StatGroup>
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <Card>
          <CardHeader>
            <CardTitle as="h2">Traffic sources</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {sources.map(([label, value]) => (
              <Progress key={label} value={value} label={label} showValue id={`src-${label}`} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
