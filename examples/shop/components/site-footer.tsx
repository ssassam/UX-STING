import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { categories } from "../lib/data";
import { DemoLinks } from "./demo-links";
import { Newsletter } from "./newsletter";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))]">
        <div className="col-span-2 grid content-start gap-3 md:col-span-1">
          <p className="font-serif text-2xl">Maison Nord</p>
          <Text variant="muted" size="sm" className="max-w-sm">
            Slow objects for everyday rituals, made by independent workshops. Letters once a month.
          </Text>
          <Newsletter />
        </div>
        <nav aria-label="Shop" className="grid content-start gap-3">
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="grid gap-2 text-sm">
            {[
              ...categories.map((c) => [c.name, `/shop?category=${c.id}`]),
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
        <DemoLinks current="shop" />
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>© 2026 Maison Nord. Demo template — no orders are taken.</p>
        <p>
          Built with the{" "}
          <a
            href="https://github.com/ssassam/UX-STING"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm font-medium text-foreground underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            UX-STING design system
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
