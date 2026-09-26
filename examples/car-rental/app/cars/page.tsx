import { Suspense } from "react";
import { FleetBrowser } from "../../components/fleet-browser";

export const metadata = { title: "Our fleet" };

export default function CarsPage() {
  return (
    <Suspense>
      <FleetBrowser />
    </Suspense>
  );
}
