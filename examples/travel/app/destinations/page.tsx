import { Suspense } from "react";
import { DestinationsBrowser } from "../../components/destinations-browser";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Destinations",
  description:
    "Explore beach escapes, mountain trips, city breaks and cultural journeys around the world.",
  path: "destinations",
});

export default function DestinationsPage() {
  return (
    <Suspense>
      <DestinationsBrowser />
    </Suspense>
  );
}
