# SlideToggle

An on/off switch for a single setting that takes effect immediately.

`mat-slide-toggle`, themed by the Helix overrides.

- Track is `surface-contrast` when off, `components-primary-filled` (ink) when on; the thumb is `surface-primary`.
- The off state shows a close (×) icon in the thumb; the on state shows a check — Helix masks these in via `.mdc-switch__icons`.
- `.hlx-slide-toggle-small`: Material density −2, 28px track height.

Consumer supplies: the label, bound value and change handler. Use for immediate settings; for a choice that needs confirmation, use a checkbox.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/slide-toggle.stories.ts` (`Components/Slide toggle`). The top example is its **States** story; the Playground below has that story file's controls.
