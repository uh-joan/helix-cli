# Tabs

Tabs separate related content into views, one view per tab.

`mat-tab-group` / `mat-tab-nav-bar` with Helix overrides:

- Labels use `label-large`.
- Active indicator is 4px; with `fitInkBarToContent` it gets 2px top corners.
- `.hlx-tab-compact` — a shorter 36px tab bar (default 48px) with a 2px indicator, for dense in-panel tabs, side panels and toolbars. Custom-property driven, so it composes with `hlx-tab-invert`.
- `.hlx-tab-invert` puts the bar on `surface-invert` with `text-invert` labels and a white indicator — use it directly under the global header.

Consumer supplies: tab labels and content (or router links for nav bars).

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/tabs.stories.ts` (`Components/Tabs`). The examples are its **With Icons** and **Compact** stories; the Playground below has that story file's controls.

The Storybook **Invert** story renders `hlx-tab-invert` on a white canvas, so its labels are invisible there; it needs a `surface-invert` wrapper (as the Button and Icon button stories use `.story-invert`).
