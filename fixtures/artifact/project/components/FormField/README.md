# FormField

`mat-form-field` wraps `matInput`, `textarea` and `mat-select` and adds the label, hint, error and prefix/suffix slots, styled by the Helix theme.

- Appearance: `fill` or `outline`; size with `hlx-input-small` / `hlx-input-x-small` (density −1 / −2).
- `hlx-field-borderless` (outline appearance) hides the outline at rest and shows it on hover and focus — for an inline-edit title or a toolbar search where a boxed field is too heavy. It composes with density and the usual states; don't hand-roll field chrome with `::ng-deep`.
- Errors replace the hint and turn the outline and label `text-negative`; keep the message to one line.
- Prefix/suffix slots take a `mat-icon` or short text (units, currency).

Consumer supplies: the control inside, its label, hint and error messages. See Text input, Text area and Select for the controls themselves.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/form-field.stories.ts` (`Components/Form field`). The examples are its **Matrix** and **Borderless** stories; the Playground below has that story file's controls.
