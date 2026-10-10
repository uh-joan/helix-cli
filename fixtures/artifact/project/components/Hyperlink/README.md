# Hyperlink

The Helix theme styles every `<a>`: links inherit the surrounding text colour and underline on hover.

- `hlx-link-blue` — blue (`text-link`), going to `text-link-visited` once visited.
- `hlx-link-visited` — forces the visited colour.
- `hlx-link-inline` — for links inside running text: semibold and always underlined.
- The `underline` attribute adds only the permanent underline.

Consumer supplies: the link text and `href`. Link text says where it goes; never "click here".

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/hyperlink.stories.ts` (`Components/Hyperlink`). It shows the **Playground** story with that story file's controls.
