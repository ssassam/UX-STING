---
"@ux-sting/icons": patch
---

fix(icons): the animated layer read `--ui-duration-base`, a token that does not exist, so icon motion never followed the theme's timing. It now uses `--ui-duration-slow` (300ms) with the same fallback chain.
