# Design-token and design-to-code bridge tooling (CLIs, MCP servers, agent-friendliness)

Research date: 2026-10-07. Context: informing a "Helix CLI" for Clarivate's Angular / Material 3 design system (@cdx/* packages).

## Token pipeline CLIs: commands, formats, CI usage; Terrazzo lint/check

### Takeaway
DTCG 2025.10 (released 28 Oct 2025) is now the stable interchange format. Style Dictionary (v4/v5) and Terrazzo are the two main DTCG build CLIs. Style Dictionary's CLI is minimal (`build`/`clean`/`init`). Terrazzo's CLI (`tz init/build/lint/check/bundle`) adds built-in token linting, including WCAG contrast checks, which makes it the better reference for a "health check" style command. Tokens Studio has no official CLI. It plugs into Style Dictionary through `@tokens-studio/sd-transforms`.

### Cited Findings
**DTCG spec**
- The DTCG announced the first stable Design Tokens Specification (2025.10) on 28 Oct 2025. It adds theming/multi-brand support, modern color (Display P3, OKLCH, CSS Color 4 spaces), aliases/inheritance/component-level references, and cross-platform generation. The core format is described as stable for production, with active refinement continuing — [W3C DTCG announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/); [designtokens.org TR 2025.10](https://www.designtokens.org/tr/2025.10/)

**Style Dictionary**
- CLI commands are `style-dictionary build` (all platforms, or `--platform web`), `style-dictionary clean` (removes generated files and undoes actions) and `style-dictionary init` — [Style Dictionary API/CLI reference](https://styledictionary.com/reference/api/)
- The docs cover v4 and v5 and include DTCG utilities and DTCG info sections. TS config is supported natively with Bun, Deno or Node >= 22.6 with `--experimental-strip-types` — [Style Dictionary reference](https://styledictionary.com/reference/api/)
- v5 is described as "a drop-in replacement for the majority of users". The changes:
  - References may only point at actual tokens (nodes with `$value`), not at groups or attributes.
  - Custom reference syntax was removed. `{a.b}` with fixed braces and dot is now mandatory, aligned with DTCG.
  - The minimum Node version is 22.0.0.
  - The main goal was internal performance for large, reference-heavy token sets.
  - Source: [SD v5 migration](https://styledictionary.com/versions/v5/migration/)

**Tokens Studio / sd-transforms**
- `@tokens-studio/sd-transforms` provides Style Dictionary transforms for Tokens Studio exports:
  - `register(StyleDictionary)` and a `'tokens-studio'` preprocessor, which aligns Tokens Studio types to DTCG and extracts embedded font styles.
  - A transform group `tokens-studio`: math resolution, px sizing, opacity, line-height, font-weight, color modifiers, CSS letter-spacing, hex-to-rgba, shadows, and Compose typography.
  - Requires SD v4+ for sd-transforms v1+. sd-transforms <=0.12.2 supports SD v3.
  - `permutateThemes()` reads `$themes.json` to produce per-theme outputs (for example mode x brand).
  - Source: [sd-transforms GitHub](https://github.com/tokens-studio/sd-transforms)
- The sd-transforms README does not mention an official Tokens Studio CLI — [sd-transforms GitHub](https://github.com/tokens-studio/sd-transforms)

**Terrazzo (formerly Cobalt UI)**
- CLI (`tz`) commands:
  - `init`: scaffold from an existing design system
  - `build`: compile tokens via plugins, and lint during the build
  - `lint`: lint without building
  - `check [file]`: validate tokens JSON against DTCG
  - `bundle [file] --output [file]`: bundle a multi-file resolver into one JSON
  - Flags `--silent` and `--quiet`. `DEBUG=parser:*` / `plugin:*` enables scoped debugging.
  - Source: [Terrazzo docs](https://terrazzo.app/docs/); [Terrazzo CLI commands](https://terrazzo.app/docs/cli/commands)
- Output plugins: CSS, Sass, Tailwind, Vanilla Extract, Swift, a Storybook plugin, and custom plugins. There are also guides for DTCG, Figma import and a migrating-v2 guide — [Terrazzo docs](https://terrazzo.app/docs/)
- Lint rules are configured in `terrazzo.config.ts` with severities `error` (stops parsing), `warn` and `off`. Built-in rules:
  - Format validators for every DTCG type: color, dimension, fontFamily, fontWeight, duration, cubicBezier, number, link, boolean, string, strokeStyle, border, transition, shadow, gradient, typography.
  - Constraint rules: colorspace enforcement, consistent naming, duplicate values, required descriptions.
  - Structural rules: required children, required modes, required `$type`, typography property enforcement.
  - Accessibility rules: `a11y/min-contrast` and `a11y/min-font-size`.
  - Custom rules can be written through an ESLint-inspired plugin API.
  - Source: [Terrazzo linting](https://terrazzo.app/docs/linting/)
- `a11y/min-contrast` takes foreground/background token pairs and a `level` (AA, the default, or AAA). It uses WCAG2 thresholds: AA is 4.5 (3 for large text) and AAA is 7 (4.5 for large text) — [unpkg @terrazzo/parser source](https://app.unpkg.com/@terrazzo/parser@0.8.1/files/src/lint/plugin-core/rules/a11y-min-contrast.ts); [Terrazzo linting](https://terrazzo.app/docs/linting/)
- Package versions observed: `@terrazzo/cli` 2.4.0 and `@terrazzo/parser` 2.4.0 changelogs on unpkg — [unpkg @terrazzo/cli CHANGELOG](https://app.unpkg.com/@terrazzo/cli@2.4.0/files/CHANGELOG.md)
- An Algolia DocSearch MCP index exists for the Terrazzo docs repo, which suggests the docs are agent-queryable through third-party tooling rather than a first-party Terrazzo MCP — [Algolia DocSearch MCP Terrazzo](https://docsearch.algolia.com/mcp/docs/repo/terrazzoapp/terrazzo)

**Specify**
- The Specify CLI syncs design tokens and assets collected from Figma into a local directory with `specify pull`. `specify pull --dry-run` previews the output without writing files. The Specify SDK (`@specifyapp/sdk`) exposes APIs over the Specify Design Token Format and repositories — [dev.to: Meet the Specify CLI](https://www.dev.to/specifyapp/meet-the-specify-cli-1emb); [@specifyapp/sdk README](https://cdn.jsdelivr.net/npm/@specifyapp/sdk@1.2.1/README.md)

### Inferences
- For CI, `tz check` + `tz lint` (non-zero exit on `error`) already works as a token gate. Style Dictionary needs custom code or wrapper scripts for validation. A Helix CLI could wrap whichever builder @cdx uses and add a `helix tokens lint` that copies Terrazzo's rule taxonomy (type validity, naming, required modes such as light/dark, and a11y contrast pairs for M3 on-color/container roles).
- Material 3 role pairs (`on-primary`/`primary`, `on-surface`/`surface`) map naturally onto Terrazzo's `a11y/min-contrast` pair config.
- SD v5 requires Node 22+ and strict DTCG references. Check this before a Helix CLI pins a version.

### Gaps
- I could not confirm the exact Style Dictionary v5 release date, or whether SD has formally adopted every 2025.10 feature (for example the resolver/theming module).
- No first-party MCP server was found for Style Dictionary, Terrazzo or Tokens Studio.
- I did not verify the Terrazzo Figma-import mechanics (plugin versus REST Variables API).
- Specify's current status and roadmap for 2025–2026, and any MCP from Specify: no reliable sources found.

## Figma Code Connect: CLI commands, framework support (Angular status), link to MCP / Dev Mode

### Takeaway
Code Connect maps Figma components to real code snippets shown in Dev Mode, and those mappings are also served to agents through the Figma MCP server. Angular is supported only indirectly, as HTML. Figma has now declared the framework-specific parsers (React, HTML, SwiftUI, Compose) legacy. Framework-agnostic TypeScript "template files" (`.figma.ts`) are the only actively maintained path, which is good news for Angular.

### Cited Findings
- Code Connect has two modes:
  - Code Connect UI: in-Figma mapping with GitHub integration, and one-to-many mappings across frameworks.
  - Code Connect CLI: template files, or the legacy framework APIs. "CLI-created connections will appear in the UI, but can only be edited in the CLI."
  - Source: [Figma Code Connect docs](https://developers.figma.com/docs/code-connect/)
- Supported targets: framework-agnostic template files, plus the legacy APIs for React/React Native, HTML (Web Components, Angular, Vue), SwiftUI and Jetpack Compose — [Code Connect docs](https://developers.figma.com/docs/code-connect/); [figma/code-connect GitHub](https://github.com/figma/code-connect)
- CLI commands: `figma connect create`, `parse`, `publish`, `unpublish` and `migrate`. It supports `--dry-run` and authenticates with `FIGMA_ACCESS_TOKEN` or `--token` — [figma/code-connect GitHub](https://github.com/figma/code-connect); [Code Connect docs](https://developers.figma.com/docs/code-connect/)
- HTML parser: "Code Connect HTML supports any valid HTML markup … can also be used for documenting HTML-based frameworks such as Angular and Vue." Angular/Vue are auto-detected from `package.json` and the snippet label is set accordingly — [Code Connect HTML docs](https://developers.figma.com/docs/code-connect/html/)
- "Framework-specific parsers will no longer receive updates or support. Template files are now the only actively maintained way of using Code Connect." A migration guide to template files is provided — [Code Connect HTML docs](https://developers.figma.com/docs/code-connect/html/)
- Limitation: Code Connect files are not executed but treated as strings, so ternaries and conditionals are output verbatim and loops cannot generate connections. Property helpers include `figma.string()`, `figma.boolean()` and `figma.enum()` — [Code Connect HTML docs](https://developers.figma.com/docs/code-connect/html/)
- Published mappings make Dev Mode show "true-to-production code snippets from your design system instead of autogenerated code", and they improve the Figma MCP server's guidance to agents — [Code Connect docs](https://developers.figma.com/docs/code-connect/)

### Inferences
- For Helix, `.figma.ts` template files that emit `<cdx-button variant="...">` Angular template snippets are the supported path. The CLI (`figma connect publish` in CI with a token) is scriptable, so a Helix CLI could generate or validate template files from @cdx component metadata and run `figma connect parse --dry-run` as a parity check.
- Because CLI-published connections can only be edited in the CLI, the code repo should be the source of truth for mappings.

### Gaps
- I did not retrieve the full flag list (for example `--skip-validation` or exit-on-unreadable-files) or the `figma.config.json` schema.
- I could not confirm whether Code Connect requires an Organization/Enterprise plan as of 2026.
- No dated release note was found for the deprecation of the framework parsers.

## Figma MCP server (Dev Mode MCP): tools and Code Connect integration

### Takeaway
The Figma MCP server comes in two forms: a remote server (recommended, broadest features) and a desktop server. It now exposes read tools (design to code), write tools (`use_figma`, which edits the canvas), design-system search, and four Code Connect tools that let agents read, add and auto-suggest component mappings.

### Cited Findings
- Remote server: hosted endpoint, no desktop app needed, "broadest set of features". Desktop server: runs locally, and is required for Figma for Government. Figma also ships "skills" for MCP clients to make write tools more reliable — [Figma MCP server overview](https://developers.figma.com/docs/figma-mcp-server/)
- Read tools:
  - `get_design_context`: layers to code, React + Tailwind by default
  - `get_metadata`: sparse XML outline
  - `get_screenshot`
  - `get_variable_defs`: variables and styles in the selection
  - `get_motion_context`
  - `get_figjam`
  - `download_assets`
  - Source: [Figma MCP tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- Write tools:
  - `use_figma`: general create/edit/inspect across Design, FigJam and Slides
  - `generate_figma_design`: live web UI to layers
  - `create_new_file`
  - `upload_assets`
  - `generate_diagram`: Mermaid to FigJam
  - `generate_image`: uses AI credits
  - Source: [Figma MCP tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- Design system and Code Connect tools:
  - `get_libraries`
  - `search_design_system`: searches components, variables and styles across libraries
  - `get_code_connect_map`: returns the component name, source location and framework label
  - `add_code_connect_map`
  - `get_code_connect_suggestions` and `send_code_connect_mappings`: Figma-prompted auto-detection and confirmation
  - `create_design_system_rules`: an MCP prompt that generates agent rule files for your stack
  - Source: [Figma MCP tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- Remote-only tools include `download_assets`, `get_code_connect_suggestions`, `get_context_for_code_connect`, `get_libraries`, `search_design_system`, `whoami`, and all write tools except `use_figma` and `add_code_connect_map`. Selection-based prompting only works on the desktop server. The desktop server uses Dev Mode mappings, while the remote server requires a `clientFrameworks` parameter for Code Connect lookups — [Figma MCP tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)

### Inferences
- `get_design_context` defaults to React + Tailwind. For Angular/M3 output, Helix must supply context: Code Connect mappings (so the output references `cdx-*` components), `clientFrameworks: angular`, and rule files (for example from `create_design_system_rules` or helix-skills).
- `get_code_connect_suggestions` / `send_code_connect_mappings` provide an agent-driven path to bootstrap mappings for an existing Figma library, which is relevant to the Helix Figma library.

### Gaps
- I found no official per-plan rate limits or seat requirements (Dev/Full seat) for 2026.
- The launch dates of the remote server and the write-to-canvas tools were not captured from primary sources.

## Storybook: CLI (doctor, automigrate, upgrade, ai) and Storybook MCP / component manifest

### Takeaway
Storybook (v10.6 docs current, v11 alpha) has a mature maintenance CLI (`doctor`, `automigrate`, `upgrade --dry-run --yes`, `index`) and a new `storybook ai` command. The `@storybook/addon-mcp` addon serves an MCP endpoint at `localhost:6006/mcp` with dev, docs and test toolsets. The docs toolset depends on a component manifest, which is supported on `@storybook/angular-vite` but not on the Webpack-based `@storybook/angular`. That limitation matters for Angular teams.

### Cited Findings
- CLI commands (v10.6 docs): `dev`, `build`, `init`/`create-storybook`, `add`, `remove`, `upgrade`, `migrate` (codemods), `automigrate`, `doctor`, `info`, `sandbox`, `index` and `ai` — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- `doctor` "performs a health check … for common issues (e.g., duplicate dependencies, incompatible addons or mismatched versions)" and suggests fixes. Options: `-c`, `--package-manager`, `--debug` — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- `automigrate` runs config checks and migrations. Options: `--dry-run`, `--yes`, `--list` — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- `upgrade` options: `--dry-run`, `--skip-check`, `--skip-automigrations`, `-y/--yes`, `--features`, `-f/--force` (skips autoblockers), `--package-manager`, `--loglevel`, `--logfile` — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- `storybook index -o <file>` builds a JSON listing of all stories and docs entries — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- `storybook ai` provides "Helpers for AI agents" and supports `-o/--output` to write the prompt to a file. `storybook ai setup` generates a project-aware prompt telling an agent how to configure Storybook and write initial stories. It is currently limited to React + Vite — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- Install the MCP addon with `npx storybook add @storybook/addon-mcp`. The server runs at `http://localhost:6006/mcp` — [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)
- MCP tools by toolset:
  - Dev: `stories-changed`, `get-storybook-story-instructions`, `stories-preview`, `stories-find-by-component`, `review-create`
  - Docs: `docs-list`, `docs-show`, `docs-show-story`
  - Test: `test-run`, which runs component tests and a11y checks and requires `@storybook/addon-vitest`
  - Each toolset is toggleable through the addon `toolsets: {dev, docs, test}` option
  - Sources: [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview); [Storybook MCP API](https://storybook.js.org/docs/ai/mcp/api.md)
- The docs toolset reads a components manifest, which is off by default. Enable it with the `componentsManifest: true` feature flag in `.storybook/main.ts` — [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)
- Framework support for the manifest:
  - Full: React frameworks, `@storybook/angular-vite`, `@storybook/vue3-vite`.
  - Limited: `@storybook/angular` (Webpack) has no manifest.
  - The dev and test tools work across all frameworks.
  - Source: [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)
- The MCP API is marked "Preview — API may change". The docs list v10.6 as current, with v11 alpha, v9 and v8 also available — [Storybook MCP API](https://storybook.js.org/docs/ai/mcp/api.md)

### Inferences
- To give agents component docs through Storybook MCP, the Helix/@cdx Storybook would need to run on `@storybook/angular-vite`. A Helix CLI "doctor" could check this, alongside wrapping `storybook doctor` and `automigrate --dry-run`.
- The `storybook doctor` and `upgrade --dry-run` pattern (health check, then suggested fixes, then non-interactive `--yes`) is a good UX template for `helix doctor` / `helix migrate`.
- `stories-changed` + `review-create` + `test-run` together form an agent loop for validating component changes. A Helix CLI could invoke the same steps headlessly in CI.

### Gaps
- I did not retrieve the exact manifest schema (props, descriptions, examples) or check whether a hosted/remote (for example Chromatic-published) MCP exists.
- The MCP addon's first release date (approximately late 2025) is not confirmed from a primary source.

## Which vendors expose MCP servers, and which tools

### Takeaway
Seven of the tools here have an MCP server: Figma, Storybook, Supernova, zeroheight, Knapsack, Anima and Locofy. The design-system platforms (Supernova, zeroheight, Knapsack) expose the whole system (tokens, components, docs, mappings). Figma and Storybook are "source" tools. Supernova's MCP is the broadest and includes write access. zeroheight's is read-only docs.

### Cited Findings
- Supernova (blog dated 30 Aug 2026) identifies five vendors with design-system MCP servers: Figma, Storybook, zeroheight, Knapsack and Supernova. It splits them into source tools (Figma, Storybook) and design-system platforms (zeroheight, Knapsack, Supernova) that "hold the system: the tokens, the components, the documentation, and the connections between them". Note this is a vendor comparison written by Supernova — [Supernova blog](https://www.supernova.io/blog/design-system-mcp-servers)
- Supernova's MCP is described as read/write across tokens, component structure, component code, design-to-code mapping, docs/usage rules, and publishing/releases, with "unlimited" calls on all plans — [Supernova blog](https://www.supernova.io/blog/design-system-mcp-servers)
- Supernova connects Figma and Storybook data sources, manages tokens and collections, tracks component health, and provides a versioned source of truth — [everydev.ai Supernova](https://www.everydev.ai/tools/supernova); [Supernova documentation product](https://www.supernova.io/documentation)
- Observed in this session's tooling (not a web source): the Supernova MCP connected here (named "supernova-helix", which suggests Helix is already in Supernova) exposes tools including:
  - `sn_get_token_list`, `sn_get_token_detail`, `sn_get_token_theme_list`, `sn_get_token_usage`
  - `sn_get_component_list`, `sn_get_code_component_list`, `sn_get_figma_component_list`, `sn_get_storybook_story_list`
  - `sn_get_documentation_page_content`, `sn_get_knowledge_skill_list`, `sn_search`
  - Admin tools: `sn_admin_get_export_pipelines`, `sn_admin_get_export_pipeline_runs`, `sn_admin_get_export_build_logs`, `sn_admin_write`
  - It required authentication, so I did not exercise it.
- zeroheight MCP is read access to design-system documentation for Claude, Cursor, Copilot and others, at `https://mcp.zeroheight.com/mcp`. Admins/editors get one-click install commands for Cursor, VS Code, Claude Code and Codex — [zeroheight help center](https://help.zeroheight.com/hc/en-us/articles/48004395674011)
- Knapsack MCP was announced in beta in July 2025. It provides a per-workspace secure endpoint for querying docs, components and tokens. Three source types can be connected: Storybook, the Knapsack workspace, and Markdown files — [Knapsack blog](https://www.knapsack.cloud/blog/knapsacks-mcp-server-turns-design-systems-into-production-engines); [Knapsack Intelligent Tools docs](https://docs.knapsack.cloud/intelligent-tools)
- Anima MCP lets an agent fetch a Figma design and generate code, pull an Anima Playground project into the local repo, and (Enterprise) reference the team design system — [Anima MCP (mcpservers.org)](https://mcpservers.org/en/servers/animaapp/mcp-server-guide); [Glama listing](https://glama.ai/mcp/servers/g0ph3lpgj5)
- Locofy MCP exposes Locofy-generated code (from Figma via the Locofy plugin and Builder) to Cursor, Windsurf, Claude Desktop and others for cleanup, interactivity and logic. Tokens are generated in Dashboard > Project settings > MCP Configuration — [Locofy MCP docs](https://www.locofy.ai/docs/export-and-deployment/locofy-mcp)
- Builder.io (Fusion / Visual Copilot):
  - The Builder CLI ships as the `@builder.io/dev-tools` npm package.
  - Figma-to-code runs as `npx @builder.io/dev-tools@latest figma code --url URL --spaceId SPACE_ID` after exporting with the Builder Figma plugin.
  - It handles code generation and code sync into the repo.
  - Sources: [Builder figma-to-code CLI docs](https://www.builder.io/c/docs/figma-to-code-builder-cli); [Builder CLI API](https://www.builder.io/c/docs/builder-cli-api)
- The Angular CLI itself now ships an MCP server (relevant for Angular-side agent tooling) — [angular.dev AI MCP](https://v21.angular.dev/ai/mcp)

### Inferences
- Supernova already holds Helix's tokens, Figma components, code components and Storybook stories, and its MCP exposes token usage and export pipelines. A Helix CLI could act as a thin, scriptable front end over the Supernova API, Figma Code Connect and Storybook, rather than duplicating platform data.
- The pattern across vendors: remote HTTP MCP with OAuth, plus a one-click installer per agent (Cursor/Claude Code/Codex). A Helix CLI could provide `helix mcp install` to wire up Figma, Storybook, Supernova and Angular CLI MCPs in one step.

### Gaps
- I did not retrieve exact tool names for the zeroheight, Knapsack, Anima and Locofy MCPs.
- Builder.io's Angular output support, and whether Builder exposes its own MCP, are unverified (the docs page returned 403).
- No current information was found on a Specify MCP.

## Design-system health / drift detection (Figma <-> code parity, token drift)

### Takeaway
Drift detection is still fragmented. Partial building blocks exist:
- Terrazzo lint (token quality and a11y)
- Storybook `doctor` (tooling health) and `test-run` (component a11y and tests)
- Figma's Code Connect suggestion tools (unmapped components)
- Supernova's "component health" and token-usage data
- Community Figma MCPs with explicit parity and audit tools

No first-party tool found does end-to-end Figma-variable versus code-token drift reporting for Angular.

### Cited Findings
- Terrazzo lint covers required modes, duplicate values, naming consistency, required descriptions and WCAG contrast pairs, and can fail the build at `error` severity — [Terrazzo linting](https://terrazzo.app/docs/linting/)
- `storybook doctor` checks duplicate dependencies, incompatible addons and mismatched versions — [Storybook CLI options](https://storybook.js.org/docs/api/cli-options)
- Storybook MCP `test-run` runs component tests and accessibility checks, and `stories-changed` identifies affected stories — [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)
- Figma MCP `get_code_connect_suggestions` detects potential component mappings, and `get_code_connect_map` returns existing mappings with source locations. Comparing the two shows which Figma components are not linked to code — [Figma MCP tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- Supernova markets component health tracking and token usage across Figma and Storybook sources — [everydev.ai Supernova](https://www.everydev.ai/tools/supernova); [Supernova blog](https://www.supernova.io/blog/design-system-mcp-servers)
- Observed in this session's tooling (not a web source): the community "figma-console" MCP connected here exposes:
  - parity tools: `figma_check_design_parity`, `figma_audit_design_system`, `figma_audit_design_system_report`, `figma_ds_verify`, `figma_lint_design`
  - change tracking: `figma_diff_versions`, `figma_get_changes_since_version`, `figma_generate_changelog`
  - a11y: `figma_audit_component_accessibility`, `figma_scan_code_accessibility`
  - token export: `figma_export_tokens`
  - This shows the community is building Figma-to-code parity and audit tooling over MCP. Provenance and docs were not verified.

### Inferences
- A distinctive Helix CLI capability could be `helix audit`/`helix drift`, which would:
  - export Figma variables (Figma MCP `get_variable_defs` or the REST Variables API) and diff them against the @cdx DTCG tokens;
  - list Figma library components without Code Connect mappings;
  - list @cdx components without Storybook stories or manifest entries;
  - run Terrazzo-style token lint and a11y contrast checks;
  - wrap `storybook doctor`;
  - emit a JSON report so agents can consume it.

### Gaps
- No primary-source documentation was found for a vendor feature that explicitly reports "Figma variable versus code token drift". Supernova's "component health" specifics, and any equivalent from zeroheight or Knapsack, are unverified.
- Not researched: Figma's own library analytics (component and variable usage) as a drift signal.
