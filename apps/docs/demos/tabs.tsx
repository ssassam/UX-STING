"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unified-ui/react/tabs";

function Demo({ variant }: { variant: "line" | "pills" | "enclosed" }) {
  return (
    <Tabs defaultValue="overview" variant={variant}>
      <TabsList aria-label="Business sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="photos" disabled>
          Photos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Open daily from 8 am. Terrace seating.
      </TabsContent>
      <TabsContent value="menu" className="text-sm text-muted-foreground">
        Breakfast, lunch and pastries.
      </TabsContent>
      <TabsContent value="reviews" className="text-sm text-muted-foreground">
        4.6 average from 128 reviews.
      </TabsContent>
    </Tabs>
  );
}

export function Line() {
  return <Demo variant="line" />;
}

export function Pills() {
  return <Demo variant="pills" />;
}

export function Enclosed() {
  return <Demo variant="enclosed" />;
}

export function Vertical() {
  return (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList aria-label="Settings">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="text-sm">
        Profile settings
      </TabsContent>
      <TabsContent value="billing" className="text-sm">
        Billing settings
      </TabsContent>
      <TabsContent value="team" className="text-sm">
        Team settings
      </TabsContent>
    </Tabs>
  );
}
