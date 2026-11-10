import { useId, type ReactNode } from "react";
import { cn } from "@ux-sting/utils";
export interface AuthPanelProps {
  title: string;
  description?: string;
  brand?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  className?: string;
}
/** Auth composition for sign-up, login, recovery or confirmation. Consumer owns authentication. */
export function AuthPanel({
  title,
  description,
  brand,
  children,
  aside,
  footer,
  className,
}: AuthPanelProps) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "grid min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        aside && "lg:grid-cols-2",
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-md content-center gap-6 p-6 sm:p-10">
        {brand}
        <header className="grid gap-2">
          <h1 id={id} className="text-2xl font-bold">
            {title}
          </h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
        {children}
        {footer && <footer className="text-sm text-muted-foreground">{footer}</footer>}
      </div>
      {aside && (
        <aside className="hidden min-w-0 items-center justify-center bg-muted p-8 lg:flex">
          {aside}
        </aside>
      )}
    </section>
  );
}
