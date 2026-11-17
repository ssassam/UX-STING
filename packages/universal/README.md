# @ux-sting/universal

`planSite(brief, directionId?)` wraps the existing planner. `generateNextApp(siteSpec)` returns an editable file map. `writeNextApp(siteSpec, outDir)` writes only into a new directory. `verifySite(baseUrl, paths, qaOptions?)` runs browser QA on each static route.

A `SiteSpec` has `name`, shared `dna`, and `pages: [{ path, content, dna? }]`. A `/` home route is required. Paths use lowercase static URL segments. Generated pages include metadata, responsive styles, semantic content and the Veltein credit.

See [working example and limits](../../docs/GAP_IMPLEMENTATION_STATUS.md). Interactive controls, data fetching and locale routing are not generated.
