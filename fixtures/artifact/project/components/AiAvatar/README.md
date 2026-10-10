# AiAvatar

A circular avatar marking AI-generated or AI-assisted content: the Helix AI gradient with three sparkles.

`<hlx-ai-avatar>` from `@cdx/ngx-branding`.

| Input | Type | Default | |
|---|---|---|---|
| `theme` | `gradient` \| `dark` | `gradient` | Gradient fill, or a flat `surface-invert` disc |
| `animated` | boolean | `false` | Rotates the gradient and pulses the sparkles (four 300ms keyframes); respects `prefers-reduced-motion` |
| `label` | string | `AI` | `aria-label` (the host is `role="img"`) |

- 32px by default; size via `--hlx-ai-avatar-size`. Sparkles are `icon-invert`.
- The gradient is the vertical AI gradient (`gradient-ai-start` → `gradient-ai-end`); see the brand book's AI gradient note.

Consumer supplies: optional size and label. Use next to AI output, not as a user avatar.

Preview: static HTML rendition; the animated variant runs a simplified turn of the Figma animation.
