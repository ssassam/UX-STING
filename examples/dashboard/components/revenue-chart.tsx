import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ux-sting/react/card";
import { revenueByMonth } from "../lib/data";

const eur = (v: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

/**
 * Dependency-free bar chart (server component). The SVG is decorative for
 * assistive tech; the same data is exposed as a visually hidden table.
 */
export function RevenueChart() {
  const max = Math.max(...revenueByMonth.map((d) => d.value));
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Revenue</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div aria-hidden className="flex h-48 items-end gap-3 border-b border-border">
          {revenueByMonth.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(d.value / 1000)}k
              </span>
              <div
                className="w-full max-w-12 rounded-t-md bg-primary transition-[height]"
                style={{ height: `${(d.value / max) * 140}px` }}
              />
            </div>
          ))}
        </div>
        <div aria-hidden className="mt-2 flex gap-3">
          {revenueByMonth.map((d) => (
            <span key={d.month} className="flex-1 text-center text-xs text-muted-foreground">
              {d.month}
            </span>
          ))}
        </div>
        <table className="sr-only">
          <caption>Revenue by month</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenueByMonth.map((d) => (
              <tr key={d.month}>
                <th scope="row">{d.month}</th>
                <td>{eur(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
