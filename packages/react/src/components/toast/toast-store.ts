import type { ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss; `Infinity` keeps it open. Default 5000. */
  duration?: number;
  action?: ToastAction;
  /** Secondary action, e.g. "Dismiss". */
  cancel?: ToastAction;
  icon?: ReactNode;
  onDismiss?: (id: string) => void;
}

export interface ToastData extends ToastOptions {
  id: string;
  title: ReactNode;
  variant: ToastVariant;
  createdAt: number;
  open: boolean;
}

type Listener = (toasts: ToastData[]) => void;

let counter = 0;

/**
 * Creates an isolated toast store. The default `toast` export uses a shared
 * store; create your own for micro-frontends or tests.
 */
export function createToaster() {
  let toasts: ToastData[] = [];
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l(toasts));

  const upsert = (title: ReactNode, options: ToastOptions = {}): string => {
    const id = options.id ?? `toast-${++counter}`;
    const existing = toasts.find((t) => t.id === id);
    const next: ToastData = {
      ...existing,
      ...options,
      id,
      title,
      variant: options.variant ?? existing?.variant ?? "default",
      createdAt: existing?.createdAt ?? Date.now(),
      open: true,
    };
    toasts = existing ? toasts.map((t) => (t.id === id ? next : t)) : [...toasts, next];
    emit();
    return id;
  };

  const dismiss = (id?: string) => {
    toasts = toasts.map((t) => (id === undefined || t.id === id ? { ...t, open: false } : t));
    emit();
    toasts.filter((t) => !t.open).forEach((t) => t.onDismiss?.(t.id));
  };

  const remove = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  };

  const variant =
    (v: ToastVariant) => (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
      upsert(title, { ...options, variant: v });

  const toast = Object.assign(
    (title: ReactNode, options?: ToastOptions) => upsert(title, options),
    {
      success: variant("success"),
      error: variant("error"),
      warning: variant("warning"),
      info: variant("info"),
      loading: (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
        upsert(title, { duration: Infinity, ...options, variant: "loading" }),
      /** Shows loading, then success/error when the promise settles. */
      promise: <T>(
        promise: Promise<T>,
        messages: {
          loading: ReactNode;
          success: ReactNode | ((value: T) => ReactNode);
          error: ReactNode | ((error: unknown) => ReactNode);
        },
      ) => {
        const id = upsert(messages.loading, { variant: "loading", duration: Infinity });
        promise.then(
          (value) =>
            upsert(
              typeof messages.success === "function" ? messages.success(value) : messages.success,
              { id, variant: "success", duration: 5000 },
            ),
          (error) =>
            upsert(typeof messages.error === "function" ? messages.error(error) : messages.error, {
              id,
              variant: "error",
              duration: 8000,
            }),
        );
        return promise;
      },
      dismiss,
    },
  );

  return {
    toast,
    remove,
    getToasts: () => toasts,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type ToasterStore = ReturnType<typeof createToaster>;

export const defaultToaster = createToaster();

/** Show a notification: `toast.success("Saved", { action: { label: "Undo", onClick } })`. */
export const toast = defaultToaster.toast;
