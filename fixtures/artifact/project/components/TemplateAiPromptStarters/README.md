# AI prompt starters

The pre-conversation landing for an assistant: a short greeting, a few suggested-prompt cards that seed the composer, and the composer itself — so the user isn't facing a blank box. Status: **beta**.

**When to use** — the empty state of an AI assistant, before the first message.
**Avoid when** — a conversation already in progress (that's the AI assistant thread), or a one-off generate button.

## Rules

- **Seed, don't send** — a starter card fills the composer with an editable prompt and focuses it; it does not send immediately. The user stays in control (the Assistive principle).
- **Few and specific** — three to six starters, each a specific product task ("Compare the last two labels for…"), not generic filler ("Ask me anything"). Keep them short.
- **Real cards** — starters are real buttons (keyboard-reachable, aria-labelled), in a responsive grid that collapses to one column on small screens.
- **Greeting then composer** — a brief greeting above, the composer below; the starters sit between.

Uses: AI avatar, Button (starter cards), Text area / composer, `hlx-gradient-ai`. See Foundations › AI and the AI assistant template.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI prompt starters` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
