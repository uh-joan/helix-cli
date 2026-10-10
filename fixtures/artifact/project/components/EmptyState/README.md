# EmptyState

The resting state for a region with no data, or a failed load the user can retry.

`<hlx-empty-state>` from `@cdx/ngx-branding`.

| Input | Type | Default | |
|---|---|---|---|
| `heading` | string | required | Short, specific heading ("No alerts yet") |
| `message` | string | – | A sentence explaining the state and next step |
| `tone` | `empty` \| `error` | `empty` | `empty` for no data, `error` for a failed load |
| `icon` | string | tone default | Material Symbol when no media is projected (`inbox` / `error_outline`) |

Slots: `[hlx-empty-state-media]` (a pictogram, replacing the icon), default (extra copy), `[hlx-empty-state-actions]` (buttons).

- Centred, `spacing-6`/`spacing-3` padding, 48px icon in `icon-secondary` (`icon-negative` for error).
- `error` tone is announced as `role="alert"`; `empty` is a quiet region.
- Heading `headline-small`, message `body-medium` capped at 48ch.

Consumer supplies: the heading, message, and any media/actions. Keep headings specific; give errors a retry.

Preview: static HTML rendition of the source styles.
