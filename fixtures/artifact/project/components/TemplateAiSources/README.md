# AI sources & citations

Make an AI answer traceable — number claims with inline citations that reveal the cited passage and link to the source, and list the ranked source documents behind the answer, collapsed past a handful. Status: **beta**.

**When to use** — an AI answer is grounded in documents and the user must be able to check any statement against its source.
**Avoid when** — an ungrounded, generative draft the user is expected to edit (that's AI generate & rewrite), or a UI with no underlying sources to cite.

## Rules

- **Cite inline** — number claims with inline citations that reveal the exact cited passage and a link to its source, so any sentence can be checked against the document it came from (the Trustworthy principle).
- **Reveal on hover and focus** — the citation detail opens on hover AND keyboard focus; the trigger is a real focusable control (`aria-haspopup`), never hover-only.
- **Rank and collapse** — list source documents in relevance order, numbered; show a handful and collapse the rest behind "Show N more sources" / "Show less" (reg-ai: preview 5, show-all threshold 6).
- **Link to source** — every citation and document links to the real source, with the locator (page, field) where available. No dead references.
- **Source metadata** — give each document title, publisher / source, territory and last-updated.
- **Translate and disclose** — an off-language source offers an AI translation clearly marked as AI, with a "See original" toggle (and RTL support), plus loading and error-with-retry states.

Avoid: uncited claims; a hover-only citation with no keyboard path; a citation or document that links nowhere; a wall of unranked sources; translated source text not marked as AI.

Uses: Button, Icon, `hlx-link-inline`; tokens `surface-minimal`, `border-secondary`, `text-secondary`, `icon-accent`, `elevation-md`, `spacing-2`. See Foundations › AI; pairs with the AI assistant and AI generation trace.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI sources & citations` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
