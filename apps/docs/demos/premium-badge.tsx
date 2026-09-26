"use client";
import { FeaturedBadge, PremiumBadge, VerifiedBadge } from "@unified-ui/react/premium-badge";

export function Basic() {
  return (
    <div className="flex flex-wrap gap-2">
      <PremiumBadge />
      <VerifiedBadge />
      <FeaturedBadge>New</FeaturedBadge>
      <PremiumBadge size="sm">Pro</PremiumBadge>
    </div>
  );
}
