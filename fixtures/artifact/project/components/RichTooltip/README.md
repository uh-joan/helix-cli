# RichTooltip

A floating panel with structured content, shown on hover or click.

`[hlxTooltip]="templateRef"` directive from `@cdx/ngx-branding`, rendering `<hlx-rich-tooltip>` in a CDK overlay.

| Input | Type | Default | |
|---|---|---|---|
| `hlxTooltip` | `TemplateRef` | required | The content template |
| `tooltipTrigger` | `hover` \| `click` | `hover` | Click toggles and closes on outside click |

- Panel: `surface-primary`, `text-primary`, `border-radius-default`, Material elevation 3; no padding of its own.
- Positions below, above, left, right of the trigger, 8px away, pushed on-screen.
- For a one-line label use plain `matTooltip` — Helix sets its container to `color-neutral-600`.

Consumer supplies: the template, including its own padding and typography.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/rich-tooltip.stories.ts` (`Branding/Rich tooltip`). It shows the **Playground** story with that story file's controls.
