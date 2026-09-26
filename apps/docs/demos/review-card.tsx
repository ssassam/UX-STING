"use client";
import { Button } from "@ux-sting/react/button";
import { ReviewCard } from "@ux-sting/react/review-card";

export function Basic() {
  return (
    <ReviewCard
      className="max-w-xl"
      author={{ name: "Hamza El Idrissi", subtitle: "12 reviews · Local guide" }}
      rating={4}
      date={{ display: "2 weeks ago", dateTime: "2026-03-14" }}
      title="Great coffee, busy on weekends"
      body={
        "The flat white is excellent and the pastries are baked in-house. It gets very busy on Saturday mornings, so come early if you want a seat on the terrace. Staff were friendly and fast even with the queue. Wi-Fi works well for remote work during the week, and there are plenty of power outlets along the wall. Prices are fair for the quality."
      }
      footer={
        <div className="flex gap-2">
          <Button size="xs" variant="outline">
            Helpful (12)
          </Button>
          <Button size="xs" variant="ghost">
            Report
          </Button>
        </div>
      }
    />
  );
}
