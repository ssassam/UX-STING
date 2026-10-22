# Anti-slop rules

Patterns that make a page look generated. Each is banned **unless the design read gives a reason** (the brand really is purple; the product really has three equal plans). `ux-sting qa` detects the ones marked **QA** and reports them as `slop:*` findings.

## Color and surface

| Pattern | Why it reads as slop | Do instead | QA |
| --- | --- | --- | --- |
| Indigo/violet → purple gradient hero or buttons | The default of every AI page builder | Flat theme surfaces + one accent from the client's world | `slop:purple-gradient` |
| Gradient-filled headline text | Decoration standing in for hierarchy | Solid color; emphasis from size, weight, italics, one accent word | `slop:gradient-text` |
| Glassmorphism on many cards | Blur as a substitute for structure | Blur only on one floating layer (nav, overlay) | `slop:glass-everywhere` |
| Floating blurred blobs / orbs | Texture with no meaning | `Grain`, `GridPattern`, a real photograph, or nothing | — |
| Accent on everything | Nothing stands out | One accent target per viewport | — |
| Neon glow shadows, dark mode by default for no reason | "Tech" cliché | Scheme chosen by the direction | — |

## Structure

| Pattern | Do instead | QA |
| --- | --- | --- |
| Centered pill badge + huge headline + two buttons + screenshot | A structure from the direction: split, index, poster, ledger, full-bleed photograph | — |
| Centered hero followed by three identical feature cards | Vary rhythm: indexed list, table, one big proof, alternating split | `slop:centered-hero-3-cards` |
| Cards inside cards inside cards | One surface level; hairlines and spacing for grouping | — |
| Every section the same height and padding | Let content decide; one tall moment, some tight bands | — |
| Logo wall of famous brands the client never worked with | Real proof or none | — |
| Fake browser/phone chrome around screenshots | Show the real UI, cropped with intent | — |

## Content

| Pattern | Do instead | QA |
| --- | --- | --- |
| "Unlock the power of…", "seamless", "cutting-edge", "next-generation", "elevate your", "supercharge", "game-changer", "to the next level", "all-in-one platform", "best-in-class" | Say what it does, for whom, with a concrete noun or number | `slop:generic-copy` |
| "Trusted by 10,000+ teams", "99.9% uptime", "10x faster" without a source | Real figures with source and date, or nothing | `slop:unsourced-stats` |
| Lorem ipsum or "Feature one / Feature two" | Real copy first; it decides the layout | `slop:lorem-ipsum` |
| Testimonials from "Sarah J., CEO" with a stock face | Real quotes with permission, or leave them out | — |
| Buttons that say "Get started" / "Learn more" everywhere | Verb + object: "Book a table", "See the 2026 menu" | — |

## Icons and imagery

| Pattern | Do instead | QA |
| --- | --- | --- |
| Emoji as icons or bullets 🚀 ⚡ 🔒 | `@ux-sting/icons`, or no icon at all | `slop:emoji-icons` (and `pnpm ux-audit` in source) |
| Generic stock ("diverse team smiling at laptop") | Real, credited images found through the unique list (`ux-sting images`) | — |
| AI-generated people or places presented as real | Real photographs, illustration that admits it is illustration, or typography | — |
| Icon in a colored circle above every paragraph | Only where an icon helps scanning | — |

## Type and motion

| Pattern | Do instead |
| --- | --- |
| One neutral sans for everything, all at similar sizes | Display/body contrast; ~3 sizes per section |
| Everything fades up on scroll | Motion only where the direction's budget spends it |
| Looping animations nobody asked for | One loop at most, with pause, respecting reduced motion |
