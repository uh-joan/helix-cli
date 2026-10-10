# Charts

Build charts with the Helix Highcharts **styled-mode** theme so colour, type and axes come from the design system — never a hardcoded palette — and keep them accessible and readable. Status: **beta**.

**When to use** — visualising quantitative data (trends, comparisons, distributions) in a product screen or dashboard.
**Avoid when** — a single number or short comparison a stat tile, table or inline text conveys better.

## Rules

- **Styled-mode theme** — render Highcharts in `styledMode` and apply the Helix theme (`hlx-highcharts-styled-mode-theme` from `@cdx/theme-highcharts`); colour, font and axis styling then come from the design system, not per-chart options.
- **Palette from the theme** — the categorical series palette comes from `HLX_HIGHCHARTS_THEME_COLORS` (purple `#B175E1`, teal `#18A381`, blue `#3595F0`, red `#ED5564`, violet `#5E33BF`, deep teal `#003F51`, …). Never hardcode a colour array; for D3 / custom SVG, import that same array.
- **Semantic vs categorical** — keep semantic colour (good / warning / critical) separate from the categorical palette, and never encode meaning in hue alone — pair it with a label, pattern or shape so it survives colour-blindness and print.
- **Accessible** — every chart gets a title and axis titles, Highcharts accessibility enabled (descriptions), and the data as a table or `aria-label` for non-visual users.
- **Responsive** — a responsive container (width 100%, a set height or aspect-ratio); let Highcharts reflow, don't pin a pixel width.
- **Right chart** — one question per chart and the right type: trend (line), comparison (column/bar), composition (stacked, sparingly). Not a pie for more than a few slices.

Uses: Highcharts. See Foundations › Colour and the Highcharts component card, whose Playground lets you try any type.

Note: the top example is the pattern's own styled-mode chart. The grid below comes from the Components/Highcharts story, which merges `HIGHCHARTS_HLX_THEME` per chart instead of styled mode so it can toggle the theme; apps should follow the styled-mode rule above.

Preview: live — the pattern's styled-mode example (Storybook `Patterns/Charts`, generated from the docs-website pattern), then six charts from the `Components/Highcharts` story, one per question: line, column, stacked column, bar, stacked area and pie.
