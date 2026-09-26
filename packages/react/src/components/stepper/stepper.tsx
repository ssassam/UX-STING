import { CheckIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface StepperStep {
  title: ReactNode;
  description?: ReactNode;
  /** Mark a step as having an error. */
  error?: boolean;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Render steps as buttons to allow jumping back (completed steps only). */
  onStepClick?: (index: number) => void;
  /** Screen reader text for completed steps (localize it). */
  completedLabel?: string;
}

/**
 * Progress through a multi-step flow. The current step is announced with
 * `aria-current="step"`; completed steps can be revisited.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  {
    steps,
    current,
    orientation = "horizontal",
    onStepClick,
    completedLabel = "completed",
    className,
    ...props
  },
  ref,
) {
  return (
    <ol
      ref={ref}
      className={cn(
        "flex gap-4",
        orientation === "horizontal" ? "flex-col sm:flex-row sm:items-start" : "flex-col",
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const state = step.error
          ? "error"
          : i < current
            ? "complete"
            : i === current
              ? "current"
              : "upcoming";
        const Indicator = (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums transition-colors [&_svg]:size-4",
              state === "complete" && "border-primary bg-primary text-primary-foreground",
              state === "current" && "border-primary text-primary",
              state === "upcoming" && "border-border-strong text-muted-foreground",
              state === "error" && "border-destructive bg-destructive text-destructive-foreground",
            )}
          >
            {state === "complete" ? <CheckIcon /> : i + 1}
          </span>
        );
        const content = (
          <>
            {Indicator}
            <span className="grid gap-0.5 text-start">
              <span
                className={cn(
                  "text-sm font-medium",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {step.title}
                {state === "complete" ? <span className="sr-only"> ({completedLabel})</span> : null}
              </span>
              {step.description ? (
                <span className="text-xs text-muted-foreground">{step.description}</span>
              ) : null}
            </span>
          </>
        );
        return (
          <li
            key={i}
            aria-current={i === current ? "step" : undefined}
            data-state={state}
            className={cn(
              "relative flex flex-1 items-start gap-3",
              orientation === "horizontal" &&
                "sm:after:mt-4 sm:after:h-0.5 sm:after:flex-1 sm:after:bg-border sm:last:after:hidden",
              state === "complete" && "sm:after:bg-primary",
            )}
          >
            {onStepClick && i < current ? (
              <button
                type="button"
                onClick={() => onStepClick(i)}
                className="flex items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
});
