import { Heading, Text } from "@ux-sting/react/typography";
import { Suspense } from "react";
import { CreditsGallery, CreditsGalleryFromUrl } from "../../components/credits-gallery";
import { photos } from "../../lib/photos";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Photo credits",
  description: "Authors and licenses of the Wikimedia Commons photos used on this site.",
  path: "credits",
});

export default function CreditsPage() {
  const list = Object.values(photos).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
      <div className="grid gap-2">
        <p className="roadbook-label text-muted-foreground">
          <span className="text-primary">◆</span> Sources · every photograph is free to reuse
        </p>
        <Heading level={1} size="2xl" className="font-display tracking-tight text-balance">
          Photo credits
        </Heading>
        <Text variant="muted" className="max-w-2xl text-pretty">
          All {list.length} photos come from Wikimedia Commons and are used under the free licenses
          listed below. Drivo is a fictional brand; the cars shown are real models.
        </Text>
      </div>
      {/* Static HTML holds page 1; the `?page=` filter applies after load. */}
      <Suspense fallback={<CreditsGallery photos={list} />}>
        <CreditsGalleryFromUrl photos={list} />
      </Suspense>
    </div>
  );
}
