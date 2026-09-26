"use client";
import { useControllableState } from "@ux-sting/hooks";
import { FileIcon, UploadCloudIcon, XIcon } from "@ux-sting/icons";
import { cn, formatFileSize } from "@ux-sting/utils";
import { forwardRef, useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { useFieldControlProps } from "../../lib/field.js";
import { useLocale, useMessages } from "../../provider/context.js";
import { Progress } from "../progress/progress.js";

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
}

export interface DropzoneProps {
  /** Accepted types, e.g. `"image/*,.pdf"`. */
  accept?: string;
  multiple?: boolean;
  /** Max size per file in bytes. */
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  invalid?: boolean;
  onFilesAccepted?: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /** Main prompt text. */
  label?: ReactNode;
  /** Hint text: types and limits. */
  description?: ReactNode;
  name?: string;
  id?: string;
  className?: string;
  children?: ReactNode;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith(".")) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith("/*")) return file.type.toLowerCase().startsWith(r.slice(0, -1));
    return file.type.toLowerCase() === r;
  });
}

export function validateFiles(
  files: File[],
  { accept, maxSize, maxFiles }: Pick<DropzoneProps, "accept" | "maxSize" | "maxFiles">,
) {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) rejected.push({ file, reason: "type" });
    else if (maxSize && file.size > maxSize) rejected.push({ file, reason: "size" });
    else if (maxFiles && accepted.length >= maxFiles) rejected.push({ file, reason: "count" });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/**
 * Drag-and-drop area that is also a regular button/file input, so it works
 * with keyboard, screen readers and touch (drag is never required).
 */
export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  {
    accept,
    multiple = true,
    maxSize,
    maxFiles,
    disabled,
    invalid,
    onFilesAccepted,
    onFilesRejected,
    label,
    description,
    name,
    id,
    className,
    children,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const messages = useMessages();
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined });
  const descId = useId();

  const handle = (list: FileList | null) => {
    if (!list || disabled) return;
    const { accepted, rejected } = validateFiles(Array.from(list), {
      accept,
      maxSize,
      maxFiles: multiple ? maxFiles : 1,
    });
    if (accepted.length) onFilesAccepted?.(accepted);
    if (rejected.length) onFilesRejected?.(rejected);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handle(e.dataTransfer.files);
  };

  return (
    <div
      ref={ref}
      data-dragging={dragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-surface px-6 py-8 text-center transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 data-dragging:border-primary data-dragging:bg-primary-subtle",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60 has-[[aria-invalid=true]]:border-destructive",
        className,
      )}
    >
      {children ?? (
        <>
          <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs [&_svg]:size-5">
            <UploadCloudIcon />
          </span>
          <p className="text-sm font-medium">{label ?? messages.dropFiles}</p>
          {description ? (
            <p id={descId} className="text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </>
      )}
      <button
        type="button"
        disabled={fieldProps.disabled}
        onClick={() => inputRef.current?.click()}
        aria-describedby={
          cn(fieldProps["aria-describedby"], description ? descId : undefined) || undefined
        }
        className="mt-1 rounded-md text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring after:absolute after:inset-0"
        id={fieldProps.id}
      >
        {messages.browseFiles}
      </button>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        aria-invalid={fieldProps["aria-invalid"]}
        className="sr-only"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
});

export interface UploadItem {
  id: string;
  file: File;
  /** 0–100; omit when not uploading. */
  progress?: number;
  status?: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export interface FileUploadProps extends Omit<DropzoneProps, "onFilesAccepted"> {
  value?: UploadItem[];
  defaultValue?: UploadItem[];
  onValueChange?: (items: UploadItem[]) => void;
  /** Called with newly added items (start uploads here). */
  onAdd?: (items: UploadItem[]) => void;
}

let uploadCounter = 0;

/** Dropzone plus a managed file list with progress, errors and removal. */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { value: valueProp, defaultValue = [], onValueChange, onAdd, className, ...props },
  ref,
) {
  const [items, setItems] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const { locale } = useLocale();
  const messages = useMessages();
  return (
    <div ref={ref} className={cn("grid grid-cols-[minmax(0,1fr)] gap-3", className)}>
      <Dropzone
        {...props}
        onFilesAccepted={(files) => {
          const added = files.map((file) => ({
            id: `upload-${++uploadCounter}`,
            file,
            status: "pending" as const,
          }));
          setItems([...(props.multiple === false ? [] : items), ...added]);
          onAdd?.(added);
        }}
      />
      {items.length ? (
        <ul className="grid gap-2" aria-live="polite">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
                <FileIcon />
              </span>
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{item.file.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatFileSize(item.file.size, locale)}
                  </span>
                </div>
                {item.status === "uploading" ? (
                  <Progress size="xs" value={item.progress ?? null} aria-label={item.file.name} />
                ) : null}
                {item.status === "error" ? (
                  <span className="text-xs font-medium text-destructive">{item.error}</span>
                ) : null}
              </div>
              <button
                type="button"
                aria-label={messages.removeItem(item.file.name)}
                onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                className="ui-hit-area inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4"
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
