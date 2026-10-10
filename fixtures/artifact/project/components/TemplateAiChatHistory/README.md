# AI chat history

A panel of past AI conversations, grouped by recency and titled by their first question, that the user can reopen, rename and delete — with real loading, empty and error states, not just the happy path. Status: **beta**.

**When to use** — an AI assistant keeps a history of conversations the user returns to, resumes, renames or cleans up.
**Avoid when** — a one-shot or stateless AI interaction with nothing worth keeping, or a single active conversation with no past sessions.

## Rules

- **Group by recency** — Today / Last 7 days / Older, newest first, so recent work is found without scanning the whole list.
- **Title from the first message** — label each conversation by its first question, truncated with the full text on a tooltip; a pending conversation shows a skeleton until its title arrives.
- **Manage in place** — rename and delete from a per-item menu revealed on hover and focus (real, keyboard-reachable controls); confirm a delete.
- **All list states** — loading (skeletons), empty, and error-with-retry, plus load-more and end-of-list for a long history.
- **Mark the active** — highlight the open conversation and scroll it into view; a new chat is one click from the header.
- **Resume on open** — each entry deep-links to its conversation and restores it where the user left off; remember whether the panel is open.

Avoid: a flat, undated list; entries labelled only by id or timestamp; read-only history with no rename or delete; rendering only the loaded path; deleting without confirmation.

Uses: Button, Icon button, Menu, Skeleton loader, a negative text button (`hlx-btn-negative` in Angular) for the confirm; tokens `surface-minimal`, `border-secondary`, `text-secondary`, `spacing-2`. Reference: reg-ai's chat-history panel. See Foundations › AI and the Page states template; pairs with the AI assistant.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI chat history` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
