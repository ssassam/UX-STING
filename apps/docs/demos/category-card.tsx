"use client";
import { CategoryCard, CityCard } from "@unified-ui/react/category-card";
import { BedIcon, CoffeeIcon, DumbbellIcon, UtensilsIcon } from "@unified-ui/icons";
import { img } from "./_data";

export function Categories() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <CategoryCard href="#" name="Restaurants" count="1,204 places" icon={<UtensilsIcon />} />
      <CategoryCard href="#" name="Cafés" count="468 places" icon={<CoffeeIcon />} />
      <CategoryCard href="#" name="Hotels" count="212 places" icon={<BedIcon />} />
      <CategoryCard href="#" name="Fitness" count="96 places" icon={<DumbbellIcon />} />
    </div>
  );
}

export function Cities() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <CityCard
        href="#"
        name="Casablanca"
        count="3,120 places"
        image={{ src: img("photo-1539020140153-e479b8c22e70", 500), alt: "" }}
      />
      <CityCard
        href="#"
        name="Marrakech"
        count="2,480 places"
        image={{ src: img("photo-1597212618440-806262de4f6b", 500), alt: "" }}
      />
      <CityCard
        href="#"
        name="Tangier"
        count="1,020 places"
        image={{ src: img("photo-1553603227-2358aabe821e", 500), alt: "" }}
      />
    </div>
  );
}
