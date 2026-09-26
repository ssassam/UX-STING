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

Prefer composition (render both, hide with CSS) over JavaScript media queries so server rendering stays correct. `useMediaQuery`/`useBreakpoint` exist for behavior that CSS cannot express.
