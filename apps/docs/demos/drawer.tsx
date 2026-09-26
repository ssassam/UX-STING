"use client";
import { Button } from "@unified-ui/react/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@unified-ui/react/drawer";

export function Basic() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Share place</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share Café Atlas</DrawerTitle>
          <DrawerDescription>
            Drag the handle down, press Escape or use the button to close.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="grid grid-cols-4 gap-3 text-center text-xs">
          {["Copy link", "Message", "Email", "More"].map((a) => (
            <button
              key={a}
              type="button"
              className="grid justify-items-center gap-2 rounded-lg p-2 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="size-10 rounded-full bg-muted" aria-hidden />
              {a}
            </button>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
