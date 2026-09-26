"use client";
import { Metric, Stat, StatCard, StatGroup } from "@unified-ui/react/stat";
import { EyeIcon, StarIcon, UsersIcon, WalletIcon } from "@unified-ui/icons";

export function Cards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Revenue" value="€48,210" delta="+12.4%" trend="up" helpText="vs last month" icon={<WalletIcon />} />
      <StatCard label="Visitors" value="18,442" delta="+3.1%" trend="up" icon={<EyeIcon />} />
      <StatCard label="Avg. rating" value="4.6" delta="0.0" trend="neutral" icon={<StarIcon />} />
      <StatCard label="Churn" value="2.4%" delta="+0.6%" trend="up" trendMeaning="positive-down" icon={<UsersIcon />} />
    </div>
  );
}

export function Inline() {
  return (
    <div className="grid gap-6">
      <StatGroup>
        <Stat label="Bookings" value="312" />
        <Stat label="Cancellations" value="9" delta="-40%" trend="down" trendMeaning="positive-down" />
      </StatGroup>
      <div className="flex gap-8">
        <Metric label="Views" value="1.2k" />
        <Metric label="Saves" value="86" />
        <Metric label="Calls" value="14" />
      </div>
    </div>
  );
}
