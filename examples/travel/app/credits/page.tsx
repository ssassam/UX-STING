import { Heading, Link, Text } from "@ux-sting/react/typography";
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
    <div className="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
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
      <ol className="grid gap-4">
        {list.map((p) => (
          <li
            key={p.page}
            className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-4 rounded-xl border border-border p-3"
          >
            <img
              src={p.src.replace("/1280px-", "/330px-")}
              alt=""
              loading="lazy"
              className="aspect-4/3 w-20 rounded-md bg-muted object-cover"
            />
            <div className="grid min-w-0 gap-1 text-sm">
              <p className="font-medium [overflow-wrap:anywhere]">{p.alt}</p>
              <p className="text-muted-foreground [overflow-wrap:anywhere]">
                <Link href={p.page} external externalLabel="(opens Wikimedia Commons)">
                  {p.title}
                </Link>{" "}
                by {p.author},{" "}
                {p.licenseUrl ? (
                  <Link href={p.licenseUrl} external externalLabel="(license, opens in a new tab)">
                    {p.license}
                  </Link>
                ) : (
                  p.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
