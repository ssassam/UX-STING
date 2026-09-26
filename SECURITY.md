# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report them privately through GitHub: **Security → Report a vulnerability** on this repository ([private vulnerability reporting](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)).

Include the affected package or demo, steps to reproduce and the impact. You can expect a first reply within 7 days.

## Supported versions

Only the latest release of the `@ux-sting/*` packages receives security fixes.

## What this project does to stay safe

- No runtime secrets: the packages and demo sites are fully static.
- Dependency install scripts are blocked by pnpm; allowed exceptions are listed in `pnpm-workspace.yaml`.
- `pnpm audit` is part of CI, and Dependabot proposes weekly dependency and GitHub Actions updates.
- GitHub Actions run with least-privilege tokens (`contents: read`; the Pages deploy additionally gets `pages: write` and `id-token: write`).
- Components never render user HTML; the only inline scripts are the theme bootstrap (JSON-escaped) and schema.org JSON-LD (escaped).
