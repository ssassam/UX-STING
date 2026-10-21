# Security and licensing (Engine 11)

## Licensing

### Rules
1. Only material under MIT, ISC, BSD or Apache-2.0 may be adapted or bundled. Each adaptation is credited in `THIRD_PARTY_NOTICES.md` with the copyright line and licence text; Apache-2.0 NOTICE files travel with any redistribution.
2. "No licence file" means all rights reserved: **research only**.
3. Licences with redistribution restrictions (Commons Clause, proprietary effect licences) or copyleft (AGPL) are **research only** for a library — no code, no ports, no data.
4. Every new dependency answers the questions in `CONTRIBUTING.md` (necessity, size, maintenance, licence, RSC compatibility) and is pinned to an exact version.

### Status of the reference repositories
See `REFERENCE_REPOSITORY_AUDIT.md`. Adapted (credited): design-taste, Better Design, UI/UX Pro Max, Claude SEO (all MIT). Candidate dependency: Paper Shaders (Apache-2.0, optional, lazy). Research only: Superdesign (AGPL), Canvas UI (Commons Clause), Hyperiux effects (proprietary), UI Tools and Cursify (no licence).

### Reconstruction and copyright
- **Authorized replication**: the user confirms they own the site or have permission (`--authorized`). Only then is text copied; even then imagery, logos, fonts and code are not copied — media becomes placeholders, fonts are referenced by name with fallbacks.
- **Inspiration** (default): only measurements (sizes, proportions, color values, composition) are kept; content becomes labelled placeholders. Measurements of a public page are facts, but a *whole* identity copied 1:1 can still infringe trade dress — remix mode therefore takes facets, not entire identities.
- Never bypass authentication, paywalls, robots.txt for crawling, or technical protection measures.

## Security

### Threats and controls

| Threat | Control | Status |
| --- | --- | --- |
| SSRF via user-supplied URLs | `checkTargetUrl`: http(s) only, no credentials, metadata endpoints always refused, private/loopback/link-local/CGNAT/ULA refused unless an exact `host:port` is allowlisted; resolved IPs checked; **every subrequest and redirect** re-checked through `page.route` | ✔ prototype, unit-tested |
| DNS rebinding | The target's DNS answers are checked before navigation, and every request's hostname is re-checked in the browser route handler | ◐ partial — Chromium resolves names itself, so a hostname that re-resolves to a private IP after the first check is not caught. Planned: route browser traffic through a local proxy that pins the validated IP |
| Prompt injection from pages/repos | Page text is returned as data fields; agents are instructed that only the user and the project spec give instructions; injection-looking text is reported | Spec (`MULTI_AGENT_ORCHESTRATION.md`) |
| XSS in generated output | Generator escapes all text and attributes; links limited to `#`, relative and http(s); JSON-LD serializer escapes `<`, `>`, `&`, U+2028/2029 | ✔ tested |
| ReDoS / hostile HTML | `extractJsonLd` is a linear `indexOf` scan with a size cap (a regex version was measured quadratic and replaced) | ✔ tested |
| Running generated code | Generated sites are built and served in the sandbox/CI only; the QA browser renders generated HTML with `setContent`; generated pages reference no external resources, and any request they make still passes the target check (private hosts blocked) | ✔ prototype; a full sandbox for generated *apps* (container, no outbound network) is Phase 5 |
| Unsafe file operations | Generators write through a path guard inside the project root; CLI lockfile protects user-edited files | CLI ✔; generator Phase 5 |
| Malicious dependencies | pnpm lockfile, `ignoredBuiltDependencies`, exact pins for new deps, no install scripts | ✔ |
| Credential leakage | API keys only from env/keychain, masked in logs, never written to reports | Spec (`SEO_AGENT_SPEC.md`) |
| Fabricated content | Builders never invent ratings, prices, authors, addresses or availability; validator rejects placeholders and impossible ratings | ✔ tested |

### Reporting
Security issues: see `SECURITY.md`.
