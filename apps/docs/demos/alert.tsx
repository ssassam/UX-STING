"use client";
import { Alert, AlertActions, AlertDescription, AlertTitle, Banner } from "@unified-ui/react/alert";
import { Button } from "@unified-ui/react/button";

export function Variants() {
  return (
    <div className="grid gap-3">
      <Alert>
        <AlertTitle>New feature</AlertTitle>
        <AlertDescription>You can now reply to reviews from the dashboard.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>Sunday 02:00–03:00 UTC.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Listing published</AlertTitle>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Your plan renews in 3 days</AlertTitle>
        <AlertActions>
          <Button size="sm" variant="outline">
            Manage plan
          </Button>
        </AlertActions>
      </Alert>
      <Alert variant="destructive" live>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Update your card to keep your listing active.</AlertDescription>
      </Alert>
    </div>
  );
}

export function Banners() {
  return (
    <div className="grid gap-3 overflow-hidden rounded-lg">
      <Banner
        dismissible
        action={
          <Button size="xs" variant="secondary">
            Learn more
          </Button>
        }
      >
        Spring promotion: list your business free for 3 months.
      </Banner>
      <Banner variant="neutral" dismissible>
        We use cookies to improve your experience.
      </Banner>
    </div>
  );
}
