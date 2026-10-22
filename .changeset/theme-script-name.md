---
"@ux-sting/react": minor
"@ux-sting/utils": minor
---

`ThemeScript` takes an optional `theme` (and `getThemeScript` a third argument) that sets `data-ui-theme` on `<html>` before paint. Without it, a page using a named or custom `UIProvider` theme painted in the default theme's colors until React hydrated.
