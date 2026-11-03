---
"@ux-sting/qa": minor
---

Add launch-readiness checks (`ship:*`, new `ship` category), measured once per page: missing meta description, missing `og:title`/`og:description`/`og:image`, no favicon, no privacy/terms/legal link, links that go nowhere (`href="#"`, `javascript:`), a soft 404 (made-up URL answers 2xx/3xx) and a 404 page with no way back. They never fail a run; `--no-ship` (or `ship: false`) turns them off. The report JSON gains `ship`. Local static folders now serve their `404.html` with a 404 status, like static hosts.

New `slop:placeholder` taste check: template leftovers in visible text (`{{price}}`, "Your headline here", "[Company name]", "John Doe").
