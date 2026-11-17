# @ux-sting/lighthouse

`runLighthouse(url, options?)` launches Chrome, audits performance/accessibility/best-practices/SEO and closes Chrome in a finally block. Returns scores (0–100 or null), thresholds, failures, pass status and the HTML report. Missing scores fail their gate.

Options: `chromePath`, `chromeFlags`, `formFactor: "mobile" | "desktop"`, `thresholds`. Defaults are mobile and 90/95/90/90. Use `chromeFlags` only for environment-specific browser requirements. The library does not disable Chrome sandboxing by default.

Run against a production build. Record machine, Chrome version and form factor when reporting lab scores; they are not field Core Web Vitals. Targets are operator-selected, and this runner should not be exposed as an unauthenticated network service.
