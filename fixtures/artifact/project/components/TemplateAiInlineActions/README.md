# Inline AI actions

Bring the assistant to the content: AI actions (summarise, explain, ask about this) attached to a document or a selection, with the result shown in place or sent to the assistant — not a detour to a separate chat. Status: **beta**.

**When to use** — the user is reading content (a document, a row, a report section) and an AI action on it would help without leaving the page.
**Avoid when** — a general open-ended question (that's the assistant), or something better as a one-shot field edit.

## Rules

- **Scoped to content** — each action is scoped to specific content (this document, this selection, this section) and says so; the prompt it builds names that scope.
- **Seed or inline** — either seed the assistant composer with a scoped prompt (user edits, then sends) or show the result inline next to the content — never silently fire a hidden request.
- **Discoverable, not noisy** — attach actions where the content is (a per-item action row, or a floating "Ask AI" on text selection), marked with the AI treatment, without cluttering every element.
- **Real controls** — real buttons with labels/aria, keyboard-reachable; marked with the AI treatment (`hlx-btn-ai`, the AI avatar).

Uses: AI button (`hlx-btn-ai`), AI avatar, Icon, Menu. See Foundations › AI, the AI assistant template, and AI generate & rewrite (a one-shot action on one field).
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/Inline AI actions` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
