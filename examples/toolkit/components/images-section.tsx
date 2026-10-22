import { Badge } from "@ux-sting/react/badge";
import { allCredits, imageHits } from "../lib/data";
import { Command } from "./command";
import { Section } from "./section";

const LICENSE: Record<string, string> = {
  cc0: "CC0",
  pdm: "Public domain",
  by: "CC BY",
  "by-sa": "CC BY-SA",
};

export function ImagesSection() {
  const used = new Set(allCredits.map((c) => c.id));
  return (
    <Section
      id="images"
      number="03"
      kicker="Open images"
      title="Real pictures, with the paperwork done."
      intro={
        <p>
          Stock photos and fake screenshots are what make a page look generated. This searches The
          Met, Wikimedia Commons and Openverse, keeps only public domain, CC0, CC BY and CC BY-SA,
          downloads what you pick and writes a credits file. All three images on this page came from
          it.
        </p>
      }
    >
      <div className="grid gap-10">
        <Command>
          npx ux-sting images &quot;drawing instruments&quot; --source met --download 1
        </Command>
        <div className="grid gap-3">
          <h3 className="font-display text-2xl">Search results</h3>
          <ol className="ledger border-y border-border">
            {imageHits.map((h, i) => (
              <li
                key={h.id}
                className="grid gap-1 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-sm text-muted-foreground">{i + 1}</span>
                <span className="min-w-0">
                  <a href={h.landingUrl} className="underline-offset-2 hover:underline">
                    {h.title}
                  </a>
                  <span className="text-muted-foreground"> — {h.creator ?? "Unknown maker"}</span>
                </span>
                <span className="flex gap-2">
                  <Badge variant="outline" size="sm">
                    {LICENSE[h.license] ?? h.license}
                  </Badge>
                  {used.has(h.id) ? (
                    <Badge variant="primary" size="sm">
                      used here
                    </Badge>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3">
          <h3 className="font-display text-2xl">The credits it wrote</h3>
          <p className="text-muted-foreground">
            From <code>credits.json</code>, rendered as-is. CC BY and BY-SA images carry the
            attribution they require; CC0 credits are a courtesy.
          </p>
          <ul className="grid gap-2 text-sm">
            {allCredits.map((c) => (
              <li key={c.id} className="rounded-sm border border-border bg-surface p-3">
                {c.credit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
