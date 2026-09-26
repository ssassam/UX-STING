"use client";
import { useState } from "react";
import { Checkbox } from "@ux-sting/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@ux-sting/react/filter-panel";
import { Rating } from "@ux-sting/react/rating";
import { RangeSlider } from "@ux-sting/react/slider";
import { Switch } from "@ux-sting/react/switch";

const options = ["Wi-Fi", "Terrace", "Parking", "Pet friendly"];

export function Panel() {
  const [amenities, setAmenities] = useState<string[]>(["Wi-Fi"]);
  const [openNow, setOpenNow] = useState(true);
  const chips = [
    ...(openNow ? [{ id: "open", label: "Open now" }] : []),
    ...amenities.map((a) => ({ id: a, label: a })),
  ];
  const clear = () => {
    setAmenities([]);
    setOpenNow(false);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <FilterPanel activeCount={chips.length} onClear={clear}>
        <FilterSection title="Availability">
          <Switch label="Open now" checked={openNow} onCheckedChange={setOpenNow} />
        </FilterSection>
        <FilterSection title="Price per person">
          <RangeSlider
            defaultValue={[10, 60]}
            max={120}
            thumbLabels={["Minimum", "Maximum"]}
            formatValue={(v) => `€${v}`}
            showValue
          />
        </FilterSection>
        <FilterSection title="Amenities" activeCount={amenities.length}>
          {options.map((o) => (
            <Checkbox
              key={o}
              label={o}
              checked={amenities.includes(o)}
              onCheckedChange={(v) =>
                setAmenities(v === true ? [...amenities, o] : amenities.filter((a) => a !== o))
              }
            />
          ))}
        </FilterSection>
        <FilterSection title="Minimum rating" defaultOpen={false}>
          <Rating label="Minimum rating" size="md" />
        </FilterSection>
      </FilterPanel>
      <div className="grid content-start gap-3">
        <FilterChips
          filters={chips}
          onRemove={(id) =>
            id === "open" ? setOpenNow(false) : setAmenities(amenities.filter((a) => a !== id))
          }
          onClearAll={clear}
        />
        <p className="text-sm text-muted-foreground">
          Results update as filters change. On small screens the panel opens as a bottom sheet.
        </p>
      </div>
    </div>
  );
}
