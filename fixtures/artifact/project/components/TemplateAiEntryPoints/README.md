# AI entry points

Where and how the user reaches AI — a header/rail trigger, a floating action button, and a one-time promo banner — all wearing the same Helix AI treatment so AI is recognisable and leads to one assistant surface. Status: **beta**.

**When to use** — deciding how to surface AI in an app shell: the global way in (header, rail or FAB) and how to announce a new AI capability.
**Avoid when** — an AI action scoped to on-screen content (that's Inline AI actions), or the assistant conversation itself (that's the AI assistant).

## Rules

- **Consistent AI treatment** — every entry point wears the same Helix AI treatment (`hlx-btn-ai`, `hlx-ai-avatar`, `hlx-gradient-ai`). Don't hand-roll a different AI look per screen.
- **Discoverable, not intrusive** — one clear primary way in (header button, rail or FAB) plus scoped context entries; don't stack competing AI buttons or block the task with a modal upsell.
- **Labelled trigger** — say what it does with a text label ("Ask AI", "Research assistant"), or an `aria-label` on a FAB; never a bare sparkle.
- **Dismissible promo** — an AI announcement banner introduces a capability once: dismissible, and it stays dismissed (persist the flag). Not permanent chrome.
- **One destination** — all global entry points open the same assistant surface and share its state, not several disconnected chats.
- **Accessible entry** — real, keyboard-reachable buttons with accessible names; the promo's dismiss control is reachable and labelled.

Avoid: a mystery sparkle with no label; each screen inventing its own AI look; a promo that can't be dismissed or returns every visit; a modal AI upsell interrupting the task.

Uses: AI button (`hlx-btn-ai`), AI avatar, Toolbar, Fab, Icon button; tokens `gradient-ai`, `surface-minimal`, `icon-accent`, `spacing-2`. Evidence: reg-ai uses a sidebar rail, cmc a header button, off-x a FAB — none uses the Helix AI primitives, so the single consistent treatment is net-new Helix guidance. See Foundations › AI.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI entry points` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
