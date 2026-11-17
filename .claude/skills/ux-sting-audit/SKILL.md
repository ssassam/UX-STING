---
name: ux-sting-audit
description: "Audit a rendered UX-STING page using browser QA evidence and severity-ranked fixes."
---

Run `runQa(url)` from `@ux-sting/qa` or MCP `audit_page`. Default widths are 375, 768 and 1440. For local paths, use the QA static server. Follow the repository's target-host policy.

Read `findings` and `top` and inspect screenshots. Fix accessibility and layout failures before cosmetic differences. Re-run the affected viewports after changes; stop after three passes if a structural problem remains and report it explicitly.

For performance, use `runLighthouse` from `@ux-sting/lighthouse` against a production build and record form factor, browser and conditions. Do not describe a missing audit or a null score as passing. Pixel comparison from `@ux-sting/vision` measures mismatch and SSIM; it does not assess semantic correctness.

Report measured results separately from visual judgment, with remaining failures and reproduction details.
