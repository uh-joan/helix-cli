# Chip

Chips are compact elements for an input, attribute, filter or status.

`mat-chip` / `mat-chip-option` / `mat-chip-row` with a Helix class from `theme-helix-chips`:

| Class | Fill | Text / icon |
|---|---|---|
| `.hlx-neutral-chip` | `components-secondary-filled` | `text-primary` |
| `.hlx-primary-chip` | `components-primary-filled` | `text-invert` |
| `.hlx-accent-chip` | `components-accent-filled` | `text-invert` |
| `.hlx-info-chip` | `components-info-filled` | `text-info` |
| `.hlx-positive-chip` | `components-positive-filled` | `text-positive` |
| `.hlx-warn-chip` | `components-warn-filled` | `text-warn` |
| `.hlx-negative-chip` | `components-negative-filled-light` | `color-red-900` |
| `.hlx-outlined-chip` | white, 1px `components-primary-outline` | `text-primary` |
| `.hlx-basic-chip` | transparent (4% black hover) | `text-primary` |

- Shape is `chip-container-shape` (16px), no outline on filled chips.
- Sizes: default, `.hlx-chip-small`, `.hlx-chip-xsmall` (density −1/−2).
- Status chips should carry an icon as well as colour.

Consumer supplies: the label, an optional leading `mat-icon` and removal/selection handling.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/chip.stories.ts` (`Components/Chip`). The top example is its **Matrix** story; the Playground below has that story file's controls.
