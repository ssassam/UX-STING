# SEO agent specification

An optional workflow that audits a site and prepares safe changes. Tools measure; the agent interprets, prioritises and drafts fixes. Nothing is published or edited without approval.

## Workflow
1. **Scope** — the user names a target they control (or may audit) and limits: `maxPages`, rate, depth. Third-party hosts: robots.txt always respected.
2. **Crawl** (`seo-audit`, deterministic) — fetch with the SSRF guard; record status, redirects, headers, HTML, rendered DOM (optional Playwright), JSON-LD.
3. **Technical checks** *(det)* — status codes, redirect chains, canonical present/absolute/self or consistent, conflicting directives (noindex + canonical elsewhere, noindex in sitemap), robots.txt blocks, mixed content, `lang`/`dir`.
4. **Templates** — cluster pages by DOM structure into templates; run checks once per template and report affected URLs.
5. **Metadata** *(det)* — missing/duplicate/too long titles and descriptions; duplicate canonical targets.
6. **Indexing** *(det)* — pages indexable vs policy (`seo-core indexingPolicy`); thin programmatic pages; parameter URLs.
7. **International** *(det)* — hreflang sets: self, reciprocity, codes, x-default, canonical agreement.
8. **Structured data** *(det)* — `extractJsonLd` + `validateJsonLd` per page; eligibility per feature with sources.
9. **Links** *(det)* — internal graph, orphans, broken links, generic anchors, crawl depth.
10. **Performance** *(det)* — Lighthouse on representative URLs per template; CrUX if a key is configured.
11. **Interpretation** *(ai)* — the agent explains impact, groups findings, proposes priorities, and drafts code changes.
12. **Validation** — after a fix is applied in a branch, re-run the affected checks on a preview build; only then mark the finding resolved.

## Finding format

```jsonc
{
  "id": "canonical-conflict",
  "layer": "deterministic",            // deterministic | ai
  "severity": "high",                  // critical | high | medium | low | info
  "template": "product",
  "affectedUrls": ["https://…/p/1", "https://…/p/2"],
  "evidence": { "canonical": "https://…/p/1?ref=x", "robots": "noindex" },
  "source": "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
  "suggestedAction": "Point canonical to the clean URL and remove noindex, or keep noindex and drop the canonical.",
  "verification": "Re-crawl: canonical equals the final URL without parameters; no noindex; URL present in sitemap.",
  "aiInterpretation": null               // separate field, only for layer=ai or added commentary
}
```

Severity rules are deterministic (e.g. `noindex` on a URL listed in the sitemap = high; missing description = low). AI commentary never changes severity.

## Safe changes
- Code changes are prepared as a diff on a branch, with tests (metadata snapshot, JSON-LD validation, hreflang set) added alongside.
- **Content edits require approval**: titles, descriptions and body copy are proposed, never auto-applied in bulk.
- Never: generating mass pages, inventing reviews/ratings/prices/authors/addresses, keyword stuffing, cloaking, auto-submitting to indexing APIs for content Google does not allow there.
- Wording: findings describe eligibility and best practice; they never promise rankings, indexing or traffic.

## Credentials
CrUX / Search Console credentials come from environment variables or OAuth tokens stored by the OS keychain; reports never contain keys; logs mask them.
