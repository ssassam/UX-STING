import { cn } from "@ux-sting/utils";
import type { ReactNode } from "react";
import { Avatar } from "../avatar/avatar.js";
import { Card } from "../card/card.js";

export interface ProfileCardProps {
  name: string;
  avatar?: string;
  /** Role, title or handle. */
  subtitle?: ReactNode;
  bio?: ReactNode;
  badges?: ReactNode;
  stats?: Array<{ label: ReactNode; value: ReactNode }>;
  actions?: ReactNode;
  cover?: string;
  layout?: "vertical" | "horizontal";
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Person or organization summary with stats and actions. */
export function ProfileCard({
  name,
  avatar,
  subtitle,
  bio,
  badges,
  stats,
  actions,
  cover,
  layout = "vertical",
  headingLevel = 3,
  className,
}: ProfileCardProps) {
  const Heading = `h${headingLevel}` as const;
  const vertical = layout === "vertical";
  return (
    <Card className={className}>
      {cover ? (
        <div
          className="h-20 bg-muted bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "flex gap-4 p-card-p",
          vertical ? "flex-col items-center text-center" : "items-start",
          cover && vertical && "-mt-10",
        )}
      >
        <Avatar
          src={avatar}
          name={name}
          alt=""
          size={vertical ? "xl" : "lg"}
          className={cn(cover && "ring-4 ring-card")}
        />
        <div className={cn("grid min-w-0 flex-1 gap-1", vertical && "justify-items-center")}>
          <Heading className="text-md font-semibold">{name}</Heading>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          {badges ? <div className="mt-1 flex flex-wrap gap-1.5">{badges}</div> : null}
          {bio ? <p className="mt-2 text-sm text-muted-foreground">{bio}</p> : null}
          {stats?.length ? (
            <dl className={cn("mt-3 flex gap-6", vertical && "justify-center")}>
              {stats.map((s, i) => (
                <div key={i} className="grid">
                  <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="order-1 font-semibold tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {actions ? (
            <div className={cn("mt-4 flex flex-wrap gap-2", vertical && "justify-center")}>
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
