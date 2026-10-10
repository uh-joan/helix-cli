# Highcharts

Charts via `highcharts-angular` with the Helix theme `HIGHCHARTS_HLX_THEME` from `@cdx/theme-highcharts`.

- Render in **styled mode** and apply `hlx-highcharts-styled-mode-theme` so colour, type and axes come from the design system, not per-chart options.
- The categorical series palette is `HLX_HIGHCHARTS_THEME_COLORS` (purple/teal/blue/red/violet/deep-teal…); never hardcode a colour array.
- The theme pins `palette.colorScheme: 'light'`. Highcharts 13 otherwise follows the OS and turns charts dark in dark mode, where the theme's black legend becomes unreadable; Helix is light-only.
- See the Charts template for the full pattern (accessibility, responsive container, right chart type).

Consumer supplies: the chart `options` and data. Use for analytical charts.

Preview: live — `<highcharts-chart>` with `HIGHCHARTS_HLX_THEME`, rendered from `packages/storybook/src/stories/highcharts.stories.ts` (`Components/Highcharts`). Its Playground switches type (line, spline, area, column, bar, pie), stacking, series count, data labels, legend, height and the Helix theme on/off. The Charts template shows one of each type.
