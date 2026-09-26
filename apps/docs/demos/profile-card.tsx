"use client";
import { Button } from "@ux-sting/react/button";
import { VerifiedBadge } from "@ux-sting/react/premium-badge";
import { ProfileCard } from "@ux-sting/react/profile-card";

export function Layouts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ProfileCard
        name="Yasmine Benali"
        avatar="https://i.pravatar.cc/200?img=47"
        cover="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=60"
        subtitle="Local guide · Casablanca"
        badges={<VerifiedBadge size="sm" />}
        stats={[
          { label: "Reviews", value: "214" },
          { label: "Photos", value: "1.2k" },
          { label: "Followers", value: "860" },
        ]}
        actions={
          <>
            <Button size="sm">Follow</Button>
            <Button size="sm" variant="outline">
              Message
            </Button>
          </>
        }
      />
      <ProfileCard
        layout="horizontal"
        name="Atlas Loom"
        subtitle="Seller since 2019"
        bio="Handwoven rugs from the Middle Atlas, made to order."
        stats={[
          { label: "Sales", value: "3,410" },
          { label: "Rating", value: "4.9" },
        ]}
      />
    </div>
  );
}
