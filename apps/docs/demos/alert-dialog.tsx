"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ux-sting/react/alert-dialog";
import { Button } from "@ux-sting/react/button";
import { toast } from "@ux-sting/react/toast";

export function Destructive() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete listing</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “Café Atlas”?</AlertDialogTitle>
          <AlertDialogDescription>
            The listing, its photos and 128 reviews will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep listing</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              toast("Listing deleted", {
                action: { label: "Undo", onClick: () => toast.success("Restored") },
              })
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
