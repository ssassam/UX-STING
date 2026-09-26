"use client";
import { Avatar, AvatarGroup } from "@ux-sting/react/avatar";
import { Button } from "@ux-sting/react/button";
import { EventCard } from "@ux-sting/react/event-card";
import { FeaturedBadge } from "@ux-sting/react/premium-badge";
import { Price } from "@ux-sting/react/price";
import { img } from "./_data";

export function Basic() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <EventCard
        href="#"
        title="Jazz under the stars"
        start={new Date(2026, 5, 14, 20, 0)}
        end={new Date(2026, 5, 14, 23, 0)}
        venue="Villa des Arts, Casablanca"
        image={{
          src: img("photo-1415201364774-f6f0bb35f28f", 700),
          alt: "Saxophone player on stage",
        }}
        badges={<FeaturedBadge size="sm" />}
        price={<Price amount={150} currency="MAD" />}
        attendees={
          <AvatarGroup max={3} size="xs">
            {[5, 12, 32, 45].map((i) => (
              <Avatar key={i} name={`Guest ${i}`} src={`https://i.pravatar.cc/60?img=${i}`} />
            ))}
          </AvatarGroup>
        }
        action={
          <Button size="sm" fullWidth>
            Get tickets
          </Button>
        }
      />
      <EventCard
        href="#"
        title="Pottery workshop for beginners"
        start={new Date(2026, 5, 20, 10, 0)}
        end={new Date(2026, 5, 20, 12, 30)}
        venue="Atelier Safi, Rabat"
        price={<Price amount={35} currency="EUR" />}
      />
    </div>
  );
}
