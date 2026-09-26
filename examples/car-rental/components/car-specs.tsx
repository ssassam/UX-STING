import { CogIcon, DoorOpenIcon, FuelIcon, LuggageIcon, UsersIcon, ZapIcon } from "@ux-sting/icons";
import type { Car } from "../lib/data";

/** Compact spec row: seats, bags, doors, gearbox and fuel (icons + text). */
export function CarSpecs({ car, className = "" }: { car: Car; className?: string }) {
  const items = [
    { icon: <UsersIcon />, label: `${car.seats} seats` },
    { icon: <LuggageIcon />, label: `${car.bags} bags` },
    { icon: <DoorOpenIcon />, label: `${car.doors} doors` },
    { icon: <CogIcon />, label: car.transmission },
    {
      icon: car.fuel === "Electric" ? <ZapIcon /> : <FuelIcon />,
      label: car.rangeKm ? `${car.rangeKm} km range` : car.fuel,
    },
  ];
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-muted-foreground ${className}`}>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0">
          <span aria-hidden>{i.icon}</span>
          {i.label}
        </li>
      ))}
    </ul>
  );
}
