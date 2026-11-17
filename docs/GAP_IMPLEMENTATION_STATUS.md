# Gap implementation status

The prior message named five workstreams, but the full `ux-sting-gap-analysis.md` was not present in this checkout. The saved baseline is [the reference audit](REFERENCE_REPOSITORY_AUDIT.md) and [capability matrix](COMPETITIVE_CAPABILITY_MATRIX.md). Those documents already describe shipped design reasoning and CSS effects. This implementation does not claim to close every gap in the broader roadmap.

| Workstream | Added | Limits |
| --- | --- | --- |
| DESIGN.md | YAML-frontmatter exports for all 17 themes, importer, lossless UX-STING extension | External files map a supported subset and return warnings; no claim of universal interchange |
| MCP | Ten schema-validated stdio tools via `@ux-sting/mcp` | Local process; no HTTP deployment or hosted service |
| Planning | `planSite` exposes the existing scored, deterministic planner | No new LLM reasoning model |
| Agent workflows | plan, motion-review, audit, layouts, scroll | Concise project skills, not copies of competitor rule databases |
| Effects | 18 optional decorative React effects in `@ux-sting/effects` | CSS and DOM tier; overlaps some existing React effects, no shader engine |
| Multi-page | App Router generation, metadata, scoped DNA styles, safe new-directory writer, per-route QA | Static routes; existing HTML renderer vocabulary; no interactive component reconstruction or application backend |
| Screenshot comparison | PNG mismatch, SSIM, height ratio and bands | Pixel comparison only; screenshot-to-DNA understanding still missing |
| Lighthouse | Local Chrome audits, category thresholds, cleanup | Lab measurements, not field Core Web Vitals |
| Canvas | Local sandboxed comparison board, viewport control, selection | No persisted edits or infinite-canvas authoring |

## Build and use

Use Node 22.16+ for the new tooling packages. From the repository root:

```sh
pnpm install
pnpm build
node packages/mcp/dist/cli.js
```

Configure an MCP host to launch that last command with this repository as its working directory. `compare_screenshots` restricts files to that directory, resolving symlinks before checking. Tools return generated files rather than writing them. Browser tools use the existing QA target guards.

```json
{
  "mcpServers": {
    "ux-sting": {
      "command": "node",
      "args": ["/opt/website/sites/UX-STING/packages/mcp/dist/cli.js"],
      "cwd": "/opt/website/sites/UX-STING"
    }
  }
}
```

Tool names: `list_themes`, `get_theme`, `export_design_md`, `import_design_md`, `plan_design`, `validate_design`, `generate_app`, `extract_tokens`, `audit_page`, `compare_screenshots`.

## Generate a multi-page app

From the repository root, after building:

```js
import { readFile } from 'node:fs/promises';
import { planSite, writeNextApp } from './packages/universal/dist/index.js';
const brief = JSON.parse(await readFile('scripts/design-dna/briefs/salon-noor.json', 'utf8'));
const plan = planSite(brief);
const home = { ...brief.content, nav: [{ label: 'Accueil', href: '/' }, { label: 'Soins', href: '/soins' }] };
await writeNextApp({
  name: brief.name,
  dna: plan.dna,
  pages: [
    { path: '/', content: home },
    { path: '/soins', content: { ...home, title: 'Soins — Atelier Noor', sections: home.sections.slice(0, 2) } }
  ]
}, 'design-dna-output/noor-next');
```

The destination must not exist. Install dependencies and run `pnpm build` inside it. Serve `out/` to inspect the static export. `verifySite(baseUrl, ['/', '/soins'])` audits both routes. Media is placeholder content; generated booking actions do not become a booking backend.

## DESIGN.md

```sh
node scripts/design-md.mjs export all --out design-dna-output/designs
node scripts/design-md.mjs import packages/themes/designs/editorial.DESIGN.md
```

The script refuses to overwrite output files.

`themeToDesignMd(theme)` and `importDesignMd(markdown)` are exported from `@ux-sting/themes`. Generated documents are in `packages/themes/designs/` and are included in the package. `pnpm --filter @ux-sting/themes designs` regenerates them after building. The importer accepts YAML-frontmatter documents and rejects unsupported or malformed lossless extensions.

Format reference: [google-labs-code/design.md](https://github.com/google-labs-code/design.md). MCP follows the [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). Lighthouse follows its [programmatic API](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md). App routes follow the [Next.js App Router](https://nextjs.org/docs/app/getting-started/layouts-and-pages).

## Remaining roadmap

Screenshot-only semantic analysis, WebGL effects, interactive inventory mapping, locale content models, SEO crawling, automatic corrections for generated React apps, and the reproducible competitor benchmark remain open. No competitive superiority claim is justified without that benchmark.

## Agency attribution

New generated HTML, Next.js routes, and the comparison board include a visible “Made with love by Veltein” footer link. Nonvisual attribution is emitted in the document head as `<meta name="author" content="Veltein">` and `<link rel="author" href="https://veltein.com/">`; Next.js uses `metadata.authors` to generate these. No CSS-hidden body links are inserted. Component imports alone do not inject metadata.

## Validation recorded on 2026-10-30

- All 21 library/tooling package builds passed; affected packages were rebuilt after attribution updates.
- Eight affected test suites passed: 88 tests across themes, DNA, Universal, vision, canvas, effects and Lighthouse.
- Changed TypeScript passed ESLint and formatting checks; the five new skills passed the skill validator.
- An MCP client completed a real stdio initialization, listed 10 tools, fetched 17 themes, exported DESIGN.md and verified invalid theme rejection.
- A generated two-route Next.js app passed a production build and TypeScript checks. Chromium checks at 375 and 1440 pixels found the visible Veltein credit on both routes and no horizontal overflow.
- Browser QA for the generated home page passed with score 100 and no findings.
- One local desktop Lighthouse run returned performance 86, accessibility 100, best practices 96 and SEO 100. The default performance gate **did not pass** (requires 90). This single local run is not a field-performance result or a competitor benchmark.

The repository license remains MIT. A mandatory website attribution condition has not been added to the license pending the owner's choice between standard MIT and custom terms.
