"use client";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
} from "@unified-ui/react/carousel";
import { Image } from "@unified-ui/react/media";
import { img } from "./_data";

const photos = [
  ["photo-1539020140153-e479b8c22e70", "Hassan II Mosque at sunset"],
  ["photo-1597212618440-806262de4f6b", "Blue streets of Chefchaouen"],
  ["photo-1489749798305-4fea3ae63d43", "Desert dunes near Merzouga"],
  ["photo-1553603227-2358aabe821e", "Spice market stall"],
];

export function Gallery() {
  return (
    <Carousel label="Featured destinations" className="max-w-xl">
      <CarouselContent>
        {photos.map(([id, alt], i) => (
          <CarouselItem key={id} index={i}>
            <Image src={img(id!, 900)} alt={alt!} ratio={16 / 9} radius="lg" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}

export function MultipleWithAutoplay() {
  return (
    <Carousel label="Photos" autoplay={4000} className="max-w-2xl">
      <CarouselContent itemsPerView={3}>
        {[...photos, ...photos].map(([id, alt], i) => (
          <CarouselItem key={i} index={i}>
            <Image src={img(id!, 500)} alt={alt!} ratio={1} radius="lg" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex items-center justify-between">
        <CarouselPlayToggle />
        <CarouselDots className="mt-0" />
      </div>
    </Carousel>
  );
}
