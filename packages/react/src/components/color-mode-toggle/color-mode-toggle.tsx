"use client";
import { MoonIcon, SunIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import type { ButtonHTMLAttributes } from "react";
import { useColorMode } from "../../provider/context.js";

export interface ColorModeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible labels (localize). */
  labels?: { toDark: string; toLight: string };
}

/** Switches between light and dark mode via the nearest `UIProvider`. */
export function ColorModeToggle({
  labels = { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
  className,
  ...props
}: ColorModeToggleProps) {
  const { resolvedColorMode, setColorMode } = useColorMode();
  const dark = resolvedColorMode === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? labels.toLight : labels.toDark}
      onClick={() => setColorMode(dark ? "light" : "dark")}
      className={cn(
        "ui-hit-area inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-[1.125rem]",
        className,
      )}
      {...props}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
