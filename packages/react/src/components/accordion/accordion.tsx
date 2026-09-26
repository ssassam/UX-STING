"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { createContext, forwardRef, useContext, type ComponentPropsWithoutRef } from "react";

const AccordionContext = createContext<{ variant: "default" | "separated" | "bordered" }>({
  variant: "default",
});

export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  variant?: "default" | "separated" | "bordered";
};

/**
 * Vertically stacked disclosures. Use for FAQs and progressive disclosure
 * of secondary details — not to hide primary content.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { variant = "default", className, ...props },
  ref,
) {
  return (
    <AccordionContext.Provider value={{ variant }}>
      <AccordionPrimitive.Root
        ref={ref}
        className={cn(
          variant === "separated" && "grid gap-2",
          variant === "bordered" && "overflow-hidden rounded-lg border border-border",
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>)}
      />
    </AccordionContext.Provider>
  );
});

export const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  const { variant } = useContext(AccordionContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        variant === "default" && "border-b border-border",
        variant === "separated" && "rounded-lg border border-border bg-card px-4",
        variant === "bordered" && "border-b border-border px-4 last:border-b-0",
        className,
      )}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { headingLevel?: 2 | 3 | 4 | 5 | 6 }
>(function AccordionTrigger({ className, children, headingLevel = 3, ...props }, ref) {
  const Heading = `h${headingLevel}` as const;
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex flex-1 items-center justify-between gap-4 rounded-sm py-4 text-start text-sm font-medium transition-colors",
            "outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "[&[data-state=open]>svg]:rotate-180",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-normal)" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className="ui-anim-collapse text-sm" {...props}>
      <div className={cn("pb-4 text-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
