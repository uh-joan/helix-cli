# AiButton

A button for AI actions, filled with the Helix AI gradient.

`.hlx-btn-ai` applied to a `mat-button`, from `theme-helix-buttons`.

- **Filled**: the AI gradient (`gradient-ai-start` → `gradient-ai-end`, 150deg) as the container; `text-invert` label; black hover 16% / focus 16% / pressed 24% state layers. Angular Material can't take a gradient fill, so the solid `gradient-ai-start` is the container colour and `.hlx-gradient-ai` paints the gradient over it.
- **Outlined / text**: `text-primary` label, 4% black hover — the gradient is reserved for the filled, primary AI action.
- `.hlx-gradient-ai` is the standalone class that paints the gradient (with a solid fallback for forced-colors mode) on any element.

Consumer supplies: the label (and optional AI avatar/icon). One gradient AI action per context.

Preview: live — the real Angular Material buttons with the shipped Helix theme, rendered from the AI stories in `button.stories.ts` and `fab.stories.ts` (packages/storybook). `.hlx-gradient-ai` on other surfaces is shown in Foundations › AI.
