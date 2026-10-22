import { Suspense } from "react";
import { FleetBrowser, FleetBrowserFromUrl } from "../../components/fleet-browser";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Our fleet",
  description:
    "Compare economy, electric, premium, SUV and van rentals with unlimited kilometres and free cancellation.",
  path: "cars",
});

export default function CarsPage() {
  return (
    // The static HTML holds the unfiltered fleet; URL filters apply after load.
    <Suspense fallback={<FleetBrowser />}>
      <FleetBrowserFromUrl />
    </Suspense>
  );
}
