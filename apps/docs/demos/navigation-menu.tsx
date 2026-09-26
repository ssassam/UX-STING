"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@unified-ui/react/navigation-menu";

const categories = [
  ["Restaurants", "Dine in, take away and delivery"],
  ["Cafés", "Coffee, brunch and work-friendly spots"],
  ["Hotels", "From boutique riads to business stays"],
  ["Services", "Plumbers, tutors, salons and more"],
];

export function Basic() {
  return (
    <div className="flex min-h-72 justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[min(34rem,90vw)] gap-1 sm:grid-cols-2">
                {categories.map(([title, description]) => (
                  <li key={title}>
                    <NavigationMenuLink href="#">
                      <span className="block font-medium">{title}</span>
                      <span className="block text-muted-foreground">{description}</span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle}>
              Events
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
