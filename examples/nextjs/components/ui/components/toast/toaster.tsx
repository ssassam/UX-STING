"use client";
import { useHotkey } from "@ux-sting/hooks";
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useMessages } from "../../provider/context";
import { Spinner } from "../spinner/spinner";
import { defaultToaster, type ToastData, type ToasterStore } from "./toast-store";

export type ToasterPosition =
  "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";

export interface ToasterProps {
  position?: ToasterPosition;
  /** Maximum toasts visible at once; older ones queue. */
  visibleToasts?: number;
  /** Default duration in ms (3–5 s recommended). */
  duration?: number;
  /** Shortcut that moves focus to the notifications region. */
  hotkey?: string;
  toaster?: ToasterStore;
  className?: string;
}

const icons = {
  default: null,
  success: <CheckCircle2Icon className="text-success" />,
  error: <XCircleIcon className="text-destructive" />,
  warning: <AlertTriangleIcon className="text-warning-subtle-foreground" />,
  info: <InfoIcon className="text-info" />,
  loading: <Spinner size="sm" label={null} className="text-muted-foreground" />,
};

const positionClass: Record<ToasterPosition, string> = {
  "top-start": "top-0 start-0 items-start",
  "top-center": "top-0 start-1/2 -translate-x-1/2 items-center rtl:translate-x-1/2",
  "top-end": "top-0 end-0 items-end",
  "bottom-start": "bottom-0 start-0 items-start flex-col-reverse",
  "bottom-center":
    "bottom-0 start-1/2 -translate-x-1/2 items-center flex-col-reverse rtl:translate-x-1/2",
  "bottom-end": "bottom-0 end-0 items-end flex-col-reverse",
};

/**
 * Renders toasts. Toasts announce politely (never steal focus), pause while
 * hovered or focused, support actions like "Undo", and can be reached via
 * the hotkey (default Alt+T).
 */
export function Toaster({
  position = "bottom-end",
  visibleToasts = 3,
  duration = 5000,
  hotkey = "alt+t",
  toaster = defaultToaster,
  className,
}: ToasterProps) {
  const toasts = useSyncExternalStore(toaster.subscribe, toaster.getToasts, toaster.getToasts);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const regionRef = useRef<HTMLOListElement>(null);
  const messages = useMessages();
  useEffect(() => setMounted(true), []);
  useHotkey(hotkey, () => regionRef.current?.querySelector<HTMLElement>("li")?.focus(), {
    enableInInputs: true,
  });

  const visible = toasts.filter((t) => t.open).slice(-visibleToasts);
  const closing = toasts.filter((t) => !t.open);

  if (!mounted) return null;
  return createPortal(
    <section
      aria-label={`${messages.notifications} (${hotkey.replace("alt", "Alt").replace("+", "+").toUpperCase()})`}
      tabIndex={-1}
    >
      <ol
        ref={regionRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
        className={cn(
          "pointer-events-none fixed z-(--ui-z-toast) flex max-h-dvh w-full flex-col gap-2 p-4 sm:max-w-sm",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          positionClass[position],
          className,
        )}
      >
        {[...visible, ...closing].map((t) => (
          <ToastItem
            key={t.id}
            data={t}
            paused={paused}
            defaultDuration={duration}
            toaster={toaster}
          />
        ))}
      </ol>
    </section>,
    document.body,
  );
}

function ToastItem({
  data,
  paused,
  defaultDuration,
  toaster,
}: {
  data: ToastData;
  paused: boolean;
  defaultDuration: number;
  toaster: ToasterStore;
}) {
  const messages = useMessages();
  const remaining = useRef(data.duration ?? defaultDuration);
  const started = useRef(Date.now());

  useEffect(() => {
    if (!data.open) {
      const id = setTimeout(() => toaster.remove(data.id), 200);
      return () => clearTimeout(id);
    }
    if (paused || !Number.isFinite(remaining.current)) return;
    started.current = Date.now();
    const id = setTimeout(() => toaster.toast.dismiss(data.id), remaining.current);
    return () => {
      clearTimeout(id);
      remaining.current -= Date.now() - started.current;
    };
  }, [paused, data.open, data.id, toaster]);

  // Reset timer when a toast is updated (e.g. promise resolved).
  useEffect(() => {
    remaining.current = data.duration ?? defaultDuration;
  }, [data.variant, data.title, data.duration, defaultDuration]);

  const important = data.variant === "error";
  return (
    <li
      role={important ? "alert" : "status"}
      aria-live={important ? "assertive" : "polite"}
      aria-atomic
      tabIndex={0}
      data-state={data.open ? "open" : "closed"}
      data-variant={data.variant}
      className={cn(
        "ui-anim-toast pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border border-border bg-popover p-4 pe-10 text-popover-foreground shadow-lg outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
      )}
    >
      {data.icon ?? icons[data.variant]}
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="text-sm font-semibold">{data.title}</div>
        {data.description ? (
          <div className="text-sm text-muted-foreground">{data.description}</div>
        ) : null}
        {data.action || data.cancel ? (
          <div className="mt-1 flex gap-2">
            {data.action ? (
              <button
                type="button"
                onClick={() => {
                  data.action?.onClick();
                  toaster.toast.dismiss(data.id);
                }}
                className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {data.action.label}
              </button>
            ) : null}
            {data.cancel ? (
              <button
                type="button"
                onClick={() => {
                  data.cancel?.onClick();
                  toaster.toast.dismiss(data.id);
                }}
                className="inline-flex h-7 items-center rounded-md border border-border px-2.5 text-xs font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                {data.cancel.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={messages.close}
        onClick={() => toaster.toast.dismiss(data.id)}
        className="ui-hit-area absolute end-2 top-2 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5"
      >
        <XIcon />
      </button>
    </li>
  );
}
