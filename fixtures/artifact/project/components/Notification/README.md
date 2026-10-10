# Notification

Notifications tell the user about the application state where they may need to act.

`<hlx-notification>` from `@cdx/ngx-branding`.

| Input | Type | Default | |
|---|---|---|---|
| `title` | string | – | Optional title (`headline-small`) |
| `presentation` | `inline` \| `banner` | `inline` | Layout |
| `severity` | `primary` \| `warn` \| `negative` \| `positive` | `primary` | Colour theme. `info` and `success` are deprecated aliases of `primary` and `positive` |
| `action` | string | – | Primary action button label |
| `secondaryAction` | string | – | Secondary action button label |
| `dismissable` | boolean | `false` | Adds Dismiss (banner) or a close icon (inline) |

Outputs: `actionEvent`, `secondaryActionEvent`, `dismissEvent`. Content projection: `[icon]` and `[actions]`.

- Severity theme map (surface / text / left border): **primary** = `surface-minimal` / `text-primary` / `border-primary`; **warn** = `surface-warn` / `text-warn` / `yellow-500`; **negative** = `surface-negative` / `red-900` / `red-500`; **positive** = `surface-positive` / `text-positive` / `green-600`.
- Default icons: `info_outline` (primary), `warning` (warn), `error` (negative), `check_circle` (positive).
- `negative` is announced as `role="alert"`; the rest are `role="status"`.
- Corners `border-radius-default` (2px); inline has an 8px left rule.

Consumer supplies: the message, severity, and handlers. Keep to one or two actions.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/notification.stories.ts` (`Branding/Notification`). The top example is its **All Severities** story; the Playground below has that story file's controls.

> Renamed since the earlier sync: severities are now primary/warn/negative/positive (was info/success/warn); `info` and `success` still work as aliases.
