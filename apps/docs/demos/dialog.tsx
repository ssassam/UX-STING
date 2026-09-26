"use client";
import { Button } from "@unified-ui/react/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unified-ui/react/dialog";
import { Field } from "@unified-ui/react/field";
import { Input } from "@unified-ui/react/input";
import { Textarea } from "@unified-ui/react/textarea";

export function Basic() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit business</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit business</DialogTitle>
          <DialogDescription>Changes are visible after review.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4">
          <Field label="Name">
            <Input defaultValue="Café Atlas" />
          </Field>
          <Field label="Description">
            <Textarea defaultValue="Specialty coffee and pastries in the heart of Gauthier." />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>
                Dialogs never exceed the viewport and scroll their body.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              {Array.from({ length: 12 }, (_, i) => (
                <p key={i} className="py-2">
                  Paragraph {i + 1}
                </p>
              ))}
            </DialogBody>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

export function Nested() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Open settings</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open nested dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Nested</DialogTitle>
                <DialogDescription>Escape closes only this one.</DialogDescription>
              </DialogHeader>
              <DialogFooter />
            </DialogContent>
          </Dialog>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
