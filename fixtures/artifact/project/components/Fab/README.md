# Fab

A floating action button for the primary action on a screen.

`mat-fab`, `mat-mini-fab` and extended FABs, themed by `theme-helix-buttons` in `overrides.scss`.

- Shape is `fab-container-shape` (28px) for both default and small — rounded, not the 2px of normal buttons.
- Default colour is the **secondary** variant (`components-secondary-filled`).
- `.hlx-btn-accent` → purple-600 container, `text-invert`. `.hlx-btn-negative` → red container. `.hlx-btn-invert` → `surface-primary` container with `icon-primary`, for dark grounds.
- Small FABs use the same 28px shape via `--mat-fab-small-container-shape`.

Consumer supplies: the icon (and label, for extended), plus the variant class. One FAB per screen.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/fab.stories.ts` (`Components/FAB`). The top example is its **Matrix** story; the Playground below has that story file's controls.
