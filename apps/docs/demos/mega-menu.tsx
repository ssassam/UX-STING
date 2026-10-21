"use client";
import { MegaMenu, type MegaMenuItem } from "@ux-sting/react/mega-menu";
import { img } from "./_data";

const items: MegaMenuItem[] = [
  {
    label: "Home",
    allHref: "#home",
    allLabel: "Shop all home",
    columns: [
      {
        title: "Living",
        links: [
          { label: "Rugs", href: "#rugs", description: "Handwoven in the Atlas" },
          { label: "Cushions", href: "#cushions" },
          { label: "Lighting", href: "#lighting" },
        ],
      },
      {
        title: "Kitchen",
        links: [
          { label: "Tagines", href: "#tagines" },
          { label: "Tea sets", href: "#tea" },
          { label: "Tableware", href: "#tableware" },
        ],
      },
      {
        title: "Bath",
        links: [
          { label: "Hammam towels", href: "#towels" },
          { label: "Black soap", href: "#soap" },
        ],
      },
    ],
    featured: (
      <a
        href="#new"
        className="group grid gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={img("photo-1600166898405-da9535204843", 400)}
          alt=""
          className="aspect-[4/3] w-full rounded-md bg-muted object-cover"
        />
        <span className="text-sm font-semibold">New: the Ourika rug collection</span>
      </a>
    ),
  },
  {
    label: "Beauty",
    columns: [
      {
        title: "Care",
        links: [
          { label: "Argan oil", href: "#argan" },
          { label: "Rose water", href: "#rose" },
        ],
      },
    ],
  },
  { label: "Gifts", href: "#gifts" },
  { label: "Sale", href: "#sale" },
];

export function Default() {
  return (
    <div className="flex min-h-80 items-start justify-between gap-4">
      <MegaMenu items={items} label="Shop" currentHref="#gifts" />
    </div>
  );
}
