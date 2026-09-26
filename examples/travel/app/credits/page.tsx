import { Heading, Text } from "@ux-sting/react/typography";
import { Suspense } from "react";
import { CreditsGallery } from "../../components/credits-gallery";
import { destinations, stays, tours } from "../../lib/data";
import { photos, type Photo } from "../../lib/photos";

export const metadata = { title: "Photo credits" };

/** Every photo shown on the site, attributed as its license requires. */
function usedPhotos(): Photo[] {
  const all = [
    photos.hero,
    ...destinations.flatMap((d) => [d.image, ...d.gallery]),
    ...stays.map((s) => s.image),
    ...tours.map((t) => t.image),
  ];
  return [...new Map(all.map((p) => [p.page, p])).values()].sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export default function CreditsPage() {
  const list = usedPhotos();
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
      <div className="grid gap-2">
        <Heading level={1} size="2xl">
          Photo credits
        </Heading>
        <Text variant="muted" className="max-w-2xl">
          All {list.length} photos on this demo come from Wikimedia Commons and are used under the
          free licenses listed below. Hotels and tours are fictional; their photos show the real
          places they are set in.
        </Text>
      </div>
      <Suspense>
        <CreditsGallery photos={list} />
      </Suspense>
    </div>
  );
}
