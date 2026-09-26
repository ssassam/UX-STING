import { Suspense } from "react";
import { DestinationsBrowser } from "../../components/destinations-browser";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() {
  return (
    <Suspense>
      <DestinationsBrowser />
    </Suspense>
  );
}
