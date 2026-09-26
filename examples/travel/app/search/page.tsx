import { Suspense } from "react";
import { StaysSearch } from "../../components/stays-search";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Stays",
  description:
    "Search hand-picked hotels, riads, villas and ryokans with filters, maps and free cancellation.",
  path: "search",
});

export default function SearchPage() {
  return (
    <Suspense>
      <StaysSearch />
    </Suspense>
  );
}
