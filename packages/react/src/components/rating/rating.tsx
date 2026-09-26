"use client";
import { useControllableState } from "@unified-ui/hooks";
import { StarIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useId, useState, type HTMLAttributes } from "react";
import { useLocale, useMessages } from "../../provider/context.js";

const sizeClass = { sm: "size-3.5", md: "size-4", lg: "size-5", xl: "size-6" };

export interface ReviewStarsProps extends HTMLAttributes<HTMLSpanElement> {
  /** Rating value, supports fractions (4.5). */
  value: number;
  max?: number;
  size?: keyof typeof sizeClass;
  /** Show the numeric value. */
  showValue?: boolean;
  /** Number of reviews, shown as "(128)". */
  count?: number;
}

/**
 * Read-only star rating with fractional fill. Announced as text
 * ("4.5 out of 5 stars"), never by color alone. Server-compatible.
 */
export const ReviewStars = forwardRef<HTMLSpanElement, ReviewStarsProps>(function ReviewStars(
  { value, max = 5, size = "md", showValue, count, className, ...props },
  ref,
) {
  const messages = useMessages();
  const { locale } = useLocale();
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  return (
    <span ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props}>
      <span
        role="img"
        aria-label={messages.rating(Number(value.toFixed(1)), max)}
        className="relative inline-flex"
      >
        <span className="flex text-border-strong" aria-hidden>
          {Array.from({ length: max }, (_, i) => (
            <StarIcon key={i} className={cn(sizeClass[size], "fill-current")} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-warning"
          style={{ width: `${(Math.max(0, Math.min(value, max)) / max) * 100}%` }}
          aria-hidden
        >
          {Array.from({ length: max }, (_, i) => (
            <StarIcon key={i} className={cn(sizeClass[size], "shrink-0 fill-current")} />
          ))}
        </span>
      </span>
      {showValue ? (
        <span className="text-sm font-semibold tabular-nums">{nf.format(value)}</span>
      ) : null}
      {count !== undefined ? (
        <span className="text-sm tabular-nums text-muted-foreground">({nf.format(count)})</span>
      ) : null}
    </span>
  );
});

export interface RatingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  size?: keyof typeof sizeClass;
  readOnly?: boolean;
  disabled?: boolean;
  name?: string;
  /** Accessible group label, e.g. "Rate this restaurant". */
  label?: string;
}

/**
 * Interactive star rating implemented as a native radio group, so it is
 * keyboard accessible (arrows) and form-submittable.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    max = 5,
    size = "lg",
    readOnly,
    disabled,
    name,
    label = "Rating",
    className,
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [hover, setHover] = useState<number | null>(null);
  const messages = useMessages();
  const autoName = `rating${useId().replace(/:/g, "")}`;
  const groupName = name ?? autoName;
  if (readOnly) return <ReviewStars value={value} max={max} size={size} className={className} />;
  const shown = hover ?? value;
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cn("inline-flex items-center gap-0.5", disabled && "opacity-50", className)}
      onPointerLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        return (
          <label
            key={star}
            className="ui-hit-area relative cursor-pointer rounded-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            onPointerEnter={() => !disabled && setHover(star)}
          >
            <input
              type="radio"
              className="sr-only"
              name={groupName}
              value={star}
              checked={value === star}
              disabled={disabled}
              aria-label={messages.rating(star, max)}
              onChange={() => setValue(star)}
            />
            <StarIcon
              aria-hidden
              className={cn(
                sizeClass[size],
                "transition-colors",
                star <= shown ? "fill-warning text-warning" : "text-border-strong",
              )}
            />
          </label>
        );
      })}
    </div>
  );
});
