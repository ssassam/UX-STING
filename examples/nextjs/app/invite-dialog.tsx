"use client";
import { Button } from "@/components/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/components/dialog";
import { Field } from "@/components/ui/components/field";
import { Form, FormErrorSummary } from "@/components/ui/components/form";
import { Input } from "@/components/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/components/select";
import { toast } from "@/components/ui/components/toast";
import { useState } from "react";

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          className="contents"
          onSubmit={(values) => {
            setOpen(false);
            toast.success("Invitation sent", { description: String(values.email) });
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>They'll receive an email with a sign-up link.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <FormErrorSummary />
            <Field name="email" label="Email" required>
              <Input type="email" autoComplete="email" />
            </Field>
            <Field label="Role">
              <Select name="role" defaultValue="editor">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send invite</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
