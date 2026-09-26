# Third-party notices

unified-ui is original work licensed under MIT (see `LICENSE`). This file
lists third-party software and material that unified-ui depends on,
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
| `@radix-ui/react-*` (accordion, alert-dialog, checkbox, collapsible, context-menu, dialog, direction, dropdown-menu, hover-card, menubar, navigation-menu, popover, radio-group, scroll-area, select, slider, switch, tabs, toggle-group, tooltip) — Copyright (c) 2022 WorkOS | MIT | Accessible behavior (focus management, dismissal, ARIA) behind unified-ui's own API |
| `tailwind-merge` — Copyright (c) 2021 Dany Castillo | MIT | Class conflict resolution in `cn()` |
| `react`, `react-dom` (peer) — Copyright (c) Meta Platforms, Inc. | MIT | — |

Build/dev-only tools (TypeScript, Tailwind CSS, Vite, Vitest, Testing
Library, axe-core (MPL-2.0, used only in tests), ESLint, Prettier,
Storybook, Playwright, Next.js, Turborepo) are not redistributed.

## Reference projects (design and API research — no code copied)

unified-ui studied the public documentation, APIs and accessibility behavior
of the following projects. Component implementations in this repository are
original; where APIs look familiar (e.g. compound components such as
`DialogTrigger`/`DialogContent`, the `asChild` pattern, the `cn()` helper,
the copy-into-your-project CLI model), they follow widely used conventions.

| Project | License | Influence |
| --- | --- | --- |
| [shadcn/ui](https://github.com/shadcn-ui/ui) — Copyright (c) 2023 shadcn | MIT | Copy-the-source distribution model, compound component naming, CLI workflow |
| [Radix UI Primitives](https://github.com/radix-ui/primitives) — Copyright (c) 2022 WorkOS | MIT | Accessibility primitives (runtime dependency, see above), `asChild`/Slot pattern |
| [MUI / Material UI](https://github.com/mui/material-ui) — Copyright (c) 2014 Call-Em-All | MIT | Component breadth (data grid, date pickers, steppers), migration mapping |
| [Chakra UI](https://github.com/chakra-ui/chakra-ui) — Copyright (c) 2019 Chakra Systems Inc. | MIT | Token/theme system, responsive props, `useDisclosure`/`useControllableState` concepts |
| [HeroUI](https://github.com/heroui-inc/heroui) — Copyright (c) 2020 Next UI Inc. | MIT | Visual direction (soft surfaces, motion), Tailwind-based theming |
| [React Spectrum / React Aria](https://github.com/adobe/react-spectrum) — Copyright Adobe | Apache-2.0 | Keyboard and i18n behavior references (calendar, number parsing, RTL) |

## Adapted guidance

### UI/UX Pro Max skill — MIT License

The prioritized UX rule categories, several rule descriptions and the
pre-delivery checklist in `docs/ux-quality.md` and
`.claude/skills/unified-ui/SKILL.md` are adapted from
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
