# @ux-sting/qa

Browser QA built for coding agents. One command renders a page at 375, 768 and 1440 px in headless Chromium and returns a **short** markdown report, a JSON report, screenshots and the **three fixes worth making first**.

```bash
npx ux-sting qa http://localhost:3000/ --out ux-sting-qa      # or: npx ux-sting-qa <url|path>
npx ux-sting qa ./out                                          # static export folder or .html file
```

| Check | How |
| --- | --- |
| Accessibility | axe-core (WCAG 2.0/2.1/2.2 A + AA tags) per viewport |
| Contrast | Text color composited on its real background, WCAG AA (4.5:1, 3:1 large); text on images/gradients is counted as skipped, never guessed |
| Horizontal overflow | `scrollWidth − clientWidth` and the outermost offending elements |
| Unequal margins | Each band's layout container (the content's common ancestor) inset differently at start and end |
| Orphans | Bands holding a stray line, and grids whose last row has one item under rows of ≥ 3 |
| Empty stretches | Vertical gaps taller than ¾ of a screen with no text, media or control |
| Title on first screen | The h1 (else first heading) is visible and starts inside the first viewport |
| Console | `console.error`, uncaught exceptions and failed requests |
| LCP / CLS | PerformanceObserver during load (lab values; good ≤ 2.5 s / ≤ 0.1) |

Findings merge across viewports, are ranked by severity × breadth and become a 0–100 score. Exit code 1 when a serious or critical finding remains (`--fail-on`).

Conventions borrowed from [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli): concise commands, small outputs, files on disk instead of giant accessibility-tree dumps in the agent's context.

## API

```ts
import { runQa, toMarkdown } from "@ux-sting/qa";
const report = await runQa("http://localhost:3000/", { outDir: "qa", viewports: [375, 1440] });
report.top; // three ranked findings with concrete `fix` text
```

`analyze()`, `rank()` and `score()` are pure and work on stored measurements. `collectLayout` is the self-contained in-page collector if you drive Playwright yourself.

## Security

The URL you pass is allowlisted; navigation and subrequests to other local, private or cloud-metadata addresses are blocked (`--allow-host host:port` to add one). Local files are served from 127.0.0.1 with path traversal refused.
