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

## Photos in examples

Example applications and docs demos hotlink photos from Unsplash
(Unsplash License) and avatars from pravatar.cc for illustration only; no
images are redistributed in this repository.
