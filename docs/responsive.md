# Responsive design

## Breakpoints

| Name | Min width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Responsive props

Layout components accept per-breakpoint values:

```tsx
<Stack direction={{ base: "column", md: "row" }} gap={{ base: "3", lg: "6" }} />
<Grid columns={{ base: 1, sm: 2, lg: 4 }} />
<Grid minChildWidth="16rem" />   // intrinsic: no breakpoints needed
```

They compile to CSS variables (`--ui-cols-md: 2`) consumed by a small stylesheet, so they work in server components without generating dynamic class names.

## Component behavior

| Component | Small screens |
| --- | --- |
| Navbar | Links move into a sheet (NavbarMobileMenu) |
| Sidebar | Becomes a slide-in sheet |
| MobileNavigation | Bottom tab bar (hidden from `md`) |
| FilterPanel | Bottom sheet with active-count badge |
| Table / DataTable | Horizontal scroll region or `responsive="stack"` cards |
| Pagination | "Page x of y" with previous/next |
| DateRangePicker | One month instead of two |
| Dialog | Full width minus margins, scrolling body |
| MapPanel | Map above list |

### Grid as a vertical stack

A `grid` with a single implicit column sizes that column to the widest child's *min-content*, so a long word, a scrollable table or a carousel can push the page wider than the viewport. Use `Stack` for vertical stacking, or give the grid `grid-cols-[minmax(0,1fr)]`. Components that stack wide content internally (DataTable, FileUpload, docs demos) already do this.

Prefer composition (render both, hide with CSS) over JavaScript media queries so server rendering stays correct. `useMediaQuery`/`useBreakpoint` exist for behavior that CSS cannot express.
