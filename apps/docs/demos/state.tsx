"use client";
import { Button } from "@unified-ui/react/button";
import { EmptyState, ErrorState, LoadingState, SuccessState } from "@unified-ui/react/state";
import { SearchIcon } from "@unified-ui/icons";

export function Empty() {
  return (
    <EmptyState
      icon={<SearchIcon />}
      title="No places match your filters"
      description="Try removing a filter or searching a nearby area."
      actions={
        <>
          <Button variant="outline">Clear filters</Button>
          <Button>Search nearby</Button>
        </>
      }
    />
  );
}

export function Error() {
  return (
    <ErrorState
      title="We couldn't load reviews"
      description="The server did not respond."
      actions={<Button variant="outline">Try again</Button>}
    />
  );
}

export function Success() {
  return (
    <SuccessState
      title="Your listing is live"
      description="Customers can now find you in search."
      actions={<Button>View listing</Button>}
    />
  );
}

export function Loading() {
  return (
    <LoadingState title="Preparing your report" description="This usually takes a few seconds." />
  );
}
