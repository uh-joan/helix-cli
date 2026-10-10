# Header

The global product header: Clarivate mark, product name or logo, and global actions.

`<header hlx-header>` from `@cdx/ngx-branding`, with `<hlx-header-product-name>` (or `a[hlx-header-product-name]`, `a|img[hlx-header-product-logo]`) and `<hlx-header-global>` for the right-hand actions.

| Input | Type | Default | |
|---|---|---|---|
| `branded` | boolean | `true` | Shows the Clarivate mark (links to clarivate.com) |
| `theme` | `ThemeOptionsBranding` | – | Overrides `header.background` and mark colour |
| `openExternalLink` | boolean | `false` | Opens clarivate.com in a new tab |

- 56px tall, `spacing-4` horizontal padding, `surface-invert` ground, white text, Source Sans 3. Controls inside use the dark Material theme.
- Mark at 110×20 in white (`clarivate-logo-white.svg`), a 1×24px divider, then the product name at 18/24 bold. Without the mark the product name grows to 24/32.
- Global actions sit at the right with 10px gaps; a divider appears automatically before `hlx-header-global`.
- Three types: **Default** (logo, product name, navigation, global actions), **Condensed** (no app navigation; `condensed`, default on) and **No Clarivate logo** (`branded` off). See Foundations › Branding.

Consumer supplies: the product name or logo, any nav (e.g. `.hlx-tab-invert` tabs) and global actions.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/header.stories.ts` (`Branding/Header`): **Default**, **Condensed**, **No Clarivate logo**, **Product name only** and **Logo only**, then the Playground with that story file's controls.
