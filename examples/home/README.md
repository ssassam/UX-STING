# UX-STING home — one-page product presentation

The page served at https://uxsting.veltein.com/: what UX-STING is, measured counts, the install command,
how the agent workflow runs, the live templates, Free / Premium templates / White-label licensing and an
FAQ (with `FAQPage` and `SoftwareApplication` structured data). Concept: UX-STING as a quality-control
spec sheet — the hero renders real components with a live LTR/RTL switch.

```bash
pnpm --filter @ux-sting/example-home dev
```

## Selling premium templates

Edit `content/premium.ts`: add one object per template (name, category, description, screenshot in
`public/templates/`, price, checkout link, demo link). Push to `main`; the Pages workflow rebuilds the site.
While the list is empty the section shows a "get notified" notice. Enquiries go to `CONTACT_EMAIL`.

- Facts and counts shown on the page: `content/site.ts` (keep in sync with the root README on release).
- Theme: `app/providers.tsx` (amber on gray, small radius, Space Grotesk + JetBrains Mono).
