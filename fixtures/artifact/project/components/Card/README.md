# Card

A surface for a single piece of content, `mat-card` styled by the Helix theme.

| `appearance` | |
|---|---|
| `raised` | `elevation-sm` shadow (default resting card) |
| `outlined` | 1px `border-secondary`, no shadow |
| `filled` | `surface-minimal` ground |

- Corners `border-radius-default`; slots for title, subtitle, content, avatar, image, actions and footer.

Consumer supplies: the content and appearance. Cards adapt to their content; keep one idea per card.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/card.stories.ts` (`Components/Card`). The top example is its **With Media** story; the Playground below has that story file's controls. The avatar and media images are inline placeholders in the story, so they render without network access.
