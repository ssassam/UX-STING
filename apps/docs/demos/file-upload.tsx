"use client";
import { useState } from "react";
import { FileUpload, type UploadItem } from "@ux-sting/react/file-upload";

export function Basic() {
  const [items, setItems] = useState<UploadItem[]>([]);
  return (
    <FileUpload
      className="max-w-lg"
      accept="image/*,.pdf"
      maxSize={5 * 1024 * 1024}
      description="PNG, JPG or PDF up to 5 MB"
      value={items}
      onValueChange={setItems}
      onAdd={(added) => {
        for (const item of added) {
          let progress = 0;
          const tick = setInterval(() => {
            progress += 20;
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? { ...i, status: progress >= 100 ? "done" : "uploading", progress }
                  : i,
              ),
            );
            if (progress >= 100) clearInterval(tick);
          }, 300);
        }
      }}
    />
  );
}
