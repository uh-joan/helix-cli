# Export

An export action: pick a format, then give asynchronous feedback through snackbars — preparing, then ready (or failed with retry) — so the user isn't left staring at a frozen button. Status: **beta**.

**When to use** — letting the user download the current data (a grid, a report) as CSV, Excel or PDF, especially when the file is generated server-side and takes a moment.
**Avoid when** — an instant client-side download of something already in memory; just trigger it.

## Rules

- **Format menu** — offer formats from one Export menu (CSV, Excel, PDF), not a row of buttons; disable it while an export is already running.
- **Async feedback** — for a server-generated file: a "Preparing your export…" snackbar on start, a success snackbar when ready, and an error snackbar with Retry if it fails. Never leave the trigger with no feedback.
- **Don't block** — no full-screen spinner overlay; it runs in the background and the snackbars carry the state.
- **Deliver the file** — start the download immediately when ready, or put a Download action on the success snackbar; don't make the user hunt for it.
- **Scope is explicit** — say what's being exported (the filtered set, the whole dataset, the current page).

Uses: Button, Menu, Snackbar. Composes with List with filters and Data grid.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/Export` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
