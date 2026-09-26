import { createVariants } from "@ux-sting/utils";

export const buttonVariants = createVariants({
  base: [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-(--ui-control-gap) whitespace-nowrap rounded-md font-medium",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-(--ui-duration-fast) ease-(--ui-ease-standard)",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover data-active:bg-primary-hover",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary-hover data-active:bg-secondary-hover",
      outline:
        "border border-border-strong bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground data-active:bg-accent",
      ghost: "text-foreground hover:bg-accent hover:text-accent-foreground data-active:bg-accent",
      link: "h-auto! px-0! text-primary underline-offset-4 hover:underline active:scale-100",
      destructive:
        "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive-hover",
      success: "bg-success text-success-foreground shadow-xs hover:bg-success-hover",
      warning: "bg-warning text-warning-foreground shadow-xs hover:bg-warning-hover",
    },
    size: {
      xs: "h-control-xs px-2 text-xs [&_svg]:size-3.5",
      sm: "h-control-sm px-3 text-sm [&_svg]:size-4",
      md: "h-control-md px-control-px text-sm [&_svg]:size-4",
      lg: "h-control-lg px-5 text-md [&_svg]:size-5",
      xl: "h-control-xl px-6 text-md [&_svg]:size-5",
    },
    fullWidth: { true: "w-full", false: "" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export const iconButtonSizes = {
  xs: "w-control-xs px-0",
  sm: "w-control-sm px-0",
  md: "w-control-md px-0",
  lg: "w-control-lg px-0",
  xl: "w-control-xl px-0",
} as const;
