import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { DrivoLogo } from "./brand";
import { DemoLinks } from "./demo-links";

const columns: { heading: string; links: [string, string][] }[] = [
  {
    heading: "Fleet",
    links: [
      ["All cars", "/cars"],
      ["Electric", "/cars?category=electric"],
      ["SUV & 4x4", "/cars?category=suv"],
      ["Vans", "/cars?category=van"],
    ],
  },
  {
    heading: "Drivo",
    links: [
      ["How a rental works", "/#stages"],
      ["Pick-up desks", "/#locations"],
      ["Driver reviews", "/#reviews"],
      ["Good to know", "/#faq"],
    ],
  },
  {
    heading: "Legal",
    links: [
      ["Photo credits", "/credits"],
      ["Cancellation", "/#faq"],
      ["Protection tiers", "/checkout"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-12 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div className="grid content-start gap-4">
          <NextLink
            href="/"
            className="w-fit rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <DrivoLogo size="lg" />
          </NextLink>
          <Text variant="muted" size="sm" className="max-w-xs">
            Car rental at the arrival hall. Six desks in France, two open around the clock,
            unlimited kilometres on every car and the keys in the app.
          </Text>
          <p className="roadbook-label text-muted-foreground">
            Nice desk · 40 min to the Col de Turini
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="grid content-start gap-3">
            <h2 className="roadbook-label text-muted-foreground">{col.heading}</h2>
            <ul className="grid gap-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <NextLink
                    href={href}
                    className="rounded-sm text-foreground/85 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <DemoLinks current="cars" />
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>© 2026 Drivo. Demo template — no real bookings are made.</p>
        <p>
          Hero photograph:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Col_de_Turini_06-_Since_Camp_d'Argent_road.jpg"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm underline underline-offset-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Col de Turini by Anthospace
            <span className="sr-only">
              {" "}
              on Wikimedia Commons, CC BY-SA 4.0 (opens in a new tab)
            </span>
          </a>
        </p>
        <p>
          Built with the{" "}
          <a
            href="https://github.com/ssassam/UX-STING"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm font-medium text-foreground underline underline-offset-2 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            UX-STING design system
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
