import { ShoppingBagIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        size="lg"
        headingLevel={1}
        icon={<ShoppingBagIcon />}
        title="Nothing on this shelf"
        description="This page doesn't exist. It may have sold out or moved."
        actions={
          <Button asChild>
            <NextLink href="/">Back to home</NextLink>
          </Button>
        }
      />
    </div>
  );
}
