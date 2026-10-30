# Discovery & launch kit — UX-STING Agent Skills

Copy-ready copy for getting the repo found. Everything here is factual against the
published `ux-sting@0.6.2` CLI and the 8 skills + 1 Universal Design Agent.

## One-liners (pick by length)

- **36 chars:** Accessible, art-directed UI skills for coding agents
- **72 chars:** Teach Claude, Cursor, Codex & Copilot to build accessible, designed UI
- **120 chars:** Agent Skills + a Universal Design Agent that make coding agents build accessible, themeable, art-directed UI with the MIT UX-STING React system. Works in Claude Code, Cursor, Codex, VS Code, Gemini & Qoder.

## The pitch (README / About)

8 cross-host **Agent Skills** and one **Universal Design Agent** that turn any coding
agent into a design-literate one. They read the brief, pick real `@ux-sting/*` components
and tokens, art-direct pages that don't look generated, add accessible three.js and
diagrams, and **always verify in a browser** (`npx ux-sting qa`) before finishing. One
Markdown source generates installs for Claude Code (native plugin), Codex, Cursor,
GitHub Copilot / VS Code, Gemini CLI and Qoder. MIT, free to use and contribute —
please credit [VELTEIN](https://veltein.com) and [UX-STING](https://github.com/ssassam/UX-STING).

## Tags / keywords

`agent-skills`, `claude-code`, `cursor`, `codex`, `copilot`, `vscode`, `gemini`,
`qoder`, `design-system`, `accessibility`, `wcag`, `react`, `nextjs`, `tailwind`,
`ux`, `art-direction`, `threejs`, `a11y`, `mcp-free`

## skills.sh / `npx skills add`

Repo slug: `ssassam/ux-sting-agent-skills`
Install: `npx skills add ssassam/ux-sting-agent-skills`
Category: Design / Frontend · License: MIT · Trigger: any web-UI build or review task.

## awesome-agent-skills PR entry

```markdown
- [UX-STING Agent Skills](https://github.com/ssassam/ux-sting-agent-skills) — 8 skills +
  a Universal Design Agent for accessible, art-directed React/Next.js UI with UX-STING;
  installs into Claude Code, Cursor, Codex, Copilot/VS Code, Gemini and Qoder from one
  source. MIT. `npx skills add ssassam/ux-sting-agent-skills`
```

Also submit to: awesome-claude-code (plugins), awesome-cursorrules, awesome-copilot,
awesome-gemini, the Agent Skills directory (agentskills.io), and the Qoder plugin
marketplace.

## Launch post — X / Threads (thread opener)

```
Your coding agent can write React. It can't design.

I packaged 8 UX skills + a Universal Design Agent so Claude, Cursor, Codex,
Copilot and Gemini build ACCESSIBLE, art-directed UI with the MIT UX-STING system —
and verify every page in a browser before they say "done".

One repo, installs everywhere ↓
```

Follow with: (1) what the agent does, (2) the routing table, (3) the browser-QA step,
(4) before/after screenshots, (5) `npx skills add …`, (6) MIT + credit VELTEIN.

## Hacker News (Show HN)

**Title:** Show HN: UX-STING – Agent Skills that make AI code accessible, designed UI

**Body:**
> We ship the same 8 skills + a "Universal Design Agent" to Claude Code, Cursor,
> Codex, Copilot/VS Code, Gemini and Qoder from one Markdown source. The agent reads
> the brief, uses real design-system tokens (no raw hex), enforces WCAG 2.2 AA, picks
> openly-licensed images, and always renders + audits the page with `npx ux-sting qa`
> before reporting done. MIT, free to contribute. Repo: https://github.com/ssassam/ux-sting-agent-skills · CLI: https://www.npmjs.com/package/ux-sting

## Reddit / Dev.to

Subreddits: r/webdev, r/reactjs, r/nextjs, r/accessibility, r/ClaudeAI, r/cursor.
Angle: "Make any coding agent design-literate" + a concrete before/after and the a11y
QA output. Avoid "another component library" framing — the hook is *agent behaviour*,
accessibility, and one-source-many-hosts.

## Proof to include in posts

- Before/after `ux-sting qa` findings (e.g. the live Wayfare demo's 16 serious contrast issues → fixed to 0).
- The 3-direction `ux-sting-explore` grid.
- A `ux-sting-taste` page vs a generic AI page, labelled.
- npm badge + the live command list from `npx ux-sting`.

## Attribution (always keep)

MIT © [Issam El Bani — VELTEIN](https://veltein.com). Credit **VELTEIN** and
**UX-STING**; preserve `THIRD_PARTY_NOTICES.md` (adapted MIT works: UI/UX Pro Max,
taste-skill, design-taste, diagram-design, logo-design).

## Final launch copy (ready to post)

### X / Threads — 6-tweet thread

```
1/ Your coding agent can write React. It can't design.

It ships contrast failures, generic purple-gradient heroes, uncredited stock, and 100vh bugs — then says "done."

So I packaged UX-STING's design rules as Agent Skills. Now any agent designs like a senior product designer.

2/ It's 9 skills — 8 that teach UI/brand work, plus a "Universal Design Agent" that reads the brief, routes to the right one, and won't stop until it has rendered and audited the page.

Install (detects your tool):
npx skills add ssassam/UX-STING

3/ What the skills enforce, every time:
- WCAG 2.2 AA — keyboard, focus, contrast, RTL
- Semantic design tokens, no raw hex
- Real openly-licensed images, credited automatically
- Server components by default

It's a senior designer's checklist, in Markdown.

4/ It always verifies in a browser before claiming "done":

npx ux-sting qa <url> --viewports 375,768,1440

axe errors, horizontal overflow, cramped text — measured, ranked by severity, then fixed. No more "looks good" you never rendered.

5/ One Markdown source installs everywhere:
Claude Code · Cursor · Codex · GitHub Copilot / VS Code · Gemini CLI · Qoder.

Claude Code native plugin:
/plugin marketplace add ssassam/UX-STING
then /plugin install ux-sting@ux-sting

6/ MIT — free to use and to contribute. I only ask that you keep the license notice and credit VELTEIN + UX-STING.

Repo + prebuilt zips (Releases):
github.com/ssassam/UX-STING
Made by veltein.com
```

### Hacker News — Show HN

Title: Show HN: UX-STING Agent Skills – make AI coding agents build accessible, designed UI

Body:
> We ship the same 9 skills + a "Universal Design Agent" to Claude Code, Cursor, Codex, Copilot/VS Code, Gemini and Qoder from one Markdown source (a folder of SKILL.md files).
>
> The agent reads the brief, uses real design-system tokens (never raw hex), enforces WCAG 2.2 AA, picks openly-licensed images with credit, and always renders + audits the page with `npx ux-sting qa <url> --viewports 375,768,1440` before it reports done — so the accessibility numbers are measured, not assumed.
>
> The skills install without cloning the repo: `npx skills add ssassam/UX-STING`. In Claude Code it's a native plugin: `/plugin marketplace add ssassam/UX-STING` → `/plugin install ux-sting@ux-sting`.
>
> Repo: https://github.com/ssassam/UX-STING · CLI: https://www.npmjs.com/package/ux-sting · Made by VELTEIN: https://veltein.com

## Verified proof (2026-10-30)

Live axe-core audit of https://ssassam.github.io/UX-STING/ (the "Wayfare" demo), run in a real browser:
- Design: renders as a polished, professional travel site (hero, real photography, structured sections).
- Accessibility: **1 violation type — `color-contrast`, 16 elements, all "serious."**
- Honest hook: "a good-looking UX-STING site still had 16 contrast failures that `ux-sting qa` catches." Fixing them to 0 is the ideal launch screenshot.

## Ready-to-submit listing entries (verified format)

VoltAgent/awesome-agent-skills (format `- owner/skill - description`):

```
- ssassam/ux-sting - Build accessible, themeable UI with the UX-STING React system
- ssassam/ux-sting-taste - Art-direct pages that look designed, not generated
- ssassam/ux-sting-review - Accessibility/UX/design review with severity ranking
- ssassam/ux-sting-design-agent - Universal design agent that routes UI tasks and always verifies
```

- skills.sh: repo is public with skills, so `npx skills add ssassam/UX-STING` already works; submit via the skills.sh "add skill" flow for the directory/leaderboard.
- Qoder marketplace: submit `ux-sting-qoder-plugin.zip` (from the `agent-skills@0.1.0` Release).
- Also: ComposioHQ/awesome-claude-skills, heilcheng/awesome-agent-skills, BehiSecc/awesome-claude-skills.
