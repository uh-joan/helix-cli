# AI generate & rewrite

A one-shot AI action on a single field — draft, rewrite, shorten, fix — that proposes new text the user reviews and accepts, discards or regenerates, with an undo. **Not a conversation.** Status: **beta**.

**When to use** — helping the user write or revise one field or block of text (an alert description, a summary, a note) in place.
**Avoid when** — an open-ended question or multi-turn task (that's the AI assistant), or content the user hasn't asked AI to touch.

## Rules

- **Propose, don't replace** — AI proposes; the user disposes. Never overwrite the field silently — show the generated text as a reviewable proposal with Accept / Discard, and make Accept undoable (the Assistive principle).
- **Scoped actions** — offer specific actions (Draft, Rewrite, Shorten, Fix grammar), not a vague "AI"; each acts on this field's current content (or produces it when empty) and says what it will do.
- **Show states** — show the generating state (disable the trigger, show progress) and handle failure with a retry; the one-shot has loading/error states like any async action.
- **Regenerate** — let the user regenerate a proposal they don't like before accepting, and keep the original until they accept.
- **AI identity & disclosure** — mark the control and the proposal with the Helix AI treatment (sparkle / `hlx-btn-ai`) and note the text is AI-generated and should be checked.
- **Preserve input** — don't discard what the user typed without consent; "Rewrite" works on their text, and Discard restores it exactly.

Avoid: silent overwrite with no review or undo; a vague "AI" action; discarding the user's input without consent.

Uses: AI button (`hlx-btn-ai`), Menu, Text input/area, AI avatar. See Foundations › AI; contrast with Inline AI actions (brings the assistant to content) and the AI assistant (a conversation).

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI generate & rewrite` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
