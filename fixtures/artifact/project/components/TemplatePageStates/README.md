# Page states

Every region that loads data has four states — **loading, loaded, empty, error**. Design all four so a screen never shows a blank box or a frozen spinner.

- **Loading** — a Skeleton loader shaped like the content that's coming, so the page doesn't reflow when data arrives.
- **Loaded** — the real content.
- **Empty** — the request succeeded but there's nothing; use the Empty state (`tone="empty"`) with a next step.
- **Error** — the load failed; Empty state (`tone="error"`) with a retry.

**When to use** — any view, panel, drawer or card whose content is async (HTTP, `resource()`, a signal store).

Uses: Skeleton loader, Empty state, the loaded component.

Preview: live — the pattern's docs-site examples, rendered through the Storybook `Patterns/Page states/All four states with @switch`, `Patterns/Page states/Loading skeleton`, `Patterns/Page states/Empty state`, `Patterns/Page states/Error state` stories (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
