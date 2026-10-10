# App shell

The standard page chrome every screen sits in: the Helix **Header** (Clarivate mark, product name, primary navigation, global actions), a routed content area, and the **Footer**. Built once in a layout component; the router fills the content.

**When to use** — the top-level layout of a product; every routed page renders inside it. A single embedded widget a host already wraps doesn't need its own shell.

**Anatomy** — `header[hlx-header]` with `hlx-header-product-name`, the primary nav, and actions in `hlx-header-global`; a `<router-outlet/>` for content; `footer[hlx-footer]`.

Uses: Header, Footer, Tabs/nav, Table.

Preview: live — the pattern's docs-site example, rendered through the Storybook `Patterns/App shell` story (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
