# Dialog pattern

A modal for one decision or one short task. Open it through a named size preset, structure the body with the Material dialog slots, and put the primary action on the right.

**When to use** — confirming a decision (especially destructive), or a short focused task. Anything longer belongs on a page; a passive message belongs in a snackbar or `hlx-notification`.

- Destructive confirmations use a `negative` primary action; keep Cancel on the left.
- Dim and trap focus behind the dialog; `disableClose` only when a choice is required.

Uses: Dialog, Button.

Preview: live — the pattern's docs-site examples, rendered through the Storybook `Patterns/Dialogs/Confirm a destructive action`, `Patterns/Dialogs/Right-docked side panel` stories (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
