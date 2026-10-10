# AI usage & limits

Tell the user where they stand against AI limits — responses left, a context that's too long, a rate limit — before and when they hit them, with a clear way forward, using `hlx-notification`. Status: **beta**.

**When to use** — an assistant with quotas, a bounded context window, or rate limits: anywhere a request can be refused for a limit rather than an error.
**Avoid when** — no limits apply, or a genuine failure (that's the error state).

## Rules

- **Show before hitting** — show remaining quota before it runs out ("8 of 10 responses left today"), quietly, near the composer — not only once it's gone.
- **Limit, not error** — a limit isn't a failure. Use `hlx-notification` (warn when approaching, negative only when blocked), plain language and a way forward — not a red error toast.
- **Way forward** — every limit state offers the next step: context too long → "Start a new chat"; quota reached → when it resets; rate limited → when to retry.
- **Disable at block** — when a limit blocks input, disable the composer and the control that can't work, so the user isn't typing into a dead end.
- **Announce** — limit banners are announced (hlx-notification sets the role — status for warn, alert for negative); don't bury the state in muted text.

Uses: Notification (warn / negative), Button, the composer. See Foundations › AI.
Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/AI usage & limits` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
