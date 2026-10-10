# IconButton

An icon-only button, `matIconButton` styled by the Helix theme — commonly an overflow or toolbar action.

- Colour comes from `hlx-btn-*` classes on a parent: default (ink), `hlx-btn-accent`, `hlx-btn-negative`, `hlx-btn-invert`.
- Size comes from **density** (0 to −3): it changes the hover target and state layer, not the icon size.
- Round 40px target; the icon stays 24px.

Consumer supplies: the icon, an `aria-label` (there's no visible label) and usually a `matTooltip`.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/icon-button.stories.ts` (`Components/Icon button`). The top example is its **Colors** story; the Playground below has that story file's controls.
