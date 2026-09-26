# Patterns

Patterns are generic, composable building blocks for real products. They contain no brand assumptions and are built only from core components.

## Local discovery & directories

| Need | Component |
| --- | --- |
| Business / place / restaurant / hotel / service cards | `BusinessCard`, `PlaceCard`, `RestaurantCard`, `HotelCard`, `ServiceCard` |
| City and category browsing | `CityCard`, `CategoryCard` |
| Reviews | `ReviewCard`, `Rating`, `ReviewStars` |
| Search | `SearchInput`, `SearchResults`, `SearchResult`, `Highlight` |
| Filters | `FilterPanel`, `FilterSection`, `FilterChips` |
| Map | `MapPanel`, `MapPlaceholder` (swap for a provider later) |
| Hours | `OpeningHours`, `OpenStatus` (overnight-aware) |
| Price | `PriceLevel`, `PriceRange`, `Price` |
| Location | `Location`, `LocationCard` |
| Lead generation | `LeadForm` |
| Ownership | `ClaimBusiness`, `VerifiedBadge`, `PremiumBadge` |

## Commerce

`ProductCard`, `Price` (with compare-at), `Rating`, `FilterPanel`, `Pagination`, `NumberInput` (quantities), `RadioCard` (shipping), `Stepper` (checkout).

## Content & editorial

`ArticleCard` (vertical, horizontal, featured), `ProfileCard` (authors), `Prose`, `Blockquote`, `Tabs`, `Breadcrumb`, `LeadForm` (newsletter variant with `hidePhone`).

## SaaS & dashboards

`SidebarProvider` shell, `StatCard`, `DataTable` with bulk actions, `CommandDialog`, `Toaster`, `Timeline`, `Tabs`.

All four example applications in `examples/` are built exclusively from these parts.
