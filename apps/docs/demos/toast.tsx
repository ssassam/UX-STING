"use client";
import { Button } from "@unified-ui/react/button";
import { toast } from "@unified-ui/react/toast";

export function Variants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Draft saved")}>Default</Button>
      <Button variant="outline" onClick={() => toast.success("Listing published", { description: "Now visible in search." })}>Success</Button>
      <Button variant="outline" onClick={() => toast.info("New review received")}>Info</Button>
      <Button variant="outline" onClick={() => toast.warning("Photo is low resolution")}>Warning</Button>
      <Button variant="outline" onClick={() => toast.error("Could not save", { description: "Check your connection and retry." })}>Error</Button>
    </div>
  );
}

export function Actions() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Review archived", {
          action: { label: "Undo", onClick: () => toast.success("Review restored") },
        })
      }
    >
      Archive with undo
    </Button>
  );
}

export function PromiseToast() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(new Promise((resolve) => setTimeout(() => resolve("12 photos"), 1500)), {
          loading: "Uploading photos…",
          success: (v) => `Uploaded ${String(v)}`,
          error: "Upload failed",
        })
      }
    >
      Upload (promise)
    </Button>
  );
}
