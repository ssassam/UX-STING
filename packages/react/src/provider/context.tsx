"use client";
import { createContext, useContext } from "react";
import type { ColorMode, DensityMode } from "@ux-sting/utils";
import { en, type Messages } from "./messages.js";

export interface UIContextValue {
  locale: string;
  dir: "ltr" | "rtl";
  messages: Messages;
  colorMode: ColorMode;
  resolvedColorMode: "light" | "dark" | "high-contrast";
  setColorMode: (mode: ColorMode) => void;
  density: DensityMode;
  theme: string;
  portalContainer: HTMLElement | null;
}

const defaultValue: UIContextValue = {
  locale: "en",
  dir: "ltr",
  messages: en,
  colorMode: "light",
  resolvedColorMode: "light",
  setColorMode: () => {},
  density: "comfortable",
  theme: "default",
  portalContainer: null,
};

export const UIContext = createContext<UIContextValue>(defaultValue);

/** Access the nearest `UIProvider` configuration. Works without a provider. */
export function useUI(): UIContextValue {
  return useContext(UIContext);
}

export function useMessages(): Messages {
  return useContext(UIContext).messages;
}

export function useLocale(): { locale: string; dir: "ltr" | "rtl" } {
  const { locale, dir } = useContext(UIContext);
  return { locale, dir };
}

export function useColorMode() {
  const { colorMode, resolvedColorMode, setColorMode } = useContext(UIContext);
  return { colorMode, resolvedColorMode, setColorMode };
}

/** Container overlays portal into, so they inherit the provider's theme. */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(UIContext).portalContainer ?? undefined;
}
