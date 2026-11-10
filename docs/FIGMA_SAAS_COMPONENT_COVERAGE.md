# Figma SaaS dashboard expansion — coverage audit

Status: **public-reference implementation built; private component/variant inspection unverified**. Public previews of both supplied files were rendered and reviewed. Anonymous Figma viewing permits visual review but presents a sign-up requirement for inspection. No complete component/variant count is claimed.

## Sources

- [BRIX charts](https://www.figma.com/design/eDja80FSqE1nJAHSJfl9y3/?node-id=9-47): visible Bar Charts, Line Charts, Pie Charts, and Others groups.
- [SaaS dashboard](https://www.figma.com/design/EdqkBItc03fRE0IWY3e5dD/?node-id=0-1): the 22 visible composition labels below.

## Existing library

The active library checkout contains **115 component families**. The complete observed directory inventory is recorded in [figma-saas-component-inventory.json](./figma-saas-component-inventory.json). Existing chart primitives include LineChart, AreaChart, BarChart, BarList, DonutChart, Sparkline, ChartMetrics, legends, tooltips, and accessible chart tables. Existing primitives already cover tables, calendars, dialogs, drawers, forms, navigation, status badges, statistics, notifications/toasts, and inputs.

## Visible SaaS composition labels

1. Dashboard Navigation
2. Dashboard
3. Invoice List
4. Invoice List-Dropdown
5. Schedule List
6. Board List
7. Customer List
8. Add Customer
9. Create event
10. Product
11. Add Product
12. Create Invoice
13. Calendar Month
14. Task view
15. Calendar year
16. Task preview timeline
17. Calendar day
18. Sign Up
19. Login
20. Recover
21. Confirm
22. Chat

## Implementation sequence

1. Read both full source documents and enumerate components, instances, variants, nested parts, tokens and screen compositions. Assign every source item a coverage row rather than estimating completeness from the gallery.
2. Map each item to an existing primitive, a new reusable chart family, a composition, or an asset. Preserve provenance and record any source areas that cannot be inspected.
3. Implement missing components with controlled props, explicit data, loading/empty/error states, keyboard interaction, RTL, reduced motion, theme tokens, and accessible data equivalents.
4. Add stories, docs demos, registry metadata, exports, API documentation, meaningful tests and a Changeset for each library addition.
5. Package the verified library through its supported consumer entry points. Apply the new SaaS template to the engine while retaining all consumer requirements recorded in the JSON inventory.
6. Validate the library, engine build, real integrations, interactions, privacy restoration, full-value number tooltips, mobile and dark mode. Only mark complete when every source inventory row has evidence.

## Original audit notes

CompactNumber and screenshot-mode presentation controls have been implemented in the engine as requested during this task. These are consumer implementations; they have not been represented as completed Figma component imports or as a new library release. The engine now consumes a packed build of the extended library through supported package exports and includes the independently implemented SaaS Portfolio template, with Classic Engine retained as an option.


## Implemented public-reference coverage

The library adds **20 exports**, including **8 chart components** and **12 SaaS compositions**. Existing primitives are reused for tables, menus, dialogs, calendars, navigation, controls and forms. New source is original React/SVG code guided by the public visual boards; no Figma asset or font has been copied.

| Public composition | Implementation |
| --- | --- |
| Dashboard Navigation / Dashboard | Existing Sidebar + DashboardToolbar, DashboardGrid, DashboardPanel, MetricSummary, LineChart and PieChart |
| Invoice List / Invoice List-Dropdown | DataTable, editable records, row actions, invoice action menu and CSV export |
| Schedule List | ScheduleView with chronological ISO dates |
| Board List | WorkBoard with controlled moves and keyboard-operable select menus |
| Customer List / Add Customer | DataTable + RecordEditor in Dialog, create/edit/delete |
| Create event | RecordEditor with start/end validation; events appear in the scheduler |
| Product / Add Product | MetricSummary + charts + product DataTable and product editor |
| Create Invoice | InvoiceComposer with editable quantities/prices, line add/remove, tax and currency totals |
| Calendar Month / Calendar year / Calendar day | ScheduleCalendar with accessible existing Calendar and selected-period agenda |
| Task view | DataTable with controlled task status |
| Task preview timeline | TaskTimeline with clipped date spans and explicit readable dates |
| Sign Up / Login / Recover / Confirm | AuthPanel + native validated RecordEditor, password inputs and confirmation composition |
| Chat | Conversation with async submit, draft preservation on errors and controlled message history |

All 22 screen labels can be selected in the **Workspace** demo on `/components/saas-dashboard`. Its fixtures are expressly labelled fictional, session-local documentation data. It does not pretend to provide CRM persistence, real authentication or live analytics. Engine uses its existing authenticated API, SQLite history and Google integrations.

### BRIX chart-family mapping

| Public visual pattern | Coverage |
| --- | --- |
| Online users, grouped demographics, summary sales, weekly columns | Existing BarChart (single/grouped), colors pinned per series |
| Subscription and sales stacks | Existing stacked BarChart and normalized HorizontalBarChart |
| Popular countries, browser usage, age/gender comparisons | Existing BarList plus grouped/stacked HorizontalBarChart |
| Sales low/high/open/close | RangeChart with validation and four-value accessible table |
| Sales activity, users, income, customers, account reach | Existing LineChart / AreaChart, multiple series, gaps and keyboard inspection |
| Dashed sales report / comparison lines | LineChart explicit dashed series and persistent custom colors |
| KPI mini charts | Existing Sparkline and MetricSummary |
| Productivity rings | RingChart with independent maxima |
| Credit score and sales goals | GaugeChart with bounded geometry and explicit unavailable values |
| Half-ring visits and total viewers | PieChart semicircle + innerRadius |
| Monthly activity, yearly income and device/browser usage | Existing DonutChart plus PieChart ring/solid variants |
| Sales overlaid with a trend or target | ComboChart bars/lines sharing one measure and one axis |
| Server bubbles | ScatterChart with sized points and arrow-key inspection |
| Review qualification | SegmentChart with values and proportions |
| Sales closed | ComboChart lollipop series |
| Extruded/3D-styled lead columns in preview | Accessible flat BarChart counterpart; decorative 3D extrusion is not reproduced |

This is a functional public-reference mapping, **not proof that every private Figma layer or nested variant has been imported**. Hidden source structure remains unverified. A pending Changeset records the package addition; the Engine consumes a vendored tarball rather than an unpublished npm version or monorepo source imports.

## Verification artifacts

- Library render/interaction/a11y tests: `packages/react/src/__tests__/saas-dashboard.test.tsx` and existing chart suite.
- Library docs and package typechecks, component ESLint, generated API/README/registry and static UX audit.
- Browser gallery walkthrough: `/opt/article-engine/state/verify-ux-sting-gallery.mjs`.
- Engine template/navigation/filters/mobile/privacy checks: `/opt/article-engine/state/verify-saas-template.mjs`.
- Engine data and earlier feature regressions: portfolio refinement and screenshot-domain-only browser suites.
