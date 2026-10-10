# Breadcrumbs

The trail of the current location. Built on `xng-breadcrumb`, which derives the trail from the Angular router (`data.breadcrumb` on each route). `<cdx-breadcrumb>` from `@cdx/theme-xng-breadcrumb` is the Helix wrapper (chevron separator, optional home icon).

- Separator: chevron (default), `>` or `/`.
- Optional leading home icon; the current page is `text-primary`, weight 600, not a link.

Consumer supplies: the route data; the component builds the trail. Keep labels short.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/breadcrumbs.stories.ts` (`Components/Breadcrumbs`). The top example is its **Shallow** story; the Playground below has that story file's controls.
