# Angular / Nx CLI tooling for design-system setup, scaffolding, migrations and AI guidance (research date: 2026-10-07)

## 1. How ng add / ng generate / ng update schematics work for a third-party library, and how major libraries use them

### Takeaway
A library ships schematics inside its npm package: `package.json` points `"schematics"` at a `collection.json` (ng-add + generators) and `"ng-update": {"migrations": ...}` at a migrations file; the Angular CLI discovers and runs them with no extra install. Material, Taiga UI, NG-ZORRO, Angular ESLint and Spartan all use this channel, but the trend in 2025–26 is to pair (or partly replace) it with standalone CLIs (Kendo CLI) and AI-facing surfaces (MCP servers, agent skills).

### Cited Findings
**Mechanics (official Angular docs)**
- `collection.json` maps schematic names to a `factory` (e.g. `./ng-add/index#ngAdd`) and a `schema` JSON file defining options — [angular.dev: Schematics for libraries](https://angular.dev/tools/cli/schematics-for-libraries)
- Library `package.json` declares `"schematics": "./schematics/collection.json"` and `"ng-add": { "save": "devDependencies" }`; `save` accepts `false`, `true`, `"dependencies"`, `"devDependencies"` — [angular.dev](https://angular.dev/tools/cli/schematics-for-libraries)
- Three schematic kinds: `ng-add` (run automatically by `ng add <pkg>` after install), generators (`ng generate <lib>:<schematic>`), and `ng-update` migrations (referenced from a migrations JSON) — [angular.dev](https://angular.dev/tools/cli/schematics-for-libraries)
- Packaging: schematics are compiled with a dedicated `tsconfig.schematics.json` (`rootDir: "schematics"`), and a `postbuild` copy step must copy `schema.json`, `files/**` templates and `collection.json` into `dist/` — they are not handled by ng-packagr automatically — [angular.dev](https://angular.dev/tools/cli/schematics-for-libraries)
- `ng update` flags: `--migrate-only`, `--name` (run a single named migration), `--from` / `--to` (with `--migrate-only`), `--force`, `--next`, `--create-commits` (`-C`), `--allow-dirty`, `--verbose`. No `--dry-run` is documented for `ng update` — [angular.dev/cli/update](https://angular.dev/cli/update)

**Angular Material / CDK**
- Current `@angular/material` `collection.json` (main branch): `ng-add` (aliases `material-shell`, `install`; "Adds Angular Material to the application without affecting any templates"), private `ng-add-setup-project` (runs after deps installed — two-phase pattern), generators `dashboard`, `table`, `navigation`, `tree`, `addressForm`, and `m3Theme` (alias `theme-color`, "Generate M3 theme") — [angular/components collection.json](https://raw.githubusercontent.com/angular/components/main/src/material/schematics/collection.json)
- Material's `migration.json` on main currently holds only one entry: `migration-v22`, version `22.0.0-0`, "Updates Angular Material to v22", factory `./ng-update/index_bundled#updateToV22` (old migrations are pruned each major; factories are bundled) — [angular/components migration.json](https://raw.githubusercontent.com/angular/components/main/src/material/schematics/migration.json)

**Taiga UI**
- `@taiga-ui/cdk` schematics: `ng-add` ("Add Taiga UI to the project"), private `ng-add-setup-project`, and private `updateToV5` ("Manually run migration to update Taiga to v5.x.x") — same two-phase ng-add pattern as Material plus a manually invokable major migration — [taiga-ui collection.json](https://raw.githubusercontent.com/taiga-family/taiga-ui/main/projects/cdk/schematics/collection.json)

**NG-ZORRO**
- `ng add ng-zorro-antd` prompts for i18n, stylesheets, initial modules; generators produce template components, e.g. `ng g ng-zorro-antd:form-normal-login login` — [ng.ant.design schematics docs](https://ng.ant.design/docs/schematics/en)
- NG-ZORRO also publishes `llms-full.txt` — [ng.ant.design/llms-full.txt](https://ng.ant.design/llms-full.txt)

**Angular ESLint**
- `ng add @angular-eslint/schematics` auto-detects single-project workspaces without a linter and wires up config; the collection also covers adding ESLint to new projects and migrating between versions — [tessl registry summary of @angular-eslint/schematics](https://tessl.io/registry/tessl/npm-angular-eslint--schematics) (secondary source)

**Spartan/ng (shadcn-style, copy-into-repo)**
- `@spartan-ng/cli` works as both an Angular CLI schematic collection and an Nx plugin with no extra config: `ng g @spartan-ng/cli:ui` / `npx nx g @spartan-ng/cli:ui` — [spartan.ng CLI docs](https://www.spartan.ng/documentation/cli)
- Generators: `ui-theme` (one-time theme + Tailwind setup), `ui` (add one/all components), `info` (read-only project summary, `--json` for machine-readable output); the agent skill also references `init` and `healthcheck` — [spartan.ng CLI](https://www.spartan.ng/documentation/cli); [spartan.ng skills](https://www.spartan.ng/documentation/skills)
- Adding a component installs "Brain" primitives as npm deps and copies "Helm" styled files into the codebase — [spartan.ng CLI](https://www.spartan.ng/documentation/cli)

**Kendo UI for Angular (standalone CLI alongside ng add)**
- `ng add` for Kendo packages adds the dependency, registers the Default theme in `angular.json`, adds peer deps, and runs npm install — [Telerik search result: getting started](https://telerik.com/kendo-angular-ui/getting-started)
- Major-version migrations moved to a separate CLI: `@progress/kendo-cli` (`npx @progress/kendo-cli migrate`), available from Kendo UI for Angular v19.0.0 / Kendo CLI v1.9.0; codemods handle property renames, value changes, deprecations, applied version-by-version; flags `--force` (no prompts), `--no-codemods`, `--no-install`, `--from`, `--to`, `--ignore-pattern` — [Telerik: assisted migration](https://www.telerik.com/kendo-angular-ui-develop/components/assisted-migration)
- Kendo's MCP server includes an "Upgrade Assistant" that runs the codemods then uses AI to fix remaining compilation errors — [Telerik: assisted migration](https://www.telerik.com/kendo-angular-ui-develop/components/assisted-migration)
- A user feedback item requests an option to stop the Kendo CLI migration tool from reformatting HTML templates (a known codemod pain point) — [Telerik feedback 1696502](https://feedback.telerik.com/kendo-angular-ui/1696502-kendo-cli-migration-tool-option-to-suppress-automatic-reformatting-of-angular-html-templates)

### Inferences
- For @cdx/*, the zero-friction distribution path is: add `"schematics"` + `"ng-update"` fields to the main `@cdx/*` package, ship `ng-add` (deps, theme SCSS, providers, fonts, AI config), generators (e.g. `theme`, page templates), and versioned `ng-update` migrations. `ng update @cdx/core` then runs migrations automatically and also works under `nx migrate` (see section 3).
- Pros of schematics: no extra install, discovered by CLI/Nx/Nx Console, Tree-based virtual FS with atomic commit and built-in dry-run for generate, `--create-commits` for updates. Cons: tied to Angular CLI/devkit versions, awkward packaging (manual copy step), only runs inside Angular workspaces, migrations limited to the "update" moment, poor fit for read-only diagnostics (like `helix-check`) and for structured JSON output.
- Pros of a standalone CLI (Kendo model): own release cadence, `doctor/check` commands, `--json`, can run in non-Angular contexts and CI. Cons: extra install, users must know it exists, duplicates `ng update` UX.
- Hybrid pattern evidenced by Spartan: one package serving as Angular schematic + Nx plugin + `--json` info command consumed by an agent skill + MCP server. This is the closest analogue to a "Helix CLI" that wraps `helix-check`.

### Gaps
- Did not verify NgRx's current `migrations.json` contents or PrimeNG's schematics (PrimeNG appears not to ship `ng add`; unconfirmed).
- Angular Material's historical MDC migration schematic (v15-era, `ng generate @angular/material:mdc-migration`) could not be re-confirmed from a primary source in this session; it is absent from the current collection.json, consistent with removal.
- Clarity: no current findings collected (Clarity Angular components were deprecated by VMware; not verified here).
- `ng generate` flags (`--dry-run`, `--defaults`, `--interactive=false`, `--force`) not re-fetched in this session; widely documented but should be confirmed at https://angular.dev/cli/generate.

## 2. Angular CLI MCP server (`ng mcp`) and angular.dev AI guidance

### Takeaway
`ng mcp` (Angular CLI) is a stdio MCP server whose tool set has churned heavily: v21 had `find_examples`, `modernize`, and experimental `build/test/e2e`; in Apr–May 2026 those were removed in favour of a unified `run_target` and "schematic discovery" instructions. The v22 docs list 9 tools. Angular also ships llms.txt, a best-practices.md, per-IDE rules files, and an `ai-config` schematic that writes CLAUDE.md/AGENTS.md/GEMINI.md plus MCP config.

### Cited Findings
**Tools, current (angular.dev, v22)**: `ai_tutor`, `devserver.start`, `devserver.stop`, `devserver.wait_for_build`, `get_best_practices`, `list_projects` (reads `angular.json`), `onpush_zoneless_migration`, `run_target` (runs any configured target: build, test, lint, e2e, deploy), `search_documentation` (searches angular.dev). Flags: `--read-only`, `--local-only` — [angular.dev/ai/mcp](https://angular.dev/ai/mcp)

**Tools, v21 docs**: default `ai_tutor`, `find_examples` (curated database of official examples), `get_best_practices`, `list_projects`, `onpush_zoneless_migration`, `search_documentation`; experimental `build`, `devserver.*`, `e2e`, `modernize` (runs code migrations), `test`. Experimental tools enabled with `-E/--experimental-tool` (e.g. `-E devserver`) — [v21.angular.dev/ai/mcp](https://v21.angular.dev/ai/mcp)
- Config: `{"mcpServers":{"angular-cli":{"command":"npx","args":["-y","@angular/cli","mcp"]}}}`; VS Code uses `servers` key — [v21.angular.dev/ai/mcp](https://v21.angular.dev/ai/mcp)

**Change history (angular-cli repo, `packages/angular/cli/src/commands/mcp/tools`)** — [GitHub commits](https://github.com/angular/angular-cli/commits/main/packages/angular/cli/src/commands/mcp/tools)
- 2026-04-29: "remove find_examples tool and associated database rule"
- 2026-04-30: "remove modernize tool and add instructions for schematic discovery" (i.e., agent is told to discover and run schematics/migrations itself instead of a bespoke tool)
- 2026-05-20: experimental unified `run_target` facade; 2026-05-21: removed granular build/test/e2e tools
- 2026-07-23/28: devserver tool renames to meet MCP name regex; marked start/stop non-read-only
- 2026-08-04: `--root` option added; migrated to `@modelcontextprotocol/server` v2; 2026-08-13: workspace access restrictions/path validation
- Current tool source folder contains: `devserver/`, `onpush-zoneless-migration/`, `run-target/`, `ai-tutor.ts`, `best-practices.ts`, `doc-search.ts`, `projects.ts`, `tool-registry.ts` — [GitHub tree](https://github.com/angular/angular-cli/tree/main/packages/angular/cli/src/commands/mcp/tools)

**angular.dev AI guidance** — [angular.dev/ai/develop-with-ai](https://angular.dev/ai/develop-with-ai)
- `/llms.txt` (index) and `/assets/context/llms-full.txt` (compiled full docs)
- `/assets/context/best-practices.md` (TS/Angular conventions, a11y, components, state, templates)
- Per-tool rules files: `GEMINI.md`, `guidelines.md` (Copilot / Windsurf), `angular-20.mdc` (Cursor), `AGENTS.md` (JetBrains)

**`ai-config` schematic** (`@schematics/angular:ai-config`, used by `ng new --ai-config`): `tool` is an array; values `none` (default), `claude-code` (`CLAUDE.md` + MCP config), `cursor` (`AGENTS.md` + MCP), `gemini-cli` (`GEMINI.md` + MCP), `open-ai-codex` (`AGENTS.md` + MCP), `vscode` (`AGENTS.md` + MCP) — [angular-cli ai-config schema.json](https://raw.githubusercontent.com/angular/angular-cli/main/packages/schematics/angular/ai-config/schema.json)

### Inferences
- Angular's own direction (removing `modernize` in favor of "instructions for schematic discovery") signals that migrations should live as schematics, with AI agents taught to invoke them — favouring @cdx/* ng-update migrations + a skill that tells agents to run `ng update`/`ng g @cdx/...` rather than a bespoke migrate MCP tool.
- The `ai-config` schematic is a precedent for a Helix `ng add` step that writes/merges design-system sections into CLAUDE.md/AGENTS.md and registers an MCP server; a Helix ai-config should cooperate (append, not overwrite) with Angular's generated files.
- Tool churn (~5 removals in 2026) shows MCP tool surfaces are unstable; keep Helix knowledge in versioned skills/docs and keep MCP minimal.

### Gaps
- No official Angular blog post with release dates for each tool found in this session; dates above come from commit history.
- Exact text of Angular's "schematic discovery" instructions not retrieved.

## 3. Nx: generators, `nx migrate`, AI agent setup (configure-ai-agents / setup-ai-agents), Nx MCP, Nx Console

### Takeaway
Nx moved (Feb 2026) from a large MCP tool surface to "skills + lean MCP": `npx nx configure-ai-agents` writes AGENTS.md/CLAUDE.md, MCP config and agent skills for six agents; the Nx MCP server now defaults to a `--minimal` set focused on docs, running-task output and Nx Cloud CI, with workspace/generator tools hidden behind `--no-minimal`.

### Cited Findings
- `npx nx configure-ai-agents` (interactive) supports `claude`, `codex`, `copilot`, `cursor`, `gemini`, `opencode`; creates agent config files (`AGENTS.md`, `CLAUDE.md`, equivalents), MCP server config, and agent skills (installed via plugin for Claude Code, copied into the workspace for others) — [nx.dev AI setup](https://nx.dev/docs/getting-started/ai-setup)
- Skills-only alternative: `npx skills add nrwl/nx-ai-agents-config`; skills also published at `https://nx.dev/.well-known/agent-skills/index.json` for HTTP discovery — [nx.dev AI setup](https://nx.dev/docs/getting-started/ai-setup)
- Blog "Nx AI agent skills" (Juri Strumpflohner, 2026-02-12): skills `nx-workspace`, `monitor-ci`, `nx-generate`, `nx-run-tasks` (+ `nx-plugins`), `link-workspace-packages`; "The Nx MCP server is now lean and focused on what MCP is actually for: connecting to remote services like Nx Cloud..."; all configs derive from a single source-of-truth repo — [nx.dev blog](https://nx.dev/blog/nx-ai-agent-skills)
- Nx MCP (`npx nx mcp`, Nx >= 21.4; `claude mcp add nx-mcp npx nx mcp`): default tools `nx_docs`, `nx_current_running_tasks_details`, `nx_current_running_task_output`, `nx_visualize_graph` (needs Nx Console), `ci_information`, `ci_task_output`, `update_self_healing_fix`; hidden unless `--no-minimal`: `nx_workspace`, `nx_workspace_path`, `nx_project_details`, `nx_available_plugins`, `nx_generators`, `nx_generator_schema`. Flags: `--minimal` (default), `--no-minimal`, `--tools` (globs, e.g. `"ci_*"`, `"!nx_docs"`), `--transport stdio|sse|http`, `--port` (default 9921) — [nx.dev Nx MCP reference](https://nx.dev/docs/reference/nx-mcp)
- `nx migrate` creates a `migrations.json` of only the migrations relevant to the update, then runs them; plugins wire their migrations via an `nx-migrations` field in package.json — [Nx docs (GitHub source)](https://github.com/nrwl/nx/blob/master/docs/shared/features/automate-updating-dependencies.md); [nx.dev/nx/migrate](https://nx.dev/nx/migrate)
- Third-party example of authoring Nx migration generators for a plugin (AWS Nx plugin) — [awslabs nx-plugin-for-aws: Nx Migration Generator](https://awslabs.github.io/nx-plugin-for-aws/en/guides/nx-migration/)

### Inferences
- The older `nx g @nx/js:setup-ai-agents` generator name appears superseded by the `nx configure-ai-agents` command in current docs (not confirmed with a deprecation note).
- Nx's generator tools being hidden by default implies Nx expects agents to learn generator usage from skills and call the CLI directly — reinforcing "CLI + skill" over "MCP tool per action" for Helix.
- From general Nx knowledge (not re-verified this session): `nx migrate` also honours Angular `ng-update` migrations, so a schematics-based @cdx package works for both Angular CLI and Nx users.

### Gaps
- Exact `migrations.json` schema (`generators`, `packageJsonUpdates`, `requires`) and flags (`--run-migrations`, `--create-commits`, `--interactive`) not fetched (Nx doc URL 404'd).
- Nx Console Migrate UI and generator UI not researched.
- No confirmation of when `setup-ai-agents` was renamed or removed.

## 4. Agent-friendliness (--dry-run, --json, non-interactive, --defaults)

### Takeaway
The friendliest tools offer machine-readable output and no-prompt modes: Spartan's `info --json`, Kendo CLI `--force`, Nx MCP `--tools` filtering, Angular MCP `--read-only/--local-only`. `ng update` has `--create-commits` and `--name` but no documented `--dry-run`.

### Cited Findings
- Spartan `info` generator emits a read-only project summary with `--json`, explicitly consumed by the Spartan agent skill (`@spartan-ng/cli:info --json`) — [spartan.ng CLI](https://www.spartan.ng/documentation/cli); [spartan.ng skills](https://www.spartan.ng/documentation/skills)
- Spartan skill (`npx skills add spartan-ng/spartan`, `-g` for global) auto-activates when `components.json` exists and teaches when to run `init`, `ui`, `ui-theme`, `healthcheck` — [spartan.ng skills](https://www.spartan.ng/documentation/skills)
- Spartan MCP (`npx -y @spartan-ng/mcp`) has 17 tools across components, blocks, docs, health (`spartan_health_check`, `spartan_health_instructions`, `spartan_health_command`), cache — [spartan.ng MCP](https://www.spartan.ng/documentation/mcp)
- Kendo CLI: `--force` runs without prompts; `--no-install`, `--from/--to` — [Telerik](https://www.telerik.com/kendo-angular-ui-develop/components/assisted-migration)
- Angular MCP `--read-only`, `--local-only` — [angular.dev/ai/mcp](https://angular.dev/ai/mcp); `ng update --create-commits`, `--allow-dirty`, `--name` — [angular.dev/cli/update](https://angular.dev/cli/update)
- Nx MCP `--tools` glob filters and `--minimal` — [nx.dev](https://nx.dev/docs/reference/nx-mcp)

### Inferences
- `helix-check` should evolve into a `helix doctor --json` (plus optional `--fix`) mirroring Spartan's `healthcheck` / `info --json` + health MCP tools; skills should call it before acting.
- Schematics should declare all prompts with defaults (`x-prompt` + `default`) so `--defaults` / `--interactive=false` produce deterministic results for agents.

### Gaps
- Spartan healthcheck's specific checks and fix flags not documented on the pages fetched.

## 5. Angular design systems shipping their own CLI, schematics, MCP or AI assets

### Takeaway
Every major Angular UI library now ships at least one AI surface; the sophisticated ones (Spartan, Kendo, PrimeNG) combine CLI/schematics + MCP + skills/plugin. Schematics remain the setup channel (Material, Taiga, NG-ZORRO, Kendo ng add); migrations split between ng-update (Material, Taiga) and standalone codemod CLIs (Kendo).

### Cited Findings
| Library | Setup | Generators | Migrations | AI surfaces |
|---|---|---|---|---|
| Angular Material | `ng add` (two-phase) — [collection.json](https://raw.githubusercontent.com/angular/components/main/src/material/schematics/collection.json) | dashboard, table, navigation, tree, addressForm, m3Theme/theme-color | ng-update per major (v22) — [migration.json](https://raw.githubusercontent.com/angular/components/main/src/material/schematics/migration.json) | via Angular MCP/llms.txt |
| Taiga UI | `ng add` (two-phase) | — | `updateToV5` — [collection.json](https://raw.githubusercontent.com/taiga-family/taiga-ui/main/projects/cdk/schematics/collection.json) | not researched |
| NG-ZORRO | `ng add` with prompts | page/form templates — [docs](https://ng.ant.design/docs/schematics/en) | not researched | `llms-full.txt` — [link](https://ng.ant.design/llms-full.txt) |
| Spartan/ng | `init`, `ui-theme` | `ui` (copy-in) | not researched | `info --json`, skill, 17-tool MCP — [docs](https://www.spartan.ng/documentation/cli) |
| Kendo UI | `ng add` | — | `@progress/kendo-cli migrate` codemods | MCP with AI Upgrade Assistant — [Telerik](https://www.telerik.com/kendo-angular-ui-develop/components/assisted-migration) |
| PrimeNG | not verified | — | MCP migration guides | Official MCP (8 tools: `list`, `search`, `get_component`, `get_guide`, `get_example`, `get_setup`, `validate_usage`, `version`; read-only; Node >= 22), "PrimeNG Plugin" bundling MCP + skills for implementation, setup, theming, migration, troubleshooting; llms.txt — [primeng.dev/mcp](https://primeng.dev/mcp) |

- Note: several search aggregators describe a community "PrimeNG MCP" (hnkatze/PrimeNG_MCP) with different tools (`get_component_doc`, `search_components`, `list_all_components`); this is distinct from the official one — [glama.ai listing](https://glama.ai/mcp/servers/@hnkatze/PrimeNG_MCP/blob/2cbae45247f217cc1f4a741b72a295b18974b71d/README.md)

### Inferences
- PrimeNG's `validate_usage` and `get_setup` tools, and Spartan's health tools, are the closest precedents for Helix's validation goals; a Helix MCP could expose `get_component`, `get_tokens`, `validate_usage`, `doctor` while the CLI/schematics do mutations.
- Packaging MCP + skills as a single "plugin" (PrimeNG, Nx Claude Code plugin) is the emerging distribution unit — relevant to the existing helix-skills repo.

### Gaps
- Clarity, Taiga UI AI assets, PrimeNG schematics, NgRx migrations not verified.
- No dates found for PrimeNG MCP/plugin launch or Spartan MCP launch.
