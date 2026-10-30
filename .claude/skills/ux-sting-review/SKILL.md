---
name: ux-sting-review
description: "Review a UX-STING screen, component, example or pull request for accessibility, UX, visual design and motion problems and report severity-ranked findings, then fix the critical and serious ones. Use when asked to review, audit, critique, QA or polish UI, before handing off any UI work, or after building with the ux-sting and ux-sting-taste skills. Ideas adapted from the MIT-licensed design-taste and Better Design review checklists (see THIRD_PARTY_NOTICES.md)."
---

# UX-STING review — measure, then judge

A review is not done until there is evidence. Run the tools first, then read the code and the rendered page against the checklist, then fix.

## 1. Collect evidence

```bash
npx ux-sting qa http://localhost:3000/<page> --viewports 375,768,1440 --out .ux-sting/qa
# ^ axe (incl. contrast) + layout overflow + console + LCP/CLS, ranked top-3 fixes, light/dark
npx tsc --noEmit                    # typecheck
npm run lint                        # your ESLint config; enable jsx-a11y
npm test                            # your tests (add jest-axe / @axe-core/react for a11y)
```

Start the dev server first (`npm run dev`); `npx ux-sting qa` needs `@ux-sting/qa` and one-time `npx playwright-core install chromium`. It writes screenshots at each viewport — open `375` and `1280` in light and dark and look at them. Do not review layout you have not seen.

## 2. Check, in priority order

**Critical — blocks shipping**
- Text or control contrast below 4.5:1 (text) / 3:1 (UI, focus ring), in light, dark or high contrast.
- Something reachable by mouse but not keyboard; focus invisible, trapped or hidden behind a sticky bar.
- Unlabelled input or icon button; placeholder used as label; color as the only signal.
- Essential content that only appears through animation, or motion over 5s with no pause (WCAG 2.2.2).
- Horizontal page scroll at 375px; content hidden behind fixed bars or the keyboard.

**Serious — fix before handoff**
- Heading levels skip or are chosen for size (use `Heading level` + `size`).
- Touch targets under 44px without `.ui-hit-area`; hover-only actions.
- Errors not linked to fields, no `FormErrorSummary` focus after a failed submit.
- Layout shift from media without `Image`/`AspectRatio`, or spinners where `Skeleton` fits.
- Raw colors, physical `ml-/pl-/left-` utilities, `100vh`, `"use client"` on static components.
- Motion that ignores reduced motion, animates width/height/top/left, or loops without purpose.
- More than one primary action per view; ambiguous button copy ("Submit", "Click here").

**Moderate — visual design**
- No clear hierarchy: the eye has nowhere to land first; more than ~3 type sizes per section.
- Spacing off the scale or inconsistent between siblings; misaligned edges.
- The accent used on everything; more than two meaningful colors.
- The banned defaults from **ux-sting-taste** §3 (generic hero, three identical cards, gradient text).
- Lines over ~75 characters, paragraphs over ~4 lines.

**Minor — polish**
- Numbers without `tabular-nums`; dates or currency not formatted with `Intl`.
- Long words or URLs that overflow (`ui-wrap-anywhere`).
- Missing empty, loading or error states (`EmptyState`, `ErrorState`, `Skeleton`).
- RTL: directional icons not mirrored (`rtl:rotate-180`), text alignment not logical.

## 3. Report

One table, most severe first. Every finding needs a location and evidence, not an impression.

| Severity | Where | Problem | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | `src/app/shop/page.tsx:42` | Icon button has no name | axe `button-name` | Add `aria-label="Remove item"` |

Then fix every critical and serious finding, re-run section 1, and say plainly what was fixed, what was left and why. Never report a check as passing if you did not run it.
