---
"@ux-sting/react": minor
---

`TextEffect` gains `trigger="scroll"`: words (or characters) ink from muted to full in reading order as the block crosses the viewport, using CSS scroll-driven animations, so it stays a server component with no client JavaScript. Browsers without scroll-driven animations and reduced motion show the final text. Tune with `--ui-te-muted`, `--ui-te-start` and `--ui-te-span`.
