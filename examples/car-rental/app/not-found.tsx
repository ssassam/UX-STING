import { AnimatedIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import { ArrowLeftIcon, CarIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="roadbook-label mb-3 flex items-center gap-2 text-primary">
        <span aria-hidden className="route-line inline-block h-10 w-px overflow-hidden">
          <span className="route-line-fill" />
        </span>
        Mile marker unknown
      </p>
      <EmptyState
        size="lg"
        headingLevel={1}
        icon={<CarIcon />}
        title="Wrong turn"
        description="This road is not on our map. The fleet is still at the six desks, so let's get you back on it."
        actions={
          <>
            <Button asChild>
              <NextLink href="/">Back to home</NextLink>
            </Button>
            <Button asChild variant="outline">
              <NextLink href="/cars">Browse the fleet</NextLink>
            </Button>
          </>
        }
      />
      <p
        className={`${ICON_ANCHOR_CLASS} mt-8 flex items-center gap-2 text-sm text-muted-foreground`}
      >
        <AnimatedIcon icon={ArrowLeftIcon} preset="shift" className="size-4 text-primary" />
        Or use the browser's back button — nothing was lost.
      </p>
    </div>
  );
}
