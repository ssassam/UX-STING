import { Heading, Text } from "@ux-sting/react/typography";
import { Suspense } from "react";
import { CreditsGallery } from "../../components/credits-gallery";
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
        <Heading level={1} size="2xl">
          Photo credits
        </Heading>
        <Text variant="muted" className="max-w-2xl">
          All {list.length} photos come from Wikimedia Commons and are used under the free licenses
          listed below. Maison Nord is a fictional brand; products and makers are invented.
        </Text>
      </div>
      <Suspense>
        <CreditsGallery photos={list} />
      </Suspense>
    </div>
  );
}
