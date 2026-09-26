import { CarIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        size="lg"
        headingLevel={1}
        icon={<CarIcon />}
        title="Wrong turn"
        description="This page doesn't exist. Let's get you back on the road."
        actions={
          <Button asChild>
            <NextLink href="/">Back to home</NextLink>
          </Button>
        }
      />
    </div>
  );
}
