import { ChartCandlestickIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        size="lg"
        headingLevel={1}
        icon={<ChartCandlestickIcon />}
        title="Page not found"
        description="This asset or page isn't tracked."
        actions={
          <Button asChild>
            <NextLink href="/">Back to markets</NextLink>
          </Button>
        }
      />
    </div>
  );
}
