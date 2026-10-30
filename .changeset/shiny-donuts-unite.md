---
"@ux-sting/tokens": minor
"@ux-sting/extract": minor
"ux-sting": minor
---

Add `ux-sting tokens export` — export the UX-STING design tokens to portable,
framework-agnostic formats: W3C Design Tokens JSON (DTCG), CSS custom properties,
SCSS variables and a Tailwind CSS v4 `@theme` mapping (`--format dtcg,css,scss,tailwind`,
`--out <dir>`). The emitters live in `@ux-sting/tokens`; the command runs via
`@ux-sting/extract`. Use `tokens.json` to drive non-React stacks (Vue, Svelte,
native, Figma, Style Dictionary), making the design system usable beyond React.

Also fixes CLI path handling on Windows: the entry guard now matches backslash
`process.argv[1]` (every command was silently no-opping), `build-registry` keeps
`registryDependencies` and POSIX file paths regardless of OS, and `ux-sting add`/
`diff` write portable lockfile keys. The `ux-sting-design-agent` skill is now
stack-aware (detects the stack, builds non-React targets from the exported tokens,
keeps browser QA for every stack).
