---
name: ux-sting-taste
description: "Art-direct a UX-STING page so it looks designed for this client, not generated: read the brief, list what is unique to the client, deal three researched art directions and pick one, write a one-sentence concept, build with real openly licensed images (credited automatically), run browser QA, critique the screenshots and fix. Use for landing pages, marketing and editorial sites, portfolios, redesigns, hero sections and demo examples, or when someone says it looks generic, templated, AI-made, bland, 'make it premium' or 'more personality'. Dashboards and app screens take the quiet route in references/app-screens.md. Ideas adapted from the MIT-licensed taste-skill, design-taste and Better Design projects (see THIRD_PARTY_NOTICES.md)."
---

# UX-STING taste — a direction, a concept, real pictures, proof

The ux-sting skill makes a screen correct. This one makes it belong to one client. Work through the steps in order and write each step's output into `.ux-sting/taste/` so the next step (and the person) can see it. Skipping a step is how pages end up generic.

## 0. Route

- **Marketing, editorial, portfolio, event, product launch** → this pipeline.
- **Dashboard, admin, settings, data table, internal tool, app screen** → follow `references/app-screens.md` instead. Quiet panels, aligned numbers, color spent on data. No hero, no art direction deck.
- **Existing brand** (site, guidelines, tokens) → `npx ux-sting extract <their-url>` then `npx ux-sting theme import` (see `ux-sting-universal`). The brand wins over any direction you would prefer.

## 1. Read the brief → `brief.md`

Five lines: what this is, for whom, where (place, language, culture), the one action a visitor should take, and the constraints (brand, content, deadline). If the brief is thin, ask one question; otherwise proceed and state your assumptions.

## 2. What is unique to this client → `unique.md`

List 5–8 specifics that only this client has: a place, a material, a process, a history, a product quirk, a customer ritual, its vocabulary, a number that matters. Note where each came from (brief, their site, research).

> Test every line: **could it describe a competitor?** Then it is not unique — delete it.

These specifics are the raw material for the direction, the copy and the image searches. A page built from them cannot look like a template.

## 3. Deal three researched directions → `directions.md`

Research before you design: look at what the client's world actually looks like (its city's signage, its trade's print history, the materials it works with, archives of its subject). Then deal three directions. Start from the cards in `references/directions.md` but bend each one toward the unique list.

Each direction: **name** · **rooted in** (a real reference from the client's world, with a link) · **type** (display + body pairing) · **palette logic** (theme preset or extracted tokens + one accent) · **layout device** (the one structural idea: index, split, full-bleed, ledger, poster…) · **image plan** (what to search for, from which archive) · **motion budget** · **risk**.

The three must differ on at least two of: type, palette, composition. If two feel alike, replace one.

## 4. Pick one

Choose the direction that serves the most items in `unique.md` with acceptable risk. Write two lines on why, and one line each on why the others lost. If the person is available and the choice is close, show all three (see `ux-sting-explore`) and let them pick.

## 5. One-sentence concept → `concept.md`

> **[Client] as [image / metaphor], because [specific from unique.md].**

e.g. "A Ghent tasting-menu restaurant as a printed nightly menu card, because the menu changes every morning." Every later decision should serve this sentence; when a section doesn't, cut or change it.

## 6. Real images, credited

```bash
npx ux-sting images "ghent canal night" --source commons,met --count 6           # search
npx ux-sting images "ghent canal night" --source commons --download 2,5 --dir public/images
```

- Only public domain, CC0, CC BY and CC BY-SA come back; NonCommercial / NoDerivatives never do.
- Every download is written to `public/images/credits.json` and `CREDITS.md` with title, author, source and license. **Render the credit**: as a `figcaption` next to editorial images, or on a credits section/page linked from the footer. Use `entry.credit` (text) or `entry.creditHtml`.
- Write alt text for the page's context (the manifest's `altDraft` is a starting point, not the answer). Decorative images get `alt=""`.
- Search with the unique list: materials, places, periods, processes — not "happy team office".
- Nothing fits? Use typography, color fields, diagrams (`ux-sting-diagrams`) or one 3D moment (`ux-sting-3d`) — never generic stock or fake screenshots.
- Details: `references/images.md`.

## 7. Build

Build with UX-STING components, tokens and the chosen theme (preset, `createTheme`, or `ux-sting theme import`). Follow the craft rules in `references/craft.md` and avoid everything in `references/anti-slop.md`. Motion comes from the direction's budget (`references/craft.md`); `ux-sting-3d` for one signature moment.

## 8. Prove it in the browser

Run the `ux-sting-qa` loop: `npx ux-sting qa <url> --out .ux-sting/qa/round-1`, fix the top 3, re-run (max 3 rounds). QA includes anti-slop checks (`slop:*`, `data:*` findings) next to accessibility and layout.

## 9. Critique your own screenshots

Open `shots/375.png`, `shots/1440.png` and the `-full.png` versions and answer, in writing (`critique.md`):

1. Does the first screen say the concept without scrolling?
2. Is the hierarchy readable in three seconds — one thing first, then the action?
3. Do the images do work (show the place, the product, the process), or decorate?
4. Does the rhythm change between sections, or is it the same block repeated?
5. Is the accent spent on one thing per screen?
6. Is mobile designed (crop, order, type size), or a squeezed desktop?
7. Would a competitor's logo fit on this page? (If yes, go back to step 2.)

Turn the three weakest answers into concrete fixes, apply them, re-run QA. At most two critique rounds; label these fixes as judgment, not measurement.

## 10. Hand off

Report: the concept sentence, the chosen direction (plus one line per rejected one), the image credits, the QA table per round and anything left undone with the reason. Taste never overrides accessibility — run `ux-sting-review` before calling it done.
