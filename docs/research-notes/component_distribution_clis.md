# Component-distribution and styling CLIs used by design systems (state as of Oct 2026)

## Q1. What do the CLIs do (commands, flags) and how are they distributed?

### Takeaway
shadcn is now a full "design-system distribution platform" CLI (v4.x, Mar 2026+) with init/create/add/view/search/list/docs/info/build/apply/preset/migrate/eject/registry validate/mcp, many with --json, --yes, --silent, --dry-run. The Chakra-family CLIs are narrower (Chakra: typegen/snippet/blocks/eject; Panda: codegen/cssgen/analyze/doctor/lib/buildinfo with a shared `--json`), Tailwind's CLI is a pure CSS compiler, and Radix Themes / Geist ship as npm packages with no "add component" CLI.

### Cited Findings

**shadcn CLI (npm `shadcn`, latest 4.21.3 on 2026-10-07)** — [npm registry](https://registry.npmjs.org/shadcn/latest)
- `init` / `create` (alias): flags `--template` (next, vite, start, react-router, laravel, astro), `--base` (base, radix, aria), `--preset [name]`, `--yes` (default true), `--defaults`, `--force`, `--cwd`, `--name`, `--silent`, `--css-variables`, `--monorepo`, `--rtl`, `--pointer`, `--reinstall` — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `add`: `--yes`, `--overwrite`, `--cwd`, `--all`, `--path`, `--silent`, `--dry-run`, `--diff [path]`, `--view [path]` (diff is now a flag on add, enabling preview before writing) — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `view` (preview registry items before install), `search` / `list` (`--query`, `--limit` default 100, `--offset`) — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `apply` (apply preset to existing project; `--preset`, `--only [theme|font]`, `--yes`, `--silent`); `preset decode <code> [--json] | resolve | info | url | open` — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `build [registry.json] --output ./public/r` generates per-item registry JSON from a `registry.json` — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `docs [component] --base --json` fetches component documentation; `info --json` reports project information — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `migrate` codemods: `cn`, `icons`, `base-color`, `radix`, `rtl`; flags `--list`, `--yes`, `--from`, `--to`, `[path|glob]` — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `eject` inlines shadcn/tailwind.css (`--yes`, `--silent`) — [shadcn CLI docs](https://ui.shadcn.com/docs/cli)
- `registry validate <registry>` checks registry.json, resolves `include`s, verifies referenced files exist — [shadcn GitHub registries docs](https://ui.shadcn.com/docs/registry/github)
- `mcp init --client claude|cursor|vscode|codex` writes MCP config (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`, `~/.codex/config.toml`) — [shadcn MCP docs](https://ui.shadcn.com/docs/mcp)

**shadcn timeline (dated)** — all from [shadcn changelog](https://ui.shadcn.com/docs/changelog):
- Aug 2024 `npx shadcn init` (package renamed from shadcn-ui); Dec 2024 monorepo support; Feb 2025 Tailwind v4 + registry schema update; Apr 2025 MCP support; Aug 2025 CLI 3.0 + MCP server; Oct 2025 Registry Directory; Dec 2025 `npx shadcn create`; Jan 2026 RTL, Base UI docs; Feb 2026 unified `radix-ui` package; Mar 2026 CLI v4; Apr 2026 `shadcn preset`, `shadcn apply`, partial preset apply; May 2026 `shadcn eject`, registry include & validate, package imports & target aliases; Jun 2026 GitHub (public repo) registries; Jul 2026 dynamic (server-side) search for registries, Base UI becomes default, React Aria support; Aug 2026 private GitHub registries; Sep 2026 components import `cn` from a `cn` npm package.
- CLI 3.0 (Aug 2025) added namespaced registries (`@registry/name`), private-registry auth, `view`/`search`/`list`, "Up to 3x faster dependency resolution", and error messages aimed at "users and AI agents" (missing env vars, expired credentials); "no breaking changes" — [CLI 3.0 changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp)

**Chakra UI CLI (`@chakra-ui/cli`)**
- `chakra typegen <theme> [--watch --strict]` generates theme/recipe typings; `chakra snippet add|list [--all --outdir]` copies composition snippets (copy-code model for wrappers); `chakra blocks add|list [--variant --outdir --force --dry-run --tsx --category]` installs Chakra UI Pro blocks, gated by `CHAKRA_UI_PRO_API_KEY`; `chakra eject --outdir` dumps default tokens/recipes; requires Node >= 20.6.0 — [Chakra CLI docs](https://chakra-ui.com/docs/get-started/cli)

**Panda CSS CLI (`@pandacss/dev`)**
- `panda init | dev | build | check | codegen | cssgen | analyze | doctor | debug | lib | buildinfo`; `lib` = "Publish design systems for shared consumption"; `buildinfo` writes a portable build-info JSON artifact — [Panda CLI reference](https://panda-css.com/docs/references/cli)
- Shared flags on all commands: `--json`, `--config/-c`, `--log-level (silent|error|warn|info|debug)`, `--profile`; `analyze --unused --scope tokens|recipes|utilities`; `cssgen --minimal` / `--splitting` — [Panda CLI reference](https://panda-css.com/docs/references/cli)

**Tailwind CSS CLI (`@tailwindcss/cli`, v4)**
- Pure build tool: `-i/--input`, `-o/--output` (default stdout), `-w/--watch [always]`, `--poll`, `-m/--minify`, `--optimize`, `--cwd`, `--map`, `--silent`. No component/add commands — [Tailwind CLI source](https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/@tailwindcss-cli/src/commands/build/index.ts)
- Also distributed as a standalone executable without Node — [Tailwind CLI docs](https://tailwindcss.com/docs/installation/tailwind-cli)

**v0 / Vercel registry ecosystem**
- Vercel's Registry Starter (Next.js + shadcn registry) exposes "Open in v0" buttons that send v0 a prompt plus a URL to the registry's `/r/${component_name}.json`; Vercel frames a registry as "a distribution specification designed to pass context from your design system to AI Models" — [Vercel Registry Starter template](https://vercel.com/templates/next.js/shadcn-ui-registry-starter)
- v0's own design-system docs (v0.app/docs/design-systems and a "design-systems-legacy" page) returned HTTP 403 to fetch; existence of a legacy vs. new page suggests the integration was reworked — [v0 design systems](https://v0.app/docs/design-systems), [legacy](https://v0.app/docs/design-systems-legacy)

**Vercel Geist**
- Geist provides colors, typography, materials, layout and React components; per search snippet of vercel.com/geist, components are published as `@vercel/geistcn` and assets as `@vercel/geistcn-assets` (name suggests shadcn-style; not independently verified) — [Vercel Geist](https://vercel.com/geist)
- Community port: 87 Geist components on 21st.dev installable via shadcn CLI or MCP — [21st.dev Geist](https://21st.dev/community/shugar/library/geist)

**Radix Themes / Ark UI / Park UI**
- Radix Themes is distributed as an npm package (`@radix-ui/themes`, ~1.16M weekly downloads); no component CLI found — [npm API](https://api.npmjs.org/downloads/point/last-week/@radix-ui/themes)
- Park UI = "components built with Ark UI and Panda CSS that work with a variety of JS frameworks" — [Park UI README](https://raw.githubusercontent.com/chakra-ui/park-ui/main/README.md); `@park-ui/cli` ~4k weekly downloads and repo last pushed 2026-04-10 (low activity) — [npm API](https://api.npmjs.org/downloads/point/last-week/@park-ui/cli), [GitHub API](https://api.github.com/repos/chakra-ui/park-ui)

### Inferences
- shadcn's CLI surface is the de facto reference design for an "add component" CLI: init → add (with dry-run/diff/view) → search/list/view/docs → info → build/validate (author side) → migrate (codemods) → mcp init.
- Panda's model (config-driven codegen + `analyze` + `lib` + `--json` on every command) is closer to what an npm-package design system like Helix (@cdx/*) needs than copy-paste, since Helix ships packages rather than source.
- The `migrate` codemod family in shadcn maps naturally to a Helix need (e.g. Material 2→3, @cdx version upgrades).

### Gaps
- Park UI CLI docs (park-ui.com/docs/cli) returned 404; its current command set and whether it has moved to the shadcn registry format was not confirmed.
- Radix Themes and Ark UI: no evidence of a dedicated CLI; not deeply researched.
- Exact `diff` standalone command status: docs show `--diff` as an `add` flag; the shadcn skill page still lists `diff` as a command — [shadcn skills](https://ui.shadcn.com/docs/skills). Unclear whether standalone `diff` is deprecated.

## Q2. shadcn registry model, "own the code", build, MCP server, rules/AGENTS.md items

### Takeaway
shadcn's registry is a JSON spec (registry.json + per-item registry-item.json) served from any URL, GitHub repo, or private endpoint with header/token auth, addressed by namespaces (`@acme/item`). Items can be anything from a UI component to a full design system (`registry:base`), theme, font, or arbitrary file (`registry:file`, `registry:item`) — which is how teams ship rules/conventions/config. The MCP server exposes 7 read-only/discovery tools; installation still goes through the CLI.

### Cited Findings
- Item types: `registry:base` (entire design systems), `block`, `component`, `font`, `lib`, `hook`, `ui`, `page`, `file`, `style`, `theme` — [registry-item.json docs](https://ui.shadcn.com/docs/registry/registry-item-json)
- Item fields: `name`, `type`, `title`, `description`, `dependencies`, `devDependencies`, `registryDependencies` (GitHub, namespaced, URL refs), `files[{path,type,target}]` with target placeholders `@components/ @ui/ @lib/ @hooks/`, `cssVars` (theme/light/dark), `css` (@layer/@keyframes/@utility), `envVars`, `docs` (install guidance), `categories`, `meta`, `font`; `tailwind` deprecated — [registry-item.json docs](https://ui.shadcn.com/docs/registry/registry-item-json)
- Namespaced registries in `components.json` `registries` map: `"@private": {"url": "https://registry.company.com/{name}.json", "headers": {"Authorization": "Bearer ${REGISTRY_TOKEN}"}}`; also custom headers (`X-API-Key`), `params` query tokens; env vars expanded from `.env.local`; guidance: HTTPS only, rotate tokens, 401 vs 403 semantics, rate limiting, audit logs — [shadcn registry authentication](https://ui.shadcn.com/docs/registry/authentication)
- CLI 3.0 auth methods: "basic auth, bearer token, API key query params and custom headers" — [CLI 3.0 changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp)
- GitHub registries: `shadcn add <owner>/<repo>/<item>` with `registry.json` at repo root; private repos via `gh auth login` or `GH_TOKEN`/`GITHUB_TOKEN` (fine-grained PAT, Contents: read-only recommended); `#ref` pinning to tag/branch/SHA; `include` property to split registry.json; docs example item `acme/toolkit/project-conventions` — [shadcn GitHub registries](https://ui.shadcn.com/docs/registry/github)
- Dynamic search (Jul 2026): registries can handle server-side search via query parameters for large catalogs — [shadcn changelog](https://ui.shadcn.com/docs/changelog)
- Registry Directory (Oct 2025) lists community registries maintained by third parties, with an "Add a Registry" submission process — [shadcn directory](https://ui.shadcn.com/docs/directory)
- MCP server tools (from source): `get_project_registries`, `list_items_in_registries` (registries, types, limit, offset), `search_items_in_registries` (fuzzy; query, types, limit, offset), `view_items_in_registries` (items incl. file contents), `get_item_examples_from_registries` (demos with full code), `get_add_command_for_items` (returns CLI command; agent runs it), `get_audit_checklist` ("Quick checklist to verify components work after creation or code generation") — [shadcn MCP source](https://raw.githubusercontent.com/shadcn-ui/ui/main/packages/shadcn/src/mcp/index.ts)
- MCP "Works with all registries. Zero config", multiple registries per project — [CLI 3.0 changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp); example prompts include "Install @internal/auth-form" — [shadcn MCP docs](https://ui.shadcn.com/docs/mcp)
- Official shadcn Agent Skill: `pnpm dlx skills add shadcn/ui`; reads `components.json` for project context (framework, Tailwind version, aliases, base library, icon library, installed components), CLI reference, theming (OKLCH, dark mode, v3/v4), registry authoring; plus `llms.txt` — [shadcn skills docs](https://ui.shadcn.com/docs/skills)

### Inferences
- Pattern for Helix: Skill (knowledge, how-to) + MCP (discovery/view/examples) + CLI (the only thing that mutates files), with MCP returning the CLI command (`get_add_command_for_items`) rather than writing files itself. The `get_audit_checklist` tool is a cheap but notable "verify after generation" hook.
- `registry:file`/`registry:item` + GitHub registries let a team ship AGENTS.md, lint config, or "project-conventions" as installable items — a direct analogue for distributing helix-skills content into Angular repos.
- The `components.json` file doubles as machine-readable project context for agents; a `helix.json` equivalent would serve the same purpose.

### Gaps
- No official shadcn doc found that explicitly says "ship AGENTS.md via registry"; the `project-conventions` example and `registry:file` type imply it.
- Number of registries in the directory was not obtainable from the page fetch.

## Q3. Agent-friendliness (--json, non-interactive, MCP, llms.txt, skills)

### Takeaway
By 2026 every major design-system tool except Tailwind ships the trio of MCP server + llms.txt + Agent Skills. shadcn and Panda are the most scriptable (`--json`, `--yes`, `--silent`, `--dry-run`); Tailwind deliberately declined llms.txt amid an AI-driven revenue crisis.

### Cited Findings
- shadcn: `--json` on `info`, `docs`, `preset decode`; `--yes` / `--silent` on init/add/apply/eject/migrate; `--dry-run`, `--diff`, `--view` on add — [shadcn CLI docs](https://ui.shadcn.com/docs/cli). Error messages designed to guide "AI agents" — [CLI 3.0 changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp). MCP + Skill + llms.txt — [shadcn MCP](https://ui.shadcn.com/docs/mcp), [shadcn skills](https://ui.shadcn.com/docs/skills)
- Panda: `--json` and `--log-level silent` on all commands — [Panda CLI](https://panda-css.com/docs/references/cli). MCP server `npx -y @pandacss/mcp` with tools `get_tokens`, `get_semantic_tokens`, `get_color_palette`, `get_recipes`, `get_patterns`, `get_conditions`, `get_keyframes`, `get_text_styles`, `get_layer_styles`, `get_animation_styles`, `get_config`, `get_usage_report`; clients Claude, Cursor, VS Code, Windsurf, Codex; also LLMs.txt and Agent Skills pages — [Panda MCP docs](https://panda-css.com/docs/get-started/mcp-server)
- Chakra: MCP `@chakra-ui/react-mcp` (`claude mcp add chakra-ui -- npx -y @chakra-ui/react-mcp`), tools `list_components`, `get_component_props`, `get_component_example`, `list_component_templates`, `get_component_templates` (Pro, `CHAKRA_PRO_API_KEY`), `get_theme`, `theme_customization`, `v2_to_v3_code_review` (migration review tool) — [Chakra MCP docs](https://chakra-ui.com/docs/get-started/ai/mcp-server); also LLMs.txt and AI Skills pages; CLI has `--dry-run` on blocks — [Chakra CLI docs](https://chakra-ui.com/docs/get-started/cli)
- Tailwind: CLI has `--silent` only; PR #2388 (opened 2025-11-18) to add `/llms.txt` to the docs was declined by Adam Wathan in Jan 2026 while disclosing 75% engineering layoffs (2026-01-06), citing AI's "brutal impact"; docs traffic down ~40% over two years and revenue down ~80% — [The New Stack](https://thenewstack.io/tailwind-creator-says-ai-played-a-role-in-downsizing/), [eWeek](https://www.eweek.com/news/tailwind-labs-lays-off-engineers-due-to-ai/), [starryhope (secondary)](https://starryhope.com/linux/tailwind-ai-layoffs-2026)
- Third-party skill marketplaces host many unofficial shadcn skills (skills.sh, tessl, vibeindex) — [skills.sh](https://www.skills.sh/daviddwlee84/agent-skills/shadcn), [tessl](https://tessl.io/registry/skills/github/langbot-app/langbot-new-api/shadcn-ui)

### Inferences
- Common MCP tool taxonomy across vendors: list/search components, get props/API, get examples, get tokens/theme, migration review, usage report. A Helix MCP could mirror: `list_components`, `get_component_api` (inputs/outputs for Angular), `get_examples`, `get_tokens`, `get_usage_report`, `review_migration`, `get_audit_checklist`.
- Agent-friendly CLI baseline: `--json` everywhere (Panda model), non-interactive defaults (`--yes` default true in shadcn init), `--dry-run`/`--diff` previews, `mcp init --client X` installer, and an official Skill installed via `skills add`.
- Tailwind's case is a caution: making a DS agent-consumable shifts value away from docs-site visits — less relevant for an internal enterprise DS where adoption, not traffic, is the goal.

### Gaps
- AGENTS.md *generation* by any of these CLIs was not found; none was confirmed to emit AGENTS.md automatically.
- Chakra MCP launch date not stated in docs.

## Q4. Adoption / measured impact

### Takeaway
shadcn's CLI dominates distribution CLIs (~13.4M weekly npm downloads, ~125k GitHub stars), dwarfing Chakra CLI (~289k) and Park UI CLI (~4k); Tailwind core remains the largest styling dependency (~163M/week).

### Cited Findings (npm week 2026-09-28 → 2026-10-04; GitHub stars on 2026-10-07)
- `shadcn` 13,356,686/wk — [npm API](https://api.npmjs.org/downloads/point/last-week/shadcn); shadcn-ui/ui 125,215 stars — [GitHub API](https://api.github.com/repos/shadcn-ui/ui)
- `tailwindcss` 163,032,225/wk; `@tailwindcss/cli` 3,003,232/wk — [npm API](https://api.npmjs.org/downloads/point/last-week/tailwindcss), [npm API](https://api.npmjs.org/downloads/point/last-week/@tailwindcss/cli); tailwindlabs/tailwindcss 97,786 stars — [GitHub API](https://api.github.com/repos/tailwindlabs/tailwindcss)
- `@chakra-ui/react` 2,006,693/wk; `@chakra-ui/cli` 289,072/wk; chakra-ui 40,676 stars — [npm API](https://api.npmjs.org/downloads/point/last-week/@chakra-ui/cli), [GitHub API](https://api.github.com/repos/chakra-ui/chakra-ui)
- `@pandacss/dev` 565,899/wk; chakra-ui/panda 6,209 stars — [npm API](https://api.npmjs.org/downloads/point/last-week/@pandacss/dev)
- `@ark-ui/react` 1,229,584/wk (5,408 stars); `@park-ui/cli` 3,989/wk (2,369 stars) — [npm API](https://api.npmjs.org/downloads/point/last-week/@ark-ui/react)
- `@radix-ui/themes` 1,156,016/wk; radix-ui/themes 8,747 stars, last push 2026-04-11 — [npm API](https://api.npmjs.org/downloads/point/last-week/@radix-ui/themes)
- Community registries: Registry Directory exists (Oct 2025) — [shadcn directory](https://ui.shadcn.com/docs/directory); 21st.dev hosts registries installable via shadcn CLI/MCP (e.g. 87 Geist components) — [21st.dev](https://21st.dev/community/shugar/library/geist); Vercel's Registry Starter template for "AI-Native Design System" — [Vercel template](https://vercel.com/templates/next.js/shadcn-ui-registry-starter)

### Inferences
- shadcn's npm downloads are inflated by `npx`/`dlx` runs in CI and by AI agents scaffolding projects (v0, etc.), so they measure invocations rather than unique teams.
- Low Park UI CLI activity suggests standalone per-library add-CLIs lose to the shared shadcn registry format.

### Gaps
- No credible public data on number of private/enterprise shadcn registries, or measured productivity impact of MCP/skills on agent output quality.
- No Angular-ecosystem equivalent found in this scope (Angular Material uses `ng add`/`ng generate` schematics — not researched here).

## Q5. Tools that audit/measure design-system usage

### Takeaway
Measurement is built into Panda (`panda analyze`, `get_usage_report` MCP tool) and lightly into shadcn (`get_audit_checklist`); otherwise teams use external scanners (Omlet CLI, react-scanner) — all React-centric.

### Cited Findings
- `panda analyze` — "Report token, recipe, and utility usage across your sources", `--unused` to find configured-but-unreferenced items, `--scope`, `--json` — [Panda CLI](https://panda-css.com/docs/references/cli); MCP `get_usage_report` and example query "Which tokens are unused in my codebase?" — [Panda MCP docs](https://panda-css.com/docs/get-started/mcp-server)
- `panda doctor` validates setup; `panda check` validates generated files without writing (CI-friendly) — [Panda CLI](https://panda-css.com/docs/references/cli)
- shadcn MCP `get_audit_checklist` for post-generation verification — [shadcn MCP source](https://raw.githubusercontent.com/shadcn-ui/ui/main/packages/shadcn/src/mcp/index.ts); `shadcn info --json` reports project state — [shadcn CLI](https://ui.shadcn.com/docs/cli)
- Chakra MCP `v2_to_v3_code_review` reviews code for migration issues — [Chakra MCP](https://chakra-ui.com/docs/get-started/ai/mcp-server)
- Omlet CLI (`@omlet/cli`) scans repos, detects components and their usage/dependencies, uploads to a web app for adoption dashboards (React/React Native) — [npm @omlet/cli](https://www.npmjs.com/package/@omlet/cli), [Optimizely case via Zeplin](https://blog.zeplin.io/optimizely-harmony-session-2023)
- Brevo engineering used react-scanner across cloned repos to record component instances per project for adoption tracking — [Brevo engineering](https://engineering.brevo.com/how-to-track-design-system-adoption/)

### Inferences
- An Angular/Material 3 "helix audit" (count @cdx/* vs raw mat-*/custom components, hard-coded colors vs tokens, with `--json` for CI/dashboards and an MCP `get_usage_report`) would fill a gap — none of the surveyed tools support Angular templates.

### Gaps
- No Angular-native adoption scanner was researched in this scope.
