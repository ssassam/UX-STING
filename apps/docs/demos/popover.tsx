"use client";
import { Button } from "@ux-sting/react/button";
import { Field } from "@ux-sting/react/field";
import { Input } from "@ux-sting/react/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@ux-sting/react/popover";

export function Basic() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set dimensions</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Dimensions" className="grid gap-3">
        <p className="text-sm font-medium">Dimensions</p>
        <Field label="Width">
          <Input size="sm" defaultValue="100%" />
        </Field>
        <Field label="Height">
          <Input size="sm" defaultValue="auto" />
        </Field>
        <PopoverClose asChild>
          <Button size="sm">Done</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
