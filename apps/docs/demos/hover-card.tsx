"use client";
import { Avatar } from "@unified-ui/react/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@unified-ui/react/hover-card";
import { Link } from "@unified-ui/react/typography";

export function Basic() {
  return (
    <p className="text-sm">
      Reviewed by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href="#">@salma</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar name="Salma Idrissi" />
            <div className="grid gap-1 text-sm">
              <p className="font-semibold">Salma Idrissi</p>
              <p className="text-muted-foreground">Local guide · 214 reviews</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
