# AI generation trace

A collapsed "How was this generated?" disclosure under an AI answer, showing the steps the assistant took and the inputs it used — so users can understand and trust the result. Status: **beta**.

**When to use** — an AI answer whose provenance matters (which sources, filters or steps produced it), especially in regulated or high-stakes contexts.
**Avoid when** — a trivial response where a trace adds noise, or when the steps can't be described truthfully.

## Rules

- **Collapsed by default** — the trace sits below the answer, labelled "How was this generated?", available but never in the way.
- **Truthful steps** — show what actually happened (real steps, tools, filters, source counts), not a decorative fake. If you can't describe it truthfully, don't show a trace (the Transparent and Trustworthy principles).
- **Two flavours** — a live step list that fills in as the answer streams (done markers on completed steps), and/or a static reasoning summary (the query, its classification, the filters applied).
- **Accessible disclosure** — a real disclosure (`mat-expansion-panel` or `<details>`), keyboard-operable with the expanded state exposed to assistive tech — not a hover or a clickable div.

Uses: Expansion panel, Icon, AI avatar. See Foundations › AI.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI generation trace` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
