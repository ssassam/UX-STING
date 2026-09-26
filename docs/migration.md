# Migration

UX-STING borrows familiar APIs, so moving from another library is mostly mechanical.

## From shadcn/ui

Structure and names are close by design (`Dialog*`, `DropdownMenu*`, `Card*`, `cn`). Differences:

| shadcn/ui | UX-STING |
| --- | --- |
| `cva()` | `createVariants()` (same shape, supports boolean and compound variants) |
| `--primary` etc. | `--ui-primary` (prefixed, OKLCH, includes `-hover`, `-subtle`) |
| `Button size="default"` | `size="md"` |
| `Sheet side="left/right"` | `side="start/end"` (RTL-aware) |
| `npx shadcn add` | `npx ux-sting add` (+ lockfile protecting local edits) |
| `sonner` | built-in `toast()` / `<Toaster />` |
| `cmdk` | built-in `Command` |
| `react-day-picker` | built-in `Calendar` |

## From MUI

| MUI | UX-STING |
| --- | --- |
| `color="primary"` | `variant="default"` |
| `variant="contained/outlined/text"` | `variant="default/outline/ghost"` |
| `sx` / `styled` | `className` + tokens |
| `ThemeProvider` + `createTheme` | `UIProvider theme={…}` + `createTheme` from `@ux-sting/themes` |
| `TextField` | `Field` + `Input` |
| `Autocomplete` | `Combobox` / `Autocomplete` |
| `DataGrid` | `DataTable` / `DataGrid` |
| `Snackbar` | `toast()` |

## From Chakra UI

Chakra's style props map to utilities or responsive props: `<Stack spacing={4} direction={{ base: "column", md: "row" }}>` → `<Stack gap="4" direction={{ base: "column", md: "row" }}>`. `useDisclosure`, `useControllableState` and `useMediaQuery` exist in `@ux-sting/hooks` with similar signatures. `colorScheme="red"` → `variant="destructive"`.

## From HeroUI

`color="primary" variant="solid"` → `variant="default"`; `variant="bordered"` → `"outline"`; `variant="light"` → `"ghost"`; `isDisabled`/`isLoading` → `disabled`/`loading`; `onPress` → `onClick`.
