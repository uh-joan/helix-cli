# Menu

A panel of actions opened from a trigger, `mat-menu` styled by the Helix theme.

- Trigger: a labelled button or an icon button (e.g. an overflow menu).
- Items may have leading icons, dividers, disabled items and submenus.
- Position: `xPosition` before/after, `yPosition` above/below, optional overlap and backdrop. Panel uses `surface-primary`, `elevation-md`.
- `hlx-menu-scrollable` on the panel caps it at 320px and scrolls, for long menus.

Consumer supplies: the trigger and `mat-menu-item`s.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/menu.stories.ts` (`Components/Menu`). It shows the **Playground** story with that story file's controls.
