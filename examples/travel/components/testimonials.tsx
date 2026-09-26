"use client";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ux-sting/react/carousel";
import { ReviewCard } from "@ux-sting/react/review-card";
import { testimonials } from "../lib/data";

export function Testimonials() {
  return (
    <Carousel label="Traveller reviews" loop>
      <CarouselContent itemsPerView={3}>
        {testimonials.map((t, i) => (
          <CarouselItem key={t.name} index={i} className="h-full">
            <ReviewCard
              className="h-full"
              author={{ name: t.name, subtitle: t.trip }}
              rating={t.rating}
              date={{ display: t.display, dateTime: t.date }}
              body={t.body}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-end gap-2">
        <CarouselDots className="me-auto mt-0" />
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
