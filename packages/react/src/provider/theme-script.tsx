import { getThemeScript, type ColorMode } from "@ux-sting/utils";

export interface ThemeScriptProps {
  storageKey?: string;
  defaultColorMode?: ColorMode;
  /** Name of the `UIProvider` theme, applied before paint so its colors show on first load. */
  theme?: string;
  nonce?: string;
}

/**
 * Server component that applies the persisted color mode before paint.
 * Render it in `<head>` together with `UIProvider target="document"`.
 */
export function ThemeScript({
  storageKey = "ui-color-mode",
  defaultColorMode = "light",
  theme,
  nonce,
}: ThemeScriptProps) {
  return (
    <script
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: getThemeScript(storageKey, defaultColorMode, theme) }}
    />
  );
}
