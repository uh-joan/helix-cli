# Slider

A `mat-slider` styled by the Helix theme.

- **Basic** — one thumb (`matSliderThumb`). **Range** — two (`matSliderStartThumb` / `matSliderEndThumb`).
- Options: `min`/`max`/`step`, `discrete` (value indicator while dragging), tick marks, disabled.
- The active track and thumb use `components-primary-filled`.

Consumer supplies: the bounds and bound value(s), plus an `aria-label`.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/slider.stories.ts` (`Components/Slider`). The top example is its **Range** story; the Playground below has that story file's controls.
