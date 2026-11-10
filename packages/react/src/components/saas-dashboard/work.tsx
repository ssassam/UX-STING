"use client";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@ux-sting/utils";
import { Button } from "../button/index.js";

export interface BoardColumn {
  id: string;
  label: string;
}
export interface BoardItem {
  id: string;
  column: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}
export interface WorkBoardProps {
  label: string;
  columns: BoardColumn[];
  items: BoardItem[];
  onMove: (itemId: string, columnId: string) => void;
  onOpen?: (item: BoardItem) => void;
  moveLabel?: (title: string) => string;
  empty?: ReactNode;
  className?: string;
}
/** Controlled Kanban with a native move menu: every move works without dragging. */
export function WorkBoard({
  label,
  columns,
  items,
  onMove,
  onOpen,
  moveLabel = (title) => `Move ${title}`,
  empty = "No items",
  className,
}: WorkBoardProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      {columns.map((column) => (
        <section
          key={column.id}
          aria-label={column.label}
          className="min-w-0 rounded-xl bg-muted p-3"
        >
          <h3 className="mb-3 flex justify-between text-sm font-semibold">
            {column.label}
            <span className="text-muted-foreground">
              {items.filter((item) => item.column === column.id).length}
            </span>
          </h3>
          <ul className="grid gap-3">
            {items
              .filter((item) => item.column === column.id)
              .map((item) => (
                <li
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-border bg-card p-3"
                >
                  {onOpen ? (
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="min-h-11 text-start text-sm font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.title}
                    </button>
                  ) : (
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                  {item.meta}
                  <select
                    aria-label={moveLabel(item.title)}
                    value={column.id}
                    onChange={(e) => onMove(item.id, e.target.value)}
                    className="min-h-11 min-w-0 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
          </ul>
          {!items.some((item) => item.column === column.id) && (
            <div className="py-6 text-center text-xs text-muted-foreground">{empty}</div>
          )}
        </section>
      ))}
    </div>
  );
}
export interface ScheduleItem {
  id: string;
  title: string;
  start: string;
  end?: string;
  detail?: string;
}
export interface ScheduleViewProps {
  label: string;
  items: ScheduleItem[];
  onOpen?: (item: ScheduleItem) => void;
  locale?: string;
  empty?: ReactNode;
  className?: string;
}
/** Chronological agenda. Callers supply ISO datetimes; no artificial events are created. */
export function ScheduleView({
  label,
  items,
  onOpen,
  locale = "en",
  empty = "No scheduled items",
  className,
}: ScheduleViewProps) {
  const format = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const valid = items
    .filter((item) => Number.isFinite(Date.parse(item.start)))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  return (
    <section aria-label={label} className={cn("min-w-0", className)}>
      {valid.length ? (
        <ol className="divide-y divide-border">
          {valid.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="grid min-w-0 gap-1">
                <time dateTime={item.start} className="text-xs text-muted-foreground">
                  {format.format(new Date(item.start))}
                  {item.end && Number.isFinite(Date.parse(item.end))
                    ? ` — ${format.format(new Date(item.end))}`
                    : ""}
                </time>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
              </div>
              {onOpen && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpen(item)}
                  aria-label={item.title}
                >
                  {item.title}
                </Button>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}
export interface ConversationMessage {
  id: string;
  author: string;
  body: string;
  sentAt: string;
  own?: boolean;
}
export interface ConversationProps {
  label: string;
  messages: ConversationMessage[];
  onSend: (message: string) => void | Promise<void>;
  sendLabel?: string;
  inputLabel?: string;
  locale?: string;
  disabled?: boolean;
  errorLabel?: string;
  className?: string;
}
/** Controlled message history and async composer; failures preserve the draft. */
export function Conversation({
  label,
  messages,
  onSend,
  sendLabel = "Send",
  inputLabel = "Message",
  errorLabel = "Message could not be sent. Try again.",
  locale = "en",
  disabled,
  className,
}: ConversationProps) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const id = useId();
  return (
    <section aria-label={label} className={cn("grid min-w-0 gap-4", className)}>
      <ol
        aria-label={label}
        aria-live="polite"
        className="grid max-h-96 gap-3 overflow-y-auto rounded-lg bg-muted p-3"
      >
        {messages.map((message) => (
          <li
            key={message.id}
            className={cn(
              "grid max-w-[90%] gap-1 rounded-lg border border-border bg-card p-3",
              message.own ? "justify-self-end" : "justify-self-start",
            )}
          >
            <div className="flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
              <strong>{message.author}</strong>
              <time dateTime={message.sentAt}>
                {Number.isFinite(Date.parse(message.sentAt))
                  ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
                      new Date(message.sentAt),
                    )
                  : message.sentAt}
              </time>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
          </li>
        ))}
      </ol>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!draft.trim() || busy || disabled) return;
          setBusy(true);
          setError(false);
          try {
            await onSend(draft.trim());
            setDraft("");
          } catch {
            setError(true);
          } finally {
            setBusy(false);
          }
        }}
        className="grid gap-2"
      >
        <label htmlFor={id} className="text-xs font-medium">
          {inputLabel}
        </label>
        <textarea
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={disabled || busy}
          required
          rows={3}
          className="w-full rounded-lg border border-input bg-background p-3 text-base focus-visible:outline-2 focus-visible:outline-ring"
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {errorLabel}
          </p>
        )}
        <Button
          type="submit"
          disabled={disabled || busy || !draft.trim()}
          loading={busy}
          className="justify-self-end"
        >
          {sendLabel}
        </Button>
      </form>
    </section>
  );
}
