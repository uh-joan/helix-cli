# Table

Data tables make information easy to scan for patterns.

`table mat-table` with `.hlx-table`:

- Header cells: `surface-minimal`, `body-small` at weight 600.
- Body rows: white, `body-small`.
- Row separators: `border-secondary`.
- Cell and header height follow density (Foundations › Density). For large or interactive data use the Data grid.

Consumer supplies: the data source, column definitions, and sort/pagination (`mat-sort-header`, `mat-paginator`). For large grids, CDX also ships an AG Grid theme (`theme-ag-grid`).

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/table.stories.ts` (`Components/Table`). It shows the **Playground** story with that story file's controls.
