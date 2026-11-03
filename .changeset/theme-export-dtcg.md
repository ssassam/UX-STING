---
"@ux-sting/extract": minor
"ux-sting": minor
---

Add `ux-sting theme export <preset|name.theme.json>`: a UX-STING theme becomes W3C DTCG 2025.10 tokens in two layers, a palette file (every intent scale in OKLCH with a hex fallback, plus radius and fonts) and one semantic file per mode (light, dark, high-contrast) whose roles alias the palette (`{palette.primary.600}`). `--resolved` writes raw colors for tools that cannot resolve references across files. Re-importing with `theme import` gives back the same core roles. New API: `themeToDtcg`, `dtcgColorValue`, `themeScales`.
