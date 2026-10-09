# Enterprise Design System Developer Tooling (CLI / codemods / lint / MCP): Carbon, Fluent, Spectrum, Paste, Canvas Kit, EUI, Pajamas, PatternFly, Ant Design, MUI

Research date: 2026-10-07. Most official doc pages fetched did not show publication dates; where a date is missing that is noted under Gaps.

## Q1. Commands and capabilities: how codemods are packaged and run (npx, jscodeshift, ESLint), and dry-run/report modes

### Takeaway
Nearly every system ships codemods as a single npx-runnable package with a `<transform|version> <path>` signature. The engines vary: jscodeshift for MUI and Carbon, ESLint rules for PatternFly. Dry-run is the norm (`--dry` or omitting `--write`). The newest pattern comes from Ant Design (`@ant-design/cli`) and React Spectrum (`--agent`): one CLI that serves both humans and agents, with JSON output and non-interactive modes.

### Cited Findings
**IBM Carbon**
- `@carbon/upgrade` runs via `npx @carbon/upgrade`. Its `migrate` command has the syntax `@carbon/upgrade migrate <migration> [paths...]` — [npm @carbon/upgrade](https://npmjs.com/package/@carbon/upgrade) (search snippet; npm returned 403 on direct fetch)
- Example v11 migration: `npx @carbon/upgrade migrate update-carbon-components-react-import-to-scoped --write`. Without `--write` the migration runs as a dry run and only shows the changes — [Carbon migration guide (develop)](https://carbondesignsystem.com/migrating/guide/develop); [npm](https://npmjs.com/package/@carbon/upgrade)
- In v11, packages moved to dedicated `@carbon` scopes. For example, `carbon-components` and `carbon-components-react` were consolidated into `@carbon/react` — [npm @carbon/upgrade](https://npmjs.com/package/@carbon/upgrade)

**Microsoft Fluent UI**
- Fluent ships codemods for name and API changes, run with `npx @fluentui/codemods` — [Fluent v8 migration guide wiki](https://github.com/microsoft/fluentui/wiki/Version-8-migration-guide/2c387c567d0a4089b9b89ba9d698f935101a1888)
- For v8 to v9 (`@fluentui/react-components`), Fluent offers `@fluentui/react-migration-v8-v9`. It is a package of shims: each shim exposes a v8 component's props interface and renders a v9 component. Microsoft recommends migrating to v9 components rather than relying on the shims — [npm @fluentui/react-migration-v8-v9](https://www.npmjs.com/package/@fluentui/react-migration-v8-v9)
- Major v8 to v9 breaks: v9 has no Stack component (use CSS flex or grid), styling moves to Griffel `makeStyles`, and theming is provider-based — [SPFx Fluent v9 migration blog, 2026](https://imrizwan.com/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026) (secondary source)
- A GitHub issue reports that the v8 to v9 migration documentation is out of date — [microsoft/fluentui #31782](https://github.com/microsoft/fluentui/issues/31782)

**Adobe React Spectrum (S2)**
- Upgrade assistant: `npx @react-spectrum/codemods s1-to-s2` — [React Spectrum: Migrating](https://react-spectrum.adobe.com/migrating)
- Flags:
  - `--components=Button,TextField` limits the run to specific components.
  - `--path` sets the directory (default `.`).
  - `--dry` previews changes without writing them.
  - `--ignore-pattern` excludes files (default `**/node_modules/**`).
  - `--agent` runs non-interactively for AI tools. It "skips prompts, package installation, and macro setup, so `@react-spectrum/s2` must already be installed and resolvable".
  - Source: [React Spectrum: Migrating](https://react-spectrum.adobe.com/migrating)
- The codemod can leave `TODO(S2-upgrade)` comments, each marking a change that needs manual review — [React Spectrum migrating (search snippet)](https://react-spectrum.adobe.com/migrating). A WebFetch of the same page did not surface this text, so treat it as likely but unverified.
- Migration skill: `npx skills add https://react-spectrum.adobe.com --skill migrate-react-spectrum-v3-to-s2 --skill react-spectrum-s2` — [React Spectrum: Migrating](https://react-spectrum.adobe.com/migrating)
- Real-world use: Adobe's alloy repo ran a series of per-view "Migrated ... to Spectrum 2" PRs (e.g. #1574, #1576, #1583) — [adobe/alloy PR #1576](https://github.com/adobe/alloy/pull/1576)

**Twilio Paste**
- `npx @twilio-paste/codemods` runs in two modes — [Paste codemods docs (Mintlify mirror)](https://www.mintlify.com/Twilio-labs/paste/utilities/codemods); [twilio-labs/paste](https://github.com/twilio-labs/paste)
  - Interactive mode prompts for the path, the dialect (JS or TS) and the transform.
  - CLI mode: `npx @twilio-paste/codemods <transform> <path> [...options]`.
- Example transform: `barreled-to-unbarreled` rewrites `@twilio-paste/core` barrel imports into per-package imports, for better tree-shaking and faster builds — [Paste codemods docs](https://www.mintlify.com/Twilio-labs/paste/utilities/codemods)

**Workday Canvas Kit**
- `npx @workday/canvas-kit-codemod [version] [path]`, e.g. `... v7 [path]` or `... v8 [path]` — [Canvas Kit v8 upgrade guide](https://canvas.workday.com/whats-new/upgrade-guides/canvas-kit-v8-upgrade-guide); [v7 guide](https://design.workday.com/whats-new/upgrade-guides/canvas-kit-v7-upgrade-guide)
- Workday ships one upgrade guide per major version: [v9](https://canvas.workday.com/whats-new/upgrade-guides/canvas-v9-upgrade-guide), [v11](https://canvas.workday.com/help/upgrade-guides/canvas-v11-upgrade-guide)
- The guides set clear expectations — [Canvas Kit upgrade guides](https://canvas.workday.com/whats-new/upgrade-guides/canvas-kit-v8-upgrade-guide):
  - The codemod only touches .js, .jsx, .ts and .tsx files.
  - Other files (.json, .mdx, .md) may need manual changes.
  - Run your linter afterwards.
  - Commit the codemod output as a single isolated commit so it is easy to roll back.

**MUI**
- Version-scoped transforms run as `npx @mui/codemod@latest v7.0.0/<transform> <path>` — [MUI upgrade to v7](https://mui.com/material-ui/migration/upgrade-to-v7/). Examples:
  - `v7.0.0/grid-props`
  - `v7.0.0/input-label-size-normal-medium`
  - `v7.0.0/lab-removed-components`
- The codemods use jscodeshift options: `--dry`, `--print`, `--parser` — [MUI upgrade to v7](https://mui.com/material-ui/migration/upgrade-to-v7/)
- MUI documents known gaps per codemod. For example, the lab codemod does not update type imports — [MUI upgrade to v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

**Red Hat PatternFly**
- `npx @patternfly/pf-codemods` is built on ESLint and targets the v5 and v6 upgrades — [pf-codemods README](https://raw.githubusercontent.com/patternfly/pf-codemods/main/README.md)
- Sibling tools: `class-name-updater` (CSS class migration), `css-vars-updater` (CSS variables), `tokens-update` (design tokens), and `@patternfly/eslint-plugin-pf-codemods` (the rules package) — [pf-codemods README](https://raw.githubusercontent.com/patternfly/pf-codemods/main/README.md)

**Ant Design**
- `@ant-design/cli` (the `antd` binary) is the broadest DS CLI found in this research — [Ant Design: For Agents](https://ant.design/docs/react/for-agents)
- Lookup commands work offline:
  - `list` and `info <component>` (props, types, defaults)
  - `doc <component>` and `demo <component> <name>`
  - `token <component>` and `semantic <component>` (classNames/styles structure)
  - `changelog <versions> <component>` (API differences across versions)
  - `design.md`
- Project commands:
  - `doctor`
  - `env` (bug-report info)
  - `usage ./path` (analyses antd imports)
  - `lint ./path` (deprecated APIs, best practices)
  - `migrate <from> <to>`, plus `migrate <from> <to> --apply ./path`, which emits an "agent-ready migration prompt"
- Agent and maintenance commands: `mcp`, `setup --client <claude|cursor|vscode|codex>`, `upgrade`
- `--format json` gives structured output.

**Elastic EUI**
- `@elastic/eslint-plugin-eui` has about 25 rules — [EUI eslint-plugin package](https://github.com/elastic/eui/tree/main/packages/eslint-plugin)
  - Most are accessibility rules, e.g. `require-aria-label-for-modals`, `tooltip-focusable-anchor`, `require-table-caption`, `no-nested-interactive-element`.
  - Others cover migration and tokens: `no-restricted-eui-imports` flags deprecated imports with migration guidance, and `no-css-color` warns against hardcoded colours in favour of EUI tokens.
  - Only a few autofix, e.g. `no-deprecated-icon-aliases` and `badge-accessibility-rules`.
- The EUI monorepo also contains `release-cli`, `eui-docgen` and `eui-usage-analytics` — [elastic/eui packages](https://github.com/elastic/eui/tree/main/packages)
- No EUI codemod package turned up in this research.

**GitLab Pajamas**
- GitLab consolidated its custom ESLint rules and config into `@gitlab/eslint-plugin`, following a Frontend RFC — [gitlab MR 27415](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/27415/pipelines)
- GitLab migrated its ESLint configs to Flat Config, which ESLint 9 requires — [docs-gitlab-com issue 146](https://gitlab.com/gitlab-org/technical-writing/docs-gitlab-com/-/issues/146)
- `@gitlab/stylelint-config` replaced scss-lint — [gitlab-docs MR 1713](https://gitlab.com/gitlab-org/gitlab-docs/-/merge_requests/1713/pipelines)
- gitlab-ui ships a Tailwind config so consumers can use Pajamas-compliant CSS utilities — [gitlab-ui commit](https://gitlab.com/gitlab-org/gitlab-ui/commit/fafca856afe775f6b7f1442065de8b8a2af521e8)

### Inferences
- The shared convention is clear: `npx <scope>/codemods <version-or-transform> <path>`, dry-run by default or via `--dry`, with an explicit write flag. A Helix CLI (`npx @cdx/cli migrate <from> <to> [path] --dry|--write`) would match what developers already expect.
- For Angular, jscodeshift is a poor fit. Angular's own `ng update` schematics and ts-morph are the likely analogues. PatternFly's ESLint-based approach also transfers well, because `@angular-eslint` rules plus `--fix` give you dry-run (lint) and write (fix) from one rule set, and that same rule set can double as a CI lint.
- Ant Design's `migrate --apply` emitting an agent prompt, and React Spectrum's `--agent` flag, show a hybrid pattern: deterministic codemods do what they can, and an agent handles the long tail of manual TODOs.

### Gaps
- Carbon: I could not retrieve the full `@carbon/upgrade` command and migration list or the latest version (npm returned 403). I found no evidence of a "carbon-upgrade CLI" separate from `@carbon/upgrade`, and no Carbon stylelint plugin details (`stylelint-plugin-carbon-tokens` exists in the community, but I did not verify it this session).
- Fluent: I did not verify the exact v9 codemod transforms or whether `@fluentui/codemods` covers v8 to v9 (it appears historically focused on v7 to v8).
- PatternFly: the exact pf-codemods flags (`--fix`, `--only`, `--exclude`, `--v6`) were not visible in the fetched README extract.
- Canvas Kit: I did not confirm the latest major-version codemod (v12, v13 or v14).
- Spectrum CSS tooling, Bitwarden and Morningstar were not researched for lack of budget.

## Q2. Which systems have MCP servers for agents, what tools they expose, and dates

### Takeaway
By 2026, official MCP servers exist for:
- **Carbon:** hosted HTTP server with IBMid auth.
- **MUI:** `@mui/mcp`.
- **React Spectrum:** `@react-spectrum/mcp`.
- **PatternFly:** `@patternfly/patternfly-mcp`.
- **Ant Design:** built into `antd mcp`.
- **Fluent UI Blazor:** NuGet package.

All of them are read-only knowledge and documentation servers. None exposes code transformation as an MCP tool. Most pair the server with `llms.txt` and installable Agent Skills.

### Cited Findings
**Carbon MCP (IBM)**
- Hosted at `https://mcp.carbondesignsystem.com/mcp` over HTTP transport — [Carbon MCP onboarding](https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/developing/carbon-mcp/onboarding-and-setup.mdx); [Carbon MCP overview](https://carbondesignsystem.com/developing/carbon-mcp/overview/)
- Auth is a bearer token plus an `X-MCP-Session` header, obtained through IBMid/w3id OAuth. IBMers get credentials immediately; non-IBMers must request access and are activated by email — [Carbon MCP onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/)
- Tools — [identityforge summary](https://identityforge.io/learn/carbon-design-system); [Carbon MCP onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/):
  - `docs_search` covers Carbon and IBM Products documentation.
  - `code_search` covers React and Web Components examples, icons and pictograms.
  - `get_charts` covers Carbon Charts examples.
  - `labs_search` covers Carbon Labs.
- Supported clients: IBM Bob, Claude Code, Claude Desktop, Cursor, Codex, Figma Make, GitHub Coding Agent and VS Code — [Carbon MCP onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/)
- Carbon also publishes a `carbon-builder` agent skill, an `llms.txt` index and a prompts page — [Carbon MCP onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/); [Carbon MCP prompts](https://carbondesignsystem.com/developing/carbon-mcp/prompts/)

**MUI MCP**
- Installed with `npx -y @mui/mcp@latest` (stdio), e.g. `claude mcp add mui-mcp -- npx -y @mui/mcp@latest`. It exposes `useMuiDocs` and `fetchDocs` to retrieve official docs and code from published registries, so answers carry real links instead of hallucinated ones — [MUI MCP docs](https://mui.com/material-ui/getting-started/mcp/)
- The MUI MCP page also exists on the v7 docs site, so it predates v8 docs — [v7.mui.com MCP](https://v7.mui.com/material-ui/getting-started/mcp/)

**React Spectrum MCP**
- Installed with `npx @react-spectrum/mcp@latest`. Docs give setup for Cursor, VS Code (`code --add-mcp`), Claude Code, Codex and Gemini CLI. Its stated purpose: it "helps AI agents browse the documentation" — [React Spectrum: Working with AI](https://react-spectrum.adobe.com/ai)
- Supporting resources: Agent Skills via `npx skills add https://react-spectrum.adobe.com`, an `llms.txt`, a `.md` version of every docs page, and a copy-as-markdown button — [React Spectrum ai.md](https://react-spectrum.adobe.com/ai.md)
- React Spectrum Charts has its own separate MCP server — [React Spectrum Charts McpServer](https://opensource.adobe.com/react-spectrum-charts/docs/docs/developers/McpServer/)

**PatternFly MCP**
- Installed with `npx -y @patternfly/patternfly-mcp@latest`. Requires Node 22+ (Node 20 works without plugins). Supports stdio or `--http --port 8080` — [patternfly-mcp repo](https://github.com/patternfly/patternfly-mcp)
- Tools — [patternfly-mcp usage.md](https://raw.githubusercontent.com/patternfly/patternfly-mcp/main/docs/usage.md):
  - `searchPatternFlyDocs(searchQuery, collection?)` supports wildcards.
  - `usePatternFlyDocs(name? | urlList[≤15], version? v5|v6)` auto-appends the component's JSON Schema.
- Resources — [patternfly-mcp usage.md](https://raw.githubusercontent.com/patternfly/patternfly-mcp/main/docs/usage.md):
  - `patternfly://docs/index|meta`, `components/index|meta`, `schemas/index|meta`
  - `patternfly://docs/{name}`, `patternfly://schemas/{name}`, `patternfly://context`
- Extensible: custom tool plugins load with `--tool ./mcp-tools/x.js`, which lets teams add org-specific tools — [patternfly-mcp usage.md](https://raw.githubusercontent.com/patternfly/patternfly-mcp/main/docs/usage.md)
- Small project: about 5 stars, 12 forks and 249 commits at fetch time — [patternfly-mcp repo](https://github.com/patternfly/patternfly-mcp)

**Ant Design MCP**
- Built into the CLI from `@ant-design/cli` v6.3.5 as `antd mcp`, with 8 tools (e.g. `antd_list`, `antd_info`) and 2 prompts. You can pin the antd version, and `antd setup --client claude|cursor|vscode|codex` writes the client config — [Ant Design MCP doc](https://ant.design/docs/react/mcp.md); [For Agents](https://ant.design/docs/react/for-agents)
- AI resources — [For Agents](https://ant.design/docs/react/for-agents):
  - `llms.txt`, `llms-full.txt` and `llms-full-cn.txt`
  - `design.md`
  - per-component `.md` URLs
  - skills via `npx skills add ant-design/ant-design-cli`

**Fluent UI**
- The official MCP server is for Blazor: NuGet `Microsoft.FluentUI.AspNetCore.McpServer`. It provides component, enum, icon and docs lookup plus v4 to v5 migration lookup, bundled with a skill in a `fluentui-blazor` plugin — [awesome-copilot fluentui-blazor plugin](https://git.cynarski.dev/Awesome/awesome-copilot/src/commit/32f32c9809efca35d54c9c5b37210e307aa8645f/plugins/fluentui-blazor) (mirror, secondary)
- For Fluent React v9, only community MCP servers turned up, e.g. aminvishvam/fluentui-mcp-server — [GitHub](https://github.com/aminvishvam/fluentui-mcp-server)

**Twilio Paste, Elastic EUI, GitLab Pajamas, Workday Canvas**
- I found no Paste-specific MCP. Twilio's MCP and Skills cover Twilio APIs, not Paste — [Twilio: Building with AI](https://www.twilio.com/docs/ai.md)
- Elastic's MCP is for the docs-builder (Elastic product docs), not EUI — [Elastic docs-builder MCP](https://docs-v3-preview.elastic.dev/elastic/docs-builder/pull/2736/mcp)
- I found no official EUI, Pajamas or Canvas Kit MCP.

**Community overview**
- A community tracker catalogues AI adoption across design systems, including Carbon and React Spectrum S2 — [State of AI in Design Systems](https://state-of-ai-in-design-systems.netlify.app/systems/carbon-design-system)

### Inferences
- The baseline "AI-ready DS" kit in 2026 has four parts:
  - an MCP for docs and component search plus schema/props lookup
  - `llms.txt` and per-page `.md`
  - installable Agent Skills (`npx skills add ...`)
  - setup one-liners per client (Claude Code, Cursor, VS Code, Codex)

  Helix already has skills (helix-skills); the gaps against peers are an MCP, `llms.txt`, and a `setup --client` helper.
- Ant Design's model (MCP inside the CLI, plus `setup --client`) is the closest template for a "Helix CLI": one npm package, one binary, offline metadata bundled per version.
- PatternFly's `--tool` plugin hook and its JSON-schema-per-component resources are good patterns for exposing Angular component APIs.
- Carbon's hosted, auth-gated MCP suits enterprise IP control, but it adds friction. Local npx stdio servers (MUI, PatternFly, Spectrum, antd) are easier to adopt.

### Gaps
- I found no launch dates for the Carbon, MUI, Spectrum or PatternFly MCPs. The `@ant-design/cli` MCP is version-dated (v6.3.5) but not calendar-dated. Check npm publish dates.
- Sources disagree on Carbon's tool list. The onboarding page lists `code_search`, `docs_search`, `get_charts` and `doc_search`; a secondary source lists `labs_search` in place of `doc_search`.
- I did not retrieve the full list of 8 `antd mcp` tool names, or the exact tool names for `@react-spectrum/mcp`.

## Q3. Upgrade and migration UX lessons

### Takeaway
The best migration UX combines four things:
- per-version codemods with dry-run
- explicit in-code TODO markers for what automation could not handle
- lint rules that keep flagging deprecated APIs after the upgrade
- an agent hand-off for the residue (an agent mode or prompt)

Ant Design and React Spectrum lead on agent integration. PatternFly leads on lint-based reporting.

### Cited Findings
- React Spectrum's `--agent` mode is non-interactive: no prompts, no installs, no macro setup. It is paired with a dedicated `migrate-react-spectrum-v3-to-s2` skill so an agent can finish the migration — [React Spectrum: Migrating](https://react-spectrum.adobe.com/migrating)
- Ant Design `migrate <from> <to> --apply ./path` produces an "agent-ready migration prompt", and `changelog <versions> <component>` shows per-component API differences — [Ant Design: For Agents](https://ant.design/docs/react/for-agents)
- PatternFly's codemods are ESLint-based, so they report findings the way lint does before or alongside fixing. Separate updaters handle class names, CSS variables and tokens — [pf-codemods README](https://raw.githubusercontent.com/patternfly/pf-codemods/main/README.md)
- Canvas Kit's guidance: isolate the codemod commit, run lint afterwards, and expect manual work in non-JS/TS files — [Canvas Kit v8 upgrade guide](https://canvas.workday.com/whats-new/upgrade-guides/canvas-kit-v8-upgrade-guide)
- MUI splits migrations into small single-purpose transforms with documented limitations per transform — [MUI upgrade to v7](https://mui.com/material-ui/migration/upgrade-to-v7/)
- Carbon uses `--write` as the opt-in, so the default is a safe dry run — [Carbon migration guide](https://carbondesignsystem.com/migrating/guide/develop)
- Fluent's shim approach (v8 props rendering v9 components) allows incremental migration, but Microsoft discourages relying on it long term — [npm @fluentui/react-migration-v8-v9](https://www.npmjs.com/package/@fluentui/react-migration-v8-v9)
- EUI's `no-restricted-eui-imports` rule keeps flagging deprecated imports with migration guidance after the upgrade — [EUI eslint-plugin](https://github.com/elastic/eui/tree/main/packages/eslint-plugin)

### Inferences
For Helix, a combined design would look like this:
- `helix migrate --from X --to Y [--dry] [--write] [--agent] [--format json]`
- Implement it as Angular schematics or ts-morph transforms.
- Have it emit `TODO(helix-upgrade)` markers and a JSON report.
- Ship matching `@cdx/eslint-plugin` rules so deprecations stay visible.
- Expose the remaining TODOs to a helix-skills migration skill.

### Gaps
- I did not collect quantitative evidence on codemod success rates or the manual remainder for any system.

## Q4. Usage analytics and adoption tracking

### Takeaway
Elastic EUI has the most concrete public adoption-measurement tool. `eui-usage-analytics` uses react-scanner to record every component usage, with its props and code owner, into an Elasticsearch index. Ant Design's `antd usage ./path` is a local, CLI-level counterpart. I found no telemetry in the MCPs reviewed.

### Cited Findings
- EUI `packages/eui-usage-analytics` runs `react-scanner` over Elastic products (the Kibana repo is cloned alongside). It records all React component usages, not just EUI ones, and resolves the code owner of each usage. Each record holds component, module, timestamp, repo, file, code owners, props and GitHub line links, and is written to an Elastic Cloud index named `eui_components`. It runs as `CLOUD_ID_SECRET=… AUTH_APIKEY_SECRET=… node index.js` — [eui-usage-analytics](https://github.com/elastic/eui/tree/main/packages/eui-usage-analytics)
- Ant Design `antd usage ./path` analyses antd imports in a codebase. `antd lint ./path` checks for deprecated APIs and best-practice issues. Both support `--format json` — [Ant Design: For Agents](https://ant.design/docs/react/for-agents)
- The Carbon MCP onboarding page says nothing about telemetry or rate limits — [Carbon MCP onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/)

### Inferences
- A `helix usage [path] --format json` command could report per-component and per-version counts, deprecated-API hits and code-owner attribution. Running it in CI, as EUI does, and aggregating the results would give the Helix team adoption dashboards. For Angular this means scanning templates as well as TS imports, e.g. with `@angular-eslint/template-parser` or the Angular compiler APIs.
- Carbon's auth-gated hosted MCP could in principle provide per-user usage analytics, but this is not documented.

### Gaps
- I did not research usage-analytics features for Carbon, PatternFly, MUI, Paste, Canvas or Pajamas this session.
- Third-party tools such as Omlet and react-scanner-based dashboards were out of scope.
