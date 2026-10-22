# @ux-sting/images

Real pictures for real pages. Searches **Wikimedia Commons**, **The Met Open Access** and **Openverse**, keeps only **public domain, CC0, CC BY and CC BY-SA**, downloads what you pick and records the credit (title, author, source, license — TASL) automatically.

```bash
npx ux-sting images "ghent canal" --source commons,met --count 6
npx ux-sting images "ghent canal" --source commons --download 1,3 --dir public/images
```

Each download updates `public/images/credits.json` (with `credit`, `creditHtml`, `attributionRequired`, `altDraft`) and regenerates `CREDITS.md` beside it. Render the credit next to the image or on a credits page — see `.claude/skills/ux-sting-taste/references/images.md`.

## API

```ts
import { searchImages, downloadImage, recordCredits, creditText } from "@ux-sting/images";
const { results, errors } = await searchImages("letterpress", { sources: ["commons", "met"], licenses: ["cc0", "by"] });
```

- NonCommercial, NoDerivatives, GFDL-only, fair-use and unknown licenses are dropped; The Met returns only public-domain objects (released as CC0).
- A failing source is reported in `errors` and the others still return.
- Downloads refuse private, local and metadata hosts (DNS included), re-check every redirect, require an image content type and cap files at 15 MB.
- The Met's `v1/search` endpoint was retired on 2026-10-01; this package uses `v1.1/search`.
