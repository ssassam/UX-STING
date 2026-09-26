import { Suspense } from "react";
import { SearchResultsView } from "../../components/search-results";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResultsView />
    </Suspense>
  );
}
