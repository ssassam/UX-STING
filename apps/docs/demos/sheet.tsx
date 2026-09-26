"use client";
import { Button } from "@unified-ui/react/button";
import { Checkbox } from "@unified-ui/react/checkbox";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@unified-ui/react/sheet";

export function Sides() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["start", "end", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Side: {side} (logical — flips in RTL)</SheetDescription>
            </SheetHeader>
            <SheetBody className="grid gap-3">
              <Checkbox label="Open now" />
              <Checkbox label="Top rated" />
              <Checkbox label="Accepts cards" />
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button>Apply</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
