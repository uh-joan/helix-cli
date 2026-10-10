# Icon

Helix icons are Angular Material `mat-icon`s using **Google Material Symbols** (Outline style, fill 0), aligned to the Clarivate brand. See Foundations › Iconography.

- Colour with an `hlx-icon-<color>` class on the icon or its container: **standard** (primary, secondary, disabled, invert), **semantic** (info, positive, warn, negative — each on its matching surface) and **distinct** (brand, accent).
- Sizes: small 16, medium 20, large 24 (the `mat-icon` default), xlarge 32 px.

Consumer supplies: the symbol name (ligature) and an `hlx-icon-*` class. Icons are functional — don't use them as decoration.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/icon.stories.ts` (`Components/Icon`). The top example is its **Colors** story; the Playground below has that story file's controls.
