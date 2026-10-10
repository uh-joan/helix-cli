# ButtonToggle

A segmented control for choosing one of a few options; it always has a value selected.

`mat-button-toggle-group` inside `.hlx-button-toggle-container`:

- Container: 4px padding, 1px `color-neutral-400` border (hard-coded `#babcbe` in source), `border-radius-default`, `surface-minimal` ground.
- Toggles are 30px tall, no dividers.
- `.hlx-button-toggle-invert`: the selected option is white (`text-invert`) with `components-primary-filled` text — a raised segment on the grey track.

Consumer supplies: the options and the bound value. Use for 2–4 short options; more belongs in a select.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/button-toggle.stories.ts` (`Components/Button toggle`). The top example is its **Themes** story; the Playground below has that story file's controls.
