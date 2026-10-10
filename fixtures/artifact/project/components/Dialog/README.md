# Dialog

A modal for a single task, opened with the `MatDialog` service and styled by the Helix theme.

- **Acknowledge** — one action. **Confirm** — two actions (confirm + dismiss).
- Confirm colour: `primary` (ink) or `negative` for destructive actions.
- Options: close button, `disableClose`, actions alignment, width; corners `border-radius-default`, `elevation-lg`.

Consumer supplies: the title, content and actions. Keep dialogs to one decision; put the primary action on the right.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/dialog.stories.ts` (`Components/Dialog`). It shows the **Playground** story with that story file's controls.
