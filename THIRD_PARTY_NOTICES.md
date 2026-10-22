# Third-party notices

UX-STING is original work licensed under MIT (see `LICENSE`). This file
lists third-party software and material that UX-STING depends on,
redistributes, or adapted, together with their licenses. Licenses were
checked against each project's repository at the time of writing.

## Redistributed data

### Lucide icons — ISC License

`packages/icons/src/icons/*` is generated from the SVG node data of the
[`lucide`](https://github.com/lucide-icons/lucide) package by
`scripts/generate-icons.mjs`. The full license, including the MIT notice for
icons derived from Feather (Copyright (c) 2013-present Cole Bemis), is shipped
as `packages/icons/LICENSE-lucide`.

```
ISC License
Copyright (c) 2026 Lucide Icons and Contributors
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

## Runtime dependencies (not redistributed in source form)

| Package | License | Used for |
| --- | --- | --- |
| `@radix-ui/react-*` (accordion, alert-dialog, checkbox, collapsible, context-menu, dialog, direction, dropdown-menu, hover-card, menubar, navigation-menu, popover, radio-group, scroll-area, select, slider, switch, tabs, toggle-group, tooltip) — Copyright (c) 2022 WorkOS | MIT | Accessible behavior (focus management, dismissal, ARIA) behind ux-sting's own API |
| `tailwind-merge` — Copyright (c) 2021 Dany Castillo | MIT | Class conflict resolution in `cn()` |
| `react`, `react-dom` (peer) — Copyright (c) Meta Platforms, Inc. | MIT | — |
| `playwright-core` (`@ux-sting/qa`) — Copyright (c) Microsoft Corporation | Apache-2.0 | Driving headless Chromium |
| `axe-core` (`@ux-sting/qa`) — Copyright (c) Deque Systems, Inc. | MPL-2.0 | Accessibility rules, injected unmodified into the page under test |

Build/dev-only tools (TypeScript, Tailwind CSS, Vite, Vitest, Testing
Library, axe-core (MPL-2.0, used only in tests), ESLint, Prettier,
Storybook, Playwright, Next.js, Turborepo) are not redistributed.

## Adapted guidance

### UI/UX Pro Max skill — MIT License

The prioritized UX rule categories, several rule descriptions and the
pre-delivery checklist in `docs/ux-quality.md` and
`.claude/skills/ux-sting/SKILL.md` are adapted from
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
(`.claude/skills/ui-ux-pro-max/SKILL.md` and its `references/`).

```
MIT License
Copyright (c) 2024 Next Level Builder
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

### design-taste skills — MIT License

The design-read step, the list of banned AI defaults, the craft rules and the
pre-flight checklist in `.claude/skills/ux-sting-taste/SKILL.md`, and parts of
the visual-design checks in `.claude/skills/ux-sting-review/SKILL.md`, are
adapted from [madebymustafa/design-taste](https://github.com/madebymustafa/design-taste)
(`skills/design-taste/SKILL.md` and the genre packs), rewritten for UX-STING's
components, tokens and theme presets.

```
MIT License
Copyright (c) 2026 Mustafa
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

### Better Design — MIT License

The "preserve the existing design system" rule and the review-before-handoff
loop in `.claude/skills/ux-sting-taste/SKILL.md` and
`.claude/skills/ux-sting-review/SKILL.md` are adapted from the workflow in
[marvkr/better-design](https://github.com/marvkr/better-design)
(`skills/better-design/SKILL.md`).

```
MIT License
Copyright (c) 2026 Marvin Kaunda
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

### Claude SEO — MIT License

The list of retired Google rich-result features and several validation checks
(missing `@context`/`@type`, relative URLs, placeholder text, self-serving
reviews) in `packages/seo-schema` were informed by the checklists in
[AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)
(`skills/seo-schema/SKILL.md`). The code is an original TypeScript
implementation; each Google rule cites the official Google page it follows.

```
MIT License
Copyright (c) 2026 agricidaniel
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

The motion and background components (`text-effect`, `rotating-text`,
`animated-number`, `reveal`, `marquee`, `scroll-progress`, `spotlight`,
`image-comparison`, `background`) are original implementations. The idea of
offering them was inspired by Motion-Primitives, trickle, Paper Shaders, Canvas
UI and UI Layouts, but no code from those projects is included.

## Agent integrations (not redistributed)

`.claude/settings.json` registers the **diagram-design** plugin marketplace
(<https://github.com/cathrynlavery/diagram-design>, MIT, © 2025 Cathryn
Lavery) so Claude Code can install it from its own repository. The
`ux-sting-diagrams` skill only describes how to use it with UX-STING; none of
its files are included here.

The `ux-sting-3d` skill summarizes guidance from three.js's `docs/llms.txt`
(<https://github.com/mrdoob/three.js>, MIT, © 2010–2026 three.js authors) and
links to it. No three.js code is included; projects install `three` from npm.

## Photos in examples

Example applications and docs demos hotlink photos from Unsplash
(Unsplash License) and avatars from pravatar.cc for illustration only; no
images are redistributed in this repository.

### Storefront UI — MIT License

The layouts and behavior of `QuantitySelector`, `SwatchGroup`/`Swatch`,
`ProductGallery`, `OrderSummary`, `MegaMenu`, `CartLineItem`,
`AddressFields`/`PaymentFields`, `ProductListing` and `ProductDetails`
(`packages/react/src/components/`) are adapted from the e-commerce blocks of
[vuestorefront/storefront-ui](https://github.com/vuestorefront/storefront-ui)
(QuantitySelector, ProductDetails, Gallery, OrderSummary, MegaMenu, cart,
checkout and category page blocks). They were
rewritten for UX-STING's tokens, Radix primitives and accessibility rules.

```
MIT License
Copyright (c) 2023 Vue Storefront
```

## Ideas only (no code)

### playwright-cli — Apache-2.0

`@ux-sting/qa` follows the agent-facing conventions of
[microsoft/playwright-cli](https://github.com/microsoft/playwright-cli):
short commands, small outputs, details written to files instead of
accessibility-tree dumps in the agent's context. No playwright-cli code is
copied; `@ux-sting/qa` uses `playwright-core` directly.

### Remotion — Remotion License (not redistributed)

The motion helpers in `packages/utils/src/motion.ts` (`interpolate`,
`spring`) and `packages/hooks/src/use-tween.ts` follow the API ideas
popularized by [remotion-dev/remotion](https://github.com/remotion-dev/remotion).
They are independent implementations of standard math (piecewise-linear
mapping, the closed-form damped harmonic oscillator, cubic-bézier solving).
No Remotion source is copied or redistributed, and UX-STING does not
depend on Remotion, whose license is not an OSI open-source license.

### logo-design skill — MIT License

`.claude/skills/logo-design/` (SKILL.md, `references/`, `templates/`,
`scripts/` and the aggregate `assets/library/stats.json`) is copied from
[kaankiziltug/logo-design-skill](https://github.com/kaankiziltug/logo-design-skill),
with a UX-STING section added to SKILL.md and `preview_sheet.py` patched to
run without the reference library. The upstream library of real-world logos
is third-party trademarks and is **not** included. Full license:
`.claude/skills/logo-design/LICENSE`.

```
MIT License
Copyright (c) 2026 kaankiziltug
```
