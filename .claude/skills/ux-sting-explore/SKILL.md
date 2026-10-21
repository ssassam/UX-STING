---
name: ux-sting-explore
description: "Explore several design directions for one UX-STING screen side by side before committing to one. Use when someone asks for options, variations, alternatives, concepts, mockups, 'show me a few ideas', 'try different styles', or when a brief is open-ended (new landing page, hero, pricing page, onboarding) and picking a single direction up front would be a guess."
---

# UX-STING explore — three directions, then choose

Designing one option means guessing. Build a few deliberately different ones, compare them, and let the person choose. All variations use the same UX-STING components, so the winner is production code, not a mockup.

## 1. Frame the brief

Write the design read (see **ux-sting-taste** §1) and list the fixed parts every variation must keep: the content, the primary action, the brand theme if one exists, and the accessibility rules.

## 2. Pick three directions that really differ

Vary the direction, not the details. Changing a button radius is not a variation. A good set from the ux-sting-taste table:

- one **safe** direction matching the brief closely (often the existing brand theme),
- one **editorial or quiet** direction (`editorial` / `luxury`),
- one **bold** direction (`terminal` dark, `brutalist`, or an expressive motion budget).

Each variation differs in at least two of: theme preset, type pairing, layout structure, motion budget.

## 3. Build them in parallel

- Put each variation in its own route or file, e.g. `examples/<app>/app/explore/a/page.tsx`, `/b`, `/c`, or `apps/playground/src/explore/<name>-a.tsx`.
- Wrap each in its own `UIProvider theme="…"` (providers nest), so one page can show all three.
- If subagents are available and the person asked for speed, build each variation in its own subagent with the same brief and fixed parts; otherwise build them one after another.
- Keep shared content in one data file so the variations only differ in design.

## 4. Compare with evidence

Screenshot each variation at 390px and 1280px, light and dark. Present them side by side with one line per variation: the design read, what it is good for, and its risk. Run **ux-sting-review** §1 on each; a variation that fails a critical check is fixed or dropped, never presented as is.

## 5. Converge

When the person picks one (or "A's hero with C's type"), merge into the real page, delete the unused variations and their routes, and run the full review once more. Don't leave explore routes in a shipped example.
