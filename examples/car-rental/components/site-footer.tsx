import { CarIcon } from "@ux-sting/icons";
import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { DemoLinks } from "./demo-links";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
        <div className="col-span-2 grid content-start gap-3 md:col-span-1">
          <NextLink
            href="/"
            className="flex w-fit items-center gap-2 rounded-sm text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CarIcon className="size-6 text-primary" aria-hidden /> Drivo
          </NextLink>
          <Text variant="muted" size="sm" className="max-w-xs">
            Car rental with unlimited kilometres, free cancellation up to 48 hours and no queue at
            the counter.
          </Text>
        </div>
        <nav aria-label="Drivo" className="grid content-start gap-3">
          <h2 className="text-sm font-semibold">Drivo</h2>
          <ul className="grid gap-2 text-sm">
            {[
              ["Our fleet", "/cars"],
              ["Electric cars", "/cars?category=electric"],
              ["Locations", "/#locations"],
              ["Photo credits", "/credits"],
            ].map(([label, href]) => (
              <li key={label}>
                <NextLink
                  href={href!}
                  className="rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
        <DemoLinks current="cars" />
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>© 2026 Drivo. Demo template — no real bookings are made.</p>
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
