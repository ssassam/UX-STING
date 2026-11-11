import { Button } from "@ux-sting/react/button";
import { Heading, Text } from "@ux-sting/react/typography";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { withBase } from "../lib/base";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-3xl content-center gap-5 px-4 py-24 outline-none sm:px-6"
      >
        <span className="spec-label text-primary">Check failed · 404</span>
        <Heading level={1} size="3xl">
          This page did not pass inspection.
        </Heading>
        <Text size="lg" variant="muted">
          The address may be mistyped, or the page moved. The Wayfare travel demo now lives at
          /travel/.
        </Text>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={withBase("/")}>Back to UX-STING</a>
          </Button>
          <Button asChild variant="outline">
            <a href={withBase("/travel/")}>Open Wayfare</a>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
