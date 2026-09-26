import { Heading, Text } from "@ux-sting/react/typography";
import { TourCard } from "../../components/tour-card";
import { tours } from "../../lib/data";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Guided tours",
  description: "Small-group tours with expert local guides — sailing, trekking, food and culture.",
  path: "tours",
});

export default function ToursPage() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
      <div className="grid gap-2">
        <Heading level={1} size="2xl">
          Small-group tours
        </Heading>
        <Text variant="muted" className="max-w-2xl">
          Expert local guides, groups of 12 or fewer, and everything planned — just turn up.
        </Text>
      </div>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((t) => (
          <li key={t.id} className="grid">
            <TourCard tour={t} headingLevel={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
