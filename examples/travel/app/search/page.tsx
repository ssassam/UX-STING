import { Suspense } from "react";
import { StaysSearch } from "../../components/stays-search";

export const metadata = { title: "Stays" };

export default function SearchPage() {
  return (
    <Suspense>
      <StaysSearch />
    </Suspense>
  );
}
