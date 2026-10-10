# AI assistant

A conversational assistant: a thread of user and assistant turns, a streaming answer announced to assistive technology, per-answer feedback, and a docked composer — built on the Helix **AI avatar** and **gradient**. Status: **beta**.

**When to use** — a product's AI chat or assistant surface, full-page or in a side panel.
**Avoid when** — a one-shot generate action (a button that fills a field); that's a button with a loading state, not a conversation.

## Anatomy

- **Thread** — a `role="log"` list, centred (~760px); each turn is a list item.
- **User turn** — a right-aligned bubble on `surface-minimal`.
- **Assistant turn** — led by `hlx-ai-avatar`; the answer renders into an `aria-live="polite"` region; feedback actions sit below.
- **Streaming indicator** — the avatar `animated`, with the status ("Thinking…", "Searching…", "Generating answer…") as **real text** in the live region.
- **Composer** — one autosizing textarea (Enter submits, Shift+Enter newlines), disabled while generating, with a labelled `hlx-btn-ai` send button.

## Rules

- **Announce streaming** — the streamed answer lives in `aria-live="polite"`; the status is real text, never CSS `content:`.
- **Stop generating** — while a response streams, the send button becomes a Stop button so the user can cut a long or wrong answer short.
- **AI avatar for assistant turns** — set `animated` only while generating (it respects `prefers-reduced-motion`).
- **Real buttons** — feedback (thumbs up/down, copy) and citations are real `<button>`s with `aria-label` / `aria-pressed`, never clickable `<div>`s.
- **Distinct turns** — user bubble vs. avatar-led assistant turn; each turn a list item in a labelled `role="log"`.
- **Citations** — inline citations open an accessible popover (the Rich tooltip), reachable by keyboard, not a hover-only div.
- **History** — the history sidebar reuses the App shell drawer and Page states (loading / empty / error); rename and delete use the Dialog size presets.
- **Disclose AI** — a short "AI-generated" disclosure near the thread; answer copy in sentence case, address the user as "you".
- **Prose** — render sanitised model markdown into an element with the `hlx-prose` class (from `theme-helix-overrides`), which styles headings, lists, code, tables, links and quotes with Helix tokens — not per-app `::ng-deep` on `innerHTML`.

Avoid: streaming tokens with no `aria-live`; the status in CSS `content:`; feedback or citations as clickable divs; loading a charting or markdown library from a CDN at runtime; copying the whole chat UI per surface instead of sharing parts.

Related AI templates: Prompt starters (the empty state), Inline AI actions, AI generate & rewrite (one field), Generation trace, Usage & limits.

Uses: AI avatar, AI button (`hlx-btn-ai`), `hlx-gradient-ai`, Text area, Icon button, Rich tooltip, Empty state. See Foundations › AI.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI assistant` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
