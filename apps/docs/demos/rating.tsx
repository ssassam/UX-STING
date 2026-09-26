"use client";
import { useState } from "react";
import { Rating, ReviewStars } from "@unified-ui/react/rating";

export function Interactive() {
  const [value, setValue] = useState(3);
  return (
    <div className="grid gap-2">
      <Rating label="Rate your visit" value={value} onValueChange={setValue} />
      <p className="text-sm text-muted-foreground">You chose {value} of 5</p>
    </div>
  );
}

export function ReadOnly() {
  return (
    <div className="grid gap-2">
      <ReviewStars value={4.5} showValue count={1284} />
      <ReviewStars value={3.2} size="sm" showValue />
      <ReviewStars value={5} size="xl" />
    </div>
  );
}
