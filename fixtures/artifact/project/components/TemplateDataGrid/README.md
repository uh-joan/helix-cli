# Data grid wrapper

One place to set up **AG Grid** the Helix way — modules and licence registered once, a Theming-API theme built from Helix tokens, shared column defaults, and column-state persistence. Status: **stable**.

**When to use** — large, sortable, filterable or column-managed data: the results grid in a list page, an analytics table, anything beyond a simple `mat-table`.
**Avoid when** — a short, read-mostly list (use the Table / List with filters).

## Rules

- **Register once** — AG Grid modules and the licence are set once at bootstrap through a single provider (`provideHelixAgGrid()`), never `ModuleRegistry.registerModules` scattered across features.
- **Theming API** — use the AG Grid v36 Theming-API theme (`helixGridTheme`) bound with `[theme]`, built from the `--hlx-*` custom properties so the grid follows the app theme. Don't ship the legacy CSS theme for new grids.
- **Shared defaults** — use `HELIX_DEFAULT_COL_DEF` for sort/resize/filter/flex defaults; set per-column overrides on the column, not by re-declaring the defaults.
- **Persist columns** — persist column state (order, width, sort) per grid to `localStorage` (save on `stateUpdated`, restore on `gridReady`) with a **Reset columns** action.
- **Compose around** — the toolbar, applied-filter chips and loading/empty/error states come from List with filters and Page states; the grid is just the results surface.

Avoid: repeating module/licence registration; the legacy `ag-theme` CSS override instead of the Theming API; bespoke `.ag-*` CSS overrides instead of theme params; a column-managed grid that forgets the user's layout on reload.

> Note: the repo's `ag-theme-helix.css` is the AG Grid 32 theme-builder output while the code is on AG Grid 36 — this pattern is the v36 Theming-API replacement.

The Helix AG Grid API is now shipped from `@cdx/theme-ag-grid`: `provideHelixAgGrid()`, the `helixGridTheme`, `HELIX_DEFAULT_COL_DEF`, and shared cell renderers: `helixChipCellRenderer` (renders a value as a neutral Helix chip in a cell) and `helixDateCellRenderer` (formats dates consistently, e.g. "2 Oct 2026").

Uses: AG Grid, Button. Composes with List with filters and Page states. Related: the Data grid component card.

Preview: static HTML rendition; the real grid is AG Grid, not a Material table.
