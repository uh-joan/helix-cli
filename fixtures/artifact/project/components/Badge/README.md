# Badge

A small count or dot overlaid on another element to flag new or outstanding items.

`matBadge` on a host element, themed by `mat.badge-color` in `overrides.scss`.

- Default is the **tertiary** (accent purple, `icon-accent`) variant with `text-invert`.
- `.hlx-badge-primary` uses the primary (ink) colour; `.hlx-badge-accent` is the purple default again.
- Use a dot (no number) for a simple "new" marker, a count for a known number.

Consumer supplies: the host element and the badge content (`matBadge="4"`), position and size via the Material `matBadgePosition` / `matBadgeSize` inputs.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/badge.stories.ts` (`Components/Badge`). The top example is its **Matrix** story; the Playground below has that story file's controls.
