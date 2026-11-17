# @ux-sting/mcp

Start with `node packages/mcp/dist/cli.js` from the repository root after `pnpm build`. Or use the installed `ux-sting-mcp` bin. The package exports `createServer({ rootDir? })` for embedding. Transport is stdio; stdout is reserved for JSON-RPC.

Ten tools: list_themes, get_theme, export_design_md, import_design_md, plan_design, validate_design, generate_app, extract_tokens, audit_page, compare_screenshots.

All arguments have Zod schemas. Browser tools require Chromium and use existing QA guards. Screenshot files must resolve within rootDir (default working directory). Generation returns files for review; it does not install dependencies or overwrite projects. See [configuration](../../docs/GAP_IMPLEMENTATION_STATUS.md).
