import { CompassIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        size="lg"
        headingLevel={1}
        icon={<CompassIcon />}
        title="This page took a wrong turn"
        description="The page you're looking for doesn't exist or has moved."
        actions={
          <Button asChild>
            <NextLink href="/">Back to home</NextLink>
          </Button>
        }
      />
    </div>
  );
}
