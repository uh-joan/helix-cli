# Entity detail

A record page: an entity header, a summary card of the key facts, then an accordion of sections that load lazily and are disabled when they have nothing to show. Status: **beta**.

**When to use** — the detail view of one record (a drug, a trial, a target) reached from a list or search.
**Avoid when** — a collection (use List with filters) or a short record that fits in a card with no sections.

## Anatomy

- **Entity header** — the name, a status chip, key identifiers, and record-level actions (Watch, Export).
- **Summary card** — the few facts that matter most, as a filled card.
- **Sections** — a `mat-accordion`; each section loads lazily when opened, and is **disabled** (not hidden) when it has nothing to show, so the user can see the full shape of the record.

## Rules

- Lazy-load section content on expand; don't fetch everything up front.
- A section with no data is disabled with a count/"None", not removed.
- Each section manages its own Page states (loading / empty / error).

Uses: Card, Expansion panel, Chip, Button, Empty state. Composes with App shell; reached from List with filters.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/Entity detail` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
