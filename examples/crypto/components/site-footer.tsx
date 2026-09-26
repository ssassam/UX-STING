import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { DemoLinks } from "./demo-links";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-2">
          <p className="text-lg font-bold">Chainlens</p>
          <Text size="sm" variant="muted" className="max-w-lg">
            All prices, charts and headlines on this site are generated sample data for a UX-STING
            template. They are not real market data and are not financial advice.
          </Text>
          <NextLink
            href="/credits"
            className="w-fit rounded-sm text-sm text-muted-foreground underline underline-offset-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Photo credits
          </NextLink>
        </div>
        <DemoLinks current="crypto" />
      </div>
      <Separator />
      <p className="mx-auto max-w-screen-2xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
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
    </footer>
  );
}
