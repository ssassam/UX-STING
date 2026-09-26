"use client";
import { PlusIcon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { Combobox } from "@unified-ui/react/combobox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unified-ui/react/dialog";
import { Field } from "@unified-ui/react/field";
import { Form, FormErrorSummary } from "@unified-ui/react/form";
import { Input } from "@unified-ui/react/input";
import { NumberInput } from "@unified-ui/react/number-input";
import { Textarea } from "@unified-ui/react/textarea";
import { toast } from "@unified-ui/react/toast";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const categories = ["Hotel", "Riad", "Apartment", "Guesthouse", "Hostel"].map((c) => ({
  value: c.toLowerCase(),
  label: c,
}));

export function NewListingDialog() {
  const params = useSearchParams();
  const [open, setOpen] = useState(params.get("new") === "1");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button startIcon={<PlusIcon />}>New listing</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <Form
          className="contents"
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 700));
            setOpen(false);
            toast.success("Listing created", { description: String(values.name) });
          }}
        >
          <DialogHeader>
            <DialogTitle>New listing</DialogTitle>
            <DialogDescription>Listings are reviewed within 24 hours.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <FormErrorSummary />
            <Field name="name" label="Name" required>
              <Input autoComplete="off" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" required>
                <Combobox name="category" options={categories} placeholder="Choose a category" />
              </Field>
              <Field label="Price per night (€)">
                <NumberInput min={0} step={5} defaultValue={120} />
              </Field>
            </div>
            <Field
              name="description"
              label="Description"
              description="What makes this place special?"
            >
              <Textarea autoResize maxLength={400} showCount />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create listing</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
