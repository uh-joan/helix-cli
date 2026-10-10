# Button

Buttons trigger actions; in Helix the primary action is ink (`components-primary-filled`), not colour.

Angular Material `mat-button` family (`matButton="filled" | "outlined" | "tonal" | "text"`, plus `mat-fab`, `mat-mini-fab`, `mat-icon-button`) restyled by `theme-helix-buttons` in `overrides.scss`.

- **Default**: filled = `components-primary-filled` + `text-invert`, hovering to `components-button-hover-background` (black). Outlined = 1px `components-primary-outline`, 4% black hover. Tonal = `components-secondary-filled`.
- **`.hlx-btn-accent`**: purple-600 fill (`components-accent-filled`), 16% black hover layer; outlined/text in purple with a 4% purple layer. Use for at most one emphasised action per view.
- **`.hlx-btn-negative`**: `components-negative-filled` (red-500) for destructive actions; outlined/text in `text-negative`.
- **`.hlx-btn-invert`**: for buttons on `surface-invert` (white outline, white FAB with `icon-primary`).
- **Size**: `.hlx-btn-large` (56px tall, 18px × 32px padding), default, `.hlx-btn-small` / `-xsmall` / `-xxsmall` (Material density −1/−2/−3).
- Corners are `border-radius-default` (2px); FABs use `fab-container-shape` (28px).
- Label in `label-large`, sentence case, a verb.
- Size is also set by density (see Foundations › Density); heights come from Angular Material, the Helix classes set the step.

Consumer supplies: the label (and optional `mat-icon`), the variant attribute and any `hlx-btn-*` class. Don't put two accent buttons side by side; don't use negative for anything reversible.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/button.stories.ts` (`Components/Button`). The top example is its **Matrix** story; the Playground below has that story file's controls.

What the live theme shows that the static card hid:

- `tonal` keeps Material's full pill shape (9999px), not `border-radius-default`, and for primary, negative and AI it renders the same near-black fill — only accent has its own tonal colour.
- `elevated` on `invert` paints white text on a near-white container, so the label disappears.
