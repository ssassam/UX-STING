import type { ReactNode } from "react";

/** A numbered band: the index number sits in the margin like a drawing sheet number. */
export function Section({
  id,
  number,
  kicker,
  title,
  intro,
  children,
}: {
  id: string;
  number?: string;
  kicker?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto grid w-full max-w-6xl scroll-mt-20 gap-8 px-4 py-16 sm:px-6 sm:py-24"
    >
      <header className="grid gap-3 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-6">
        <p aria-hidden={number ? undefined : true} className="font-mono text-sm text-primary">
          {number ? `${number} / 06` : ""}
        </p>
        <div className="grid max-w-3xl gap-3">
          {kicker ? (
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              {kicker}
            </p>
          ) : null}
          <h2
            id={`${id}-title`}
            className="font-display text-3xl leading-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {intro ? <div className="text-lg text-pretty text-muted-foreground">{intro}</div> : null}
        </div>
      </header>
      <div className="min-w-0 md:ps-30">{children}</div>
    </section>
  );
}
