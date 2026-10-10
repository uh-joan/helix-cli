# Error pages

Full-page states for 404, 403 and 500 — a centred `hlx-empty-state` with a pictogram, a plain explanation and one clear way forward, served by the router. Status: **beta**.

**When to use** — a whole route can't be shown: not found (404), not permitted (403), or a server error (500).
**Avoid when** — one region of an otherwise-working page failed; use the Page states error inside that region.

## Rules

- **Reuse empty state** — build each from `hlx-empty-state` (`tone="error"`), centred in the content area — the same component as in-region empty/error states, at page scale.
- **One way forward** — exactly one primary action per error: 404 → home or search; 403 → request access or go back; 500 → retry, then contact support.
- **Plain explanation** — say what happened and what to do in plain words; no codes-only pages, stack traces or blame.
- **Routed** — serve from the router (wildcard for 404, guard redirect for 403, error handler for 500) inside the app shell so the header/nav stay.

Uses: Empty state, Button. Composes with App shell; distinct from the in-region Page states error.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/Error pages` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
