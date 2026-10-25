---
"@ux-sting/react": minor
---

New `Footer` pattern (`@ux-sting/react/footer`): `contentinfo` landmark with an optional `FooterCallout` CTA band, `FooterMain` (`FooterBrand` + `FooterTagline`, `FooterNav` of `FooterColumn`s with `FooterLink`s — `asChild`, `icon`, `badge`, `external`), and `FooterBottom` with `FooterCopyright` and dot-separated `FooterLegal`. `tone="inverse"` (dark in every color mode, default) or `tone="default"` (theme surface); retint through `--footer-bg/-fg/-muted/-border/-accent`.
