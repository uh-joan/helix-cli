# TextInput

Text inputs let users enter and edit content in forms and dialogs.

`mat-form-field` + `matInput`, themed by the Helix overrides. The same `mat-form-field` wraps `textarea` (Text area) and `mat-select` (Select) and adds the label, hint, error and prefix/suffix slots.

- Outline: `components-text-input-outlined-enabled` → hover `components-text-input-outlined-hover` → focused `components-text-input-outlined-focused` → error `components-text-input-outlined-error`. Disabled fills `components-text-input-outlined-disabled`.
- Filled appearance: `components-text-input-filled-fill`, hover `components-text-input-filled-hover-fill`, borders from the `components-text-input-filled-*` tokens.
- Corners `border-radius-default` (2px) for both outline and filled.
- Sizes: default (56px), `.hlx-input-small` (density −3), `.hlx-input-x-small` (density −4).
- `.hlx-field-borderless` on an outline field shows the outline only on hover and focus (inline edit, toolbar search); see Form field.
- Error text in `text-negative`; hint text in `text-secondary`.

Consumer supplies: `mat-label`, the control, optional `mat-hint` / `mat-error`, and validation.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/input.stories.ts` (`Components/Input`). The top example is its **Matrix** story; the Playground below has that story file's controls.
