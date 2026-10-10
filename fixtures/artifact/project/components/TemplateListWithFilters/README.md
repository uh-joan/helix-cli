# List with filters

A results page: a toolbar with search and filters, the applied filters shown as removable chips, and a results table that handles its own loading, empty and error states. Status: **beta**.

**When to use** — browsing or searching a collection (alerts, documents, drugs, trials) the user narrows with filters.
**Avoid when** — a short fixed list that never needs filtering, or a single record (use a detail page).

## Anatomy

- **Toolbar** — a free-text search and a filter surface.
- **Applied filters** — every active filter as a removable chip (`mat-chip-row` + `matChipRemove`) in one row, with **Clear all**.
- **Results region** — a Page states region: loading (skeleton), empty, error (retry), loaded.

## Rules

- **Compose states** — give the results region all four states; over-filtering to zero rows is the empty state, with a Clear filters action.
- **Applied filters as chips** — the chips are the source of truth for what's filtered; the results derive from them.
- **Filter surface by size** — few filters inline in the toolbar; many or hierarchical filters behind a Filter button that opens a dialog (Dialogs) or a panel (Filters). Don't scatter filter controls.
- **Search is debounced** — search is a signal; derive filtered rows with `computed()`. Debounce the network call, not the local filter.
- **Derive, don't store** — keep filter state (term, facets) as signals and derive the visible rows; don't hand-sync a second filtered list.

Avoid: an empty table when filters match nothing; filter controls scattered with no single applied-state; filters applied but not shown.

Uses: Text input/search, Menu, Chip, Table (or Data grid), Empty state, Dialog/Filters. See Page states.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/List with filters` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
