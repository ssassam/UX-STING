# Real images with `ux-sting images`

`@ux-sting/images` searches three open collections and keeps only licenses a website can use without asking:

| Source | What it is good for | Licenses returned |
| --- | --- | --- |
| `commons` — Wikimedia Commons | Places, streets, buildings, nature, objects, historical photos | Public domain, CC0, CC BY, CC BY-SA |
| `met` — The Met Open Access | Art, design objects, textiles, prints, photographs before ~1925 | CC0 (public-domain works only) |
| `openverse` — Openverse | Flickr and other CC collections, broad photography | CC0, PDM, CC BY, CC BY-SA |

NonCommercial, NoDerivatives, GFDL-only, fair-use and unknown licenses are dropped.

```bash
npx ux-sting images "letterpress type case" --source commons,met --count 6
npx ux-sting images "letterpress type case" --source commons --download 1,4 --dir public/images
npx ux-sting images "tulip still life" --source met --license cc0 --json
```

## Credits are automatic — showing them is your job

Each download adds an entry to `public/images/credits.json` (and regenerates `CREDITS.md`):

```json
{ "file": "letterpress-type-case.jpg", "credit": "“Letterpress type case” by Jane Doe, CC BY-SA 4.0, via Wikimedia Commons",
  "creditHtml": "<a href=…>…</a>", "attributionRequired": true, "altDraft": "Letterpress type case", "license": "by-sa", … }
```

Render it where people can find it:

```tsx
import credits from "../public/images/credits.json";
const credit = (file: string) => credits.find((c) => c.file === file)?.credit;

<figure>
  <Image src="/images/letterpress-type-case.jpg" alt="Wooden type case with sorted metal letters" />
  <figcaption className="text-xs text-muted-foreground">{credit("letterpress-type-case.jpg")}</figcaption>
</figure>
```

For full-bleed or decorative images, a "Photo credits" section or page linked from the footer is fine; still use the exact credit text.

## Rules

- CC BY / BY-SA require credit. PD / CC0 don't, but credit them anyway — it costs nothing and shows provenance.
- CC BY-SA: if you adapt an image (crop, retouch, composite), say so and release the adapted image under CC BY-SA. Using it unmodified next to your own content doesn't change your site's license.
- Search with the client's specifics (materials, places, periods). Look at results before choosing; check the subject isn't a recognisable private person in a sensitive context and that no trademark dominates the frame.
- Resize for the web (the files are large originals); serve with width/height or `aspect-ratio` to avoid layout shift.
- Openverse may rate-limit or be unreachable from some servers; the command reports a failing source and continues with the others.
