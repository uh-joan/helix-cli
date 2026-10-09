# Agent-native design-system tooling, adoption measurement, and Stripe

Research date: 2026-10-07. Scope: 2024–2026. Context: inputs for a "Helix CLI" for Clarivate's Angular/Material 3 design system (@cdx/*), alongside the existing helix-skills (`npx skills add uh-joan/helix-skills`), `helix-check` and `@cdx/helix-ai sync`.

## What did Stripe actually launch that people call a design-system/agent CLI, and what made it impactful?

### Takeaway
"Stripe CLI" impact in 2026 refers to two separate things. The public launch is **Stripe Projects** (developer preview March 2026, GA at Stripe Sessions 2026), an agent-first CLI that provisions a whole production stack. It is not a design-system tool. The design-system story is an internal one: Stripe's design org **replaced an MCP server over its Sail design-system docs with a custom CLI** that serves complete page templates and workflows, plus strict machine-readable rules, delivered in phases. Head of Design Katie Dill described it publicly (reported as Sept 10, 2026). For Helix, the second story matters more. Its lesson is that MCP-exposed docs alone gave inconsistent output, while a CLI that hands agents templates and rules step by step did better. Sail itself is not open source.

### Cited Findings
**Stripe Projects (public product)**
- Stripe announced Stripe Projects on March 26–27, 2026: a command-line tool to create and manage production stacks (hosting, databases, identity, analytics, AI) from the terminal. — [projects.dev blog, Mar 26 2026](https://projects.dev/blog/production-ready-dev-stack-from-terminal/); [MEXC news](https://www.mexc.com/news/984570)
- It provisions real services from the terminal. Resources stay in the user's provider accounts, credentials sync safely, and users can upgrade to paid tiers without leaving the CLI. A claim: an agent can provision a production Postgres in 350 ms, with billing through one Stripe layer. — [byteiota](https://byteiota.com/stripe-projects-ga-ai-agents-provision-dev-stack/) (secondary)
- It went GA at Stripe Sessions 2026 with 14 new providers, for 32 in total (Vercel, Cloudflare, Supabase, Neon, Clerk, PostHog, Render, Twilio, Sentry, WorkOS, PlanetScale, Hugging Face, etc.). — [byteiota](https://byteiota.com/stripe-projects-ga-ai-agents-provision-dev-stack/); [projects.dev "How we built Stripe Projects in seven weeks", Apr 30 2026](https://projects.dev/blog/how-we-built-stripe-projects-in-seven-weeks/)
- It went from idea to developer preview in seven weeks. Stripe's framing: the bottleneck is not single API calls but the surrounding work of accounts, auth, usage attribution, billing and credentials. In their words, "if an agent can build an app in minutes, the surrounding stack shouldn't take hours to assemble." — [projects.dev, Apr 30 2026](https://projects.dev/blog/how-we-built-stripe-projects-in-seven-weeks/)
- Third parties already publish a "stripe-projects-cli" skill on skills.sh, which shows the CLI and skills pairing in practice. — [skills.sh](https://www.skills.sh/kernel/just-html/stripe-projects-cli)

**Stripe CLI agent features (2025–2026)**
- `npm install -g @stripe/cli` then `stripe agent setup` detects which coding agents you use and installs Stripe's plugin. The plugin configures the Stripe MCP server, installs Stripe skills and keeps them up to date. — [Stripe docs: Skills for agents](https://docs.stripe.com/skills.md)
- The manual path is `npx skills add https://docs.stripe.com`. Manually installed skills do not auto-update (`npx skills update -y`). Stripe publishes a machine-readable skills index at `https://docs.stripe.com/.well-known/skills/index.json`, which agents can curl if `npx skills` is unavailable. — [Stripe docs](https://docs.stripe.com/skills.md)
- `stripe docs` (CLI v1.43.3+) reads Stripe documentation in the terminal. — [Stripe docs](https://docs.stripe.com/skills.md)
- Plugin vs. skills+MCP: the plugin adds vendor-specific features such as lifecycle hooks that manual skills+MCP setups lack. — [Stripe docs](https://docs.stripe.com/skills.md)
- Stripe Agent Toolkit (`@stripe/agent-toolkit`, Python/TS) exposes the Stripe API as tools and as an MCP server. It supports restricted API keys for least-privilege agent access. — [playbooks.com summary](https://playbooks.com/mcp/stripe-agent-toolkit); [Stripe MCP docs](https://docs.stripe.com/mcp)

**Stripe design system (Sail) and the MCP-to-CLI switch**
- Sail is the design system and component library all Stripe products are built on, used for Stripe products, internal tools and embedded surfaces. — [Chase McCoy portfolio](https://portfolio.chsmc.org/sail)
- Former Sail lead Chase McCoy said in March 2025 that Stripe outsourced the team's work to Europe as a cost-cutting measure about a year earlier. He later worked on design systems at Anthropic. — [X post](https://x.com/chase_mccoy/status/1899853839588610267)
- Katie Dill (Stripe Head of Design), speaking at the Lenny and Friends Summit (reported date Sept 10, 2026), coined "Zombie UI" for generic, brand-less AI-generated interfaces. — [Dr. Web (German, secondary)](https://www.drweb.de/zombie-ui-stripe-design-system-ki/)
- Stripe first connected agents to design docs through an MCP server. In her account, the same prompt from three users produced three different outputs. Stripe then switched to a **custom CLI on top of the design system** that offers complete page templates and workflows (not just components). It delivers docs in phases "at the right moment" to avoid context rot, and encodes strict design rules as machine-readable specs. — [Dr. Web](https://www.drweb.de/zombie-ui-stripe-design-system-ki/)
- Stripe moved quality control after the build, with an editorial role that reviews finished interfaces as users would. The summit opener animation still took 56 iterations. The article also mentions "ProtoDash" (by Owen Williams), which ties Sail components to strict AI rules, via a Designer Fund case study. — [Dr. Web](https://www.drweb.de/zombie-ui-stripe-design-system-ki/)
- Stripe Sessions 2026 product launches were payments-oriented, such as Checkout Studio (a visual checkout builder with an AI assistant and A/B testing). No public Sail or design-system release appeared. — [Department of Product](https://departmentofproduct.substack.com/p/stripe-shows-off-its-new-product)

### Inferences
- The Helix-relevant precedent is "DS CLI that serves templates + rules progressively, replacing a docs-only MCP." Helix already has skills, a checker and a sync command. The Stripe lesson points to adding **page/flow templates** (e.g. `helix template list/get <name> --json`) and **rule-scoped retrieval** (e.g. `helix rules <component>`) rather than dumping all docs.
- Stripe Projects' impact came from removing multi-dashboard friction for agents (one auth, one billing, credentials synced). The DS analogue is one command that sets up tokens, fonts, theme, lint rules and skills for a new Angular app.
- The `stripe agent setup` pattern (detect installed agents, then install plugin + MCP + skills, keep them updated) maps directly onto a possible `helix agent setup`.

### Gaps
- No primary source (video or transcript) for the Katie Dill talk was found; only the Dr. Web secondary article. The date and details should be verified against the Lenny's Podcast episode.
- Stripe Apps UI toolkit CLI (`stripe apps` plugin, `@stripe/ui-extension-sdk`) was not researched in this pass. No 2025–2026 news tied it to agents.
- No evidence Stripe has publicly released its internal design-system CLI or Sail.

## What are the emerging conventions for agent-native CLIs (--json, MCP, skills, non-interactive, idempotency, agent auth)?

### Takeaway
By 2026 the conventions are converging. Make every input a flag, and fall back to prompts only when a TTY is present. Offer `--output json` / `--json`, stable exit codes, `--non-interactive`/`--quiet`, and dry-run previews. Use progressive, per-subcommand discovery, and ship skills (SKILL.md, 50–100 lines, with trigger conditions) installable via `npx skills add`. Add an `agent setup` command that installs MCP + skills per detected agent, publish a `.well-known` skills index, and use least-privilege credentials. For design systems specifically, DESIGN.md (Google, Apr 2026) is emerging as a portable spec with a lint/diff/export CLI. Storybook MCP and shadcn's registry MCP are the code-side norms, but both are React-centric.

### Cited Findings
**General agent-CLI conventions**
- Speakeasy (Feb 5, 2026) recommends `--non-interactive` (use defaults or fail fast), `--quiet`, `--output json`, exit code 0 vs. distinct non-zero failure categories, and removing spinners and tables that waste context tokens. It also recommends focused skills of 50–100 lines with clear trigger conditions, plus an offline `speakeasy agent` subcommand for progressive docs traversal. — [Speakeasy](https://www.speakeasy.com/blog/engineering-agent-friendly-cli)
- Layer5: agents want contracts (structured output, unambiguous status, deterministic behavior, recovery paths) while humans want explanations. Support `--output text` and `--output json`. Every input should be expressible as a flag, with interactive mode only as a fallback. Accept a `--payload` raw JSON input. — [Layer5](https://layer5.io/blog/ai/design-for-the-human-enable-the-agent)
- Agent CLIs need JSON on stdout, stable exit codes, schema introspection, dry-run previews and generated skills/docs. Each subcommand should own its own documentation so unused commands stay out of context. — [Daniel Vaughan, Apr 28 2026](https://codex.danielvaughan.com/2026/04/28/building-agent-friendly-clis-codex-cli-composable-tool-design/); [skills.sh cli-for-agents](https://www.skills.sh/poteto/plugins/cli-for-agents)
- CLI vs MCP debate: an existing CLI with docs and structured output is usable by agents without a new protocol layer. — [xpander.ai](https://xpander.ai/resources/mcp-vs-cli-for-ai-agents)

**Skills distribution**
- Vercel open-sourced the `skills` CLI (vercel-labs/skills) in Jan 2026. It installs skills from GitHub, GitLab, git URLs or local folders into whichever agents you run (18+ agents including Claude Code, Copilot, Cursor and Cline). Install a single skill with `npx skills add <owner/repo> --skill <name>`. — [Vercel changelog](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem); [Vercel docs](https://vercel.com/docs/agent-resources/skills); [Vaughan, May 31 2026](https://codex.danielvaughan.com/2026/05/31/codex-cli-vercel-skills-cli-npx-skills-open-agent-skills-ecosystem/)
- skills.sh is a directory and leaderboard with install stats. As of May 2026 the top skills were find-skills (~1.8M installs), frontend-design (~484K) and vercel-react-best-practices (~441K). — [Vaughan / Vercel sources](https://codex.danielvaughan.com/2026/05/31/codex-cli-vercel-skills-cli-npx-skills-open-agent-skills-ecosystem/)
- Vercel later added "skill packs" that bundle skills into shareable collections. — [createwith](https://www.createwith.com/tool/vercel/updates/vercel-skill-packs-bundle-agent-capabilities-into-shareable-collections)
- Stripe adopted the Agent Skills standard (agentskills.io) and serves skills from its docs domain. — [Stripe docs](https://docs.stripe.com/skills.md)

**DESIGN.md (Google Stitch / Google Labs)**
- Google Labs published the draft DESIGN.md spec as open source (Apache-2.0, alpha) on April 21, 2026. — [the-decoder](https://the-decoder.com/googles-open-source-design-md-gives-ai-agents-a-prompt-ready-blueprint-for-brand-consistent-design/); [pasqualepillitteri.it](https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026)
- Format: YAML front matter for tokens (colors, typography, spacing, rounded, components) and a Markdown body with canonical sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts). "Tokens give agents exact values. Prose tells them why." — [GitHub google-labs-code/design.md](https://github.com/google-labs-code/design.md)
- CLI: `lint` (11 rules, including broken references, contrast ratios, orphaned tokens and section order), `diff` (token-level changes and regression detection), `export` (Tailwind v3/v4, W3C DTCG) and `spec` (prints the spec for agent prompts). The repo had about 28.3k stars at fetch time. — [GitHub](https://github.com/google-labs-code/design.md)

**Design-system MCP servers**
- Storybook shipped an official MCP server in Storybook 10.3 (Mar 23, 2026). It has Docs (component manifests plus usage guidelines), Development (story authoring/preview) and Testing toolsets. In preview it supports **React only**. — [Storybook docs](https://storybook.js.org/docs/ai/mcp/overview); [Vaughan, Apr 26 2026](https://codex.danielvaughan.com/2026/04/26/codex-cli-storybook-mcp-component-development-story-generation-visual-testing/)
- Figma, Storybook, zeroheight, Knapsack and Supernova all ship design-system MCP servers. — [Supernova blog](https://www.supernova.io/blog/design-system-mcp-servers)
- shadcn added MCP support (Apr 2025). `npx shadcn registry:mcp` makes any shadcn registry MCP-compatible, so agents can init, install tokens/fonts/dependencies, pull components and sync registry updates. — [shadcn changelog](https://ui.shadcn.com/docs/changelog/2025-04-mcp)
- v0 uses the shadcn Registry as "a distribution specification designed to pass context from your design system to AI models." It lets v0 generate prototypes in your design system. — [v0 docs: design systems](https://v0.app/docs/design-systems)

**Claude Design**
- Anthropic Labs launched Claude Design on April 17, 2026 (research preview, Opus 4.7). During onboarding it reads a codebase and design files to assemble a team design system (colors, typography, components). Figma shares fell about 7% on the news. — [pulse2](https://pulse2.com/anthropic-claude-design-launches-as-ai-powered-visual-creation-and-prototyping-platform/); [letsdatascience](https://letsdatascience.com/news/anthropic-releases-claude-design-powered-by-opus-47-b909d215)

### Inferences
- Helix should support both MCP and a CLI and treat the CLI + skills as primary. Stripe's experience, Speakeasy's guidance and the `stripe agent setup` pattern all point that way. An MCP server can be a thin wrapper over the same `--json` commands.
- Exporting a **DESIGN.md** from @cdx tokens (e.g. `helix export design-md`) would make Helix readable by Stitch, Claude Design and other DESIGN.md consumers at low cost. Running Google's `lint` on it in CI gives free contrast checks.
- Storybook MCP and shadcn registries are React-centric, which leaves a real gap for Angular/Material 3. A Helix "registry" (component manifest JSON with selector, inputs/outputs, tokens, examples, do/don't) is a differentiator.
- Publishing a `.well-known/skills/index.json` on the Helix docs site mirrors Stripe and lets agents without `npx skills` fetch skills.

### Gaps
- designmd.co and getdesign.md (DESIGN.md directories) were not verified in this pass. Builder.io, Locofy and Cursor rules marketplaces were also not researched. Idempotency and agent-auth (OAuth device flow for agents) conventions lack a strong primary source here beyond Stripe's restricted keys.

## How do teams measure design-system adoption, and which tools automate it? (Omlet metrics specifically)

### Takeaway
Most teams measure static import/usage counts: DS component instances vs. local/custom components, prop usage, and trends per team or project. Omlet (by Zeplin) is the main SaaS for this, but its scanner is React/React Native only (Angular and Vue were listed as "coming soon"). react-scanner is the open-source equivalent, also React only. Alternatives include rendered "visual coverage" (pixels covered by DS components) and proxy metrics such as CSS growth rate. **No mature Angular-native adoption scanner was found**, which is a clear opening for a `helix adoption`/`helix scan --json` command.

### Cited Findings
- Omlet scans the codebase via CLI (`npx omlet init`, `npx omlet analyze`; @omlet/cli v1.13.x). It detects components and their usage and charts adoption across projects over time, with filters by project, tag and name. — [npm @omlet/cli](https://www.npmjs.com/package/@omlet/cli); [Omlet 1.0 launch](https://blog.zeplin.io/meet-omlet-component-analytics-for-developers)
- Omlet features: component catalog, dependency tree, props tracking, tags, custom charts/dashboards and sharing, chart-data download, monorepo support, CI "regular scans", and custom component properties via CLI hooks. — [Omlet docs README](https://github.com/zeplin/omlet/blob/main/docs/README.md)
- Omlet supports React and React Native, "Angular, Vue.js coming soon." No evidence of shipped Angular support was found. — [Omlet listing via search](https://cur.at/6lyPe3b?m=web); [npm](https://www.npmjs.com/package/@omlet/cli)
- Optimizely's Harmony DS team uses Omlet to answer which components are used over time and by which teams/products. — [Zeplin blog](https://blog.zeplin.io/optimizely-harmony-session-2023)
- react-scanner statically extracts React component and prop usage into JSON. Processors: `count-components`, `count-components-and-props` (default) and `raw-report` (file/line/column). Config includes `crawlFrom`, `exclude`, `globs`, `components`, `importedFrom` (filter by DS package) and `getPropValue`. It detects props spread. JSX only. — [GitHub moroshko/react-scanner](https://github.com/moroshko/react-scanner)
- Common KPIs: count CSS classes, component names or imports in app code over time. Month-over-month CSS file-size growth serves as a coverage proxy (lower means the DS covers more). — [CB Insights team blog](https://www.cbinsights.com/research/team-blog/design-system-success)
- "Visual Coverage": a browser-based algorithm computes how much of a rendered page is built with DS components by pixels, rather than DOM nodes or code scans. — [guild.host "Measuring design systems"](https://www.guild.host/presentations/measuring-design-systems-s7985q)
- Challenges: unclear definitions of what counts as a component, and coverage across an experience is hard to measure. — [guild.host "Measuring the unmeasurable"](https://guild.host/presentations/measuring-the-unmeasurable-jucx6n); [Into Design Systems](https://intodesignsystems.substack.com/p/measuring-design-system-impact-lessons)
- Supernova's "9 design system metrics that matter" covers adoption, and Supernova exposes token usage among its tools. — [Supernova](https://www.supernova.io/blog/9-design-system-metrics-that-matter)
- Figma provides library analytics for the design side. Community requests ask for more meaningful usage analytics (e.g. detachment). — [Figma best practices](https://www.figma.com/best-practices/make-the-most-of-design-system-analytics/); [Figma forum](https://forum.figma.com/t/more-meaningful-library-usage-analytics/59086)
- GitHub Primer has run public "Inspect & Reflect" sessions evaluating adoption, but no published Primer metric definitions were found in this pass. — [Figma DesignOps event](https://friends.figma.com/events/details/figma-designops-presents-inspect-amp-reflect-githubs-primer-design-system/)

### Inferences
- A Helix adoption scanner for Angular could parse templates for `cdx-*`/`mat-*` selectors vs. raw HTML/custom components, and TS imports from `@cdx/*`. It could count `::ng-deep`/`!important` overrides and hard-coded colors vs. token usage, then emit react-scanner-style JSON (`count`, `count-with-inputs`, `raw` with file:line). That covers coverage %, custom-vs-DS ratio and override counts, and works in CI and for agents.
- The same scan output could feed `helix-check` and give agents a "fix list" for migrations.

### Gaps
- Omlet's exact named metrics (e.g. whether it has an explicit "adoption %" formula or "detached/forked component" detection) were not confirmed from primary docs pages.
- Radius (Rangle), Backlight (status and possible shutdown), zeroheight analytics specifics and Atlassian/Shopify internal metric definitions were not verified in this pass.

## Codemod platforms usable for DS migrations

### Takeaway
Codemod.com is the active platform. It offers an open-source CLI, a public registry (`npx codemod publish/search`) and a workflow engine for local/CI runs, plus enterprise Studio, Campaigns, Insights and private registries. Hypermod (formerly CodeshiftCommunity) is a community registry and CLI for library maintainers to ship versioned codemods. Grit.io was acquired by Honeycomb (Apr 2025) and its standalone product sunset, but GritQL remains open source. None of these is Angular-template-specific.

### Cited Findings
- Codemod is an "AI-powered, community-led platform for automating code migrations." It has an open-source toolkit (free CLI, public registry) plus enterprise Studio, Campaigns, Insights and private registries. — [Codemod docs](https://docsearch.algolia.com/mcp/docs/repo/codemod/codemod); [GitHub codemod/codemod](https://github.com/codemod/codemod)
- The registry supports `npx codemod publish` / `npx codemod search`. The CLI and workflow engine scaffold, test and run codemods locally or in CI. Design-system and UI-library migrations (e.g. Radix, Tailwind) are named use cases. — [Codemod docs](https://docsearch.algolia.com/mcp/docs/repo/codemod/codemod)
- Hypermod Community (formerly CodeshiftCommunity) is a community-owned registry and docs hub that helps library maintainers write, test, publish and consume codemods. `@hypermod/cli` downloads and runs codemods and scaffolds codemod packages. — [GitHub hypermod-community](https://github.com/hypermod-io/hypermod-community); [npm @hypermod/cli](https://npmjs.com/package/@hypermod/cli); [dev.to](https://dev.to/danieldelcore/a-new-way-to-ship-codemods-4h11)
- Honeycomb acquired Grit (announced Apr 10, 2025), sunset the standalone product, and kept GritQL open source. GritQL does declarative search/transform, custom lint rules and autofixes across JS/TS/Python/Go. — [Honeycomb blog](https://www.honeycomb.io/blog/honeycomb-acquires-grit)

### Inferences
- For @cdx migrations, the practical route is publishing Helix codemods to the Codemod registry, or shipping them as `helix migrate <from>@<to> --dry-run --json`. Angular's own `ng update` schematics are the native distribution channel for Angular libraries. Pairing schematics (for `ng update @cdx/...`) with an agent skill that runs and verifies them fits agent workflows.
- GritQL could provide pattern-based lint and fix rules for TS, but Angular HTML template support should be verified.

### Gaps
- Angular template (HTML) transform support in Codemod.com and Hypermod was not confirmed. Codemod pricing and AI-codemod (Codemod Studio) maturity were not assessed.

## Gaps: what nobody does well yet

### Takeaway
Several areas lack good solutions. There is no framework-agnostic or Angular adoption analytics tool, and the main options (Omlet, react-scanner, Storybook MCP, shadcn registry, v0) are React-only. MCP-exposed docs do not enforce brand intent (Stripe's finding). Measurement and enforcement are not closed into one loop that agents can run (scan → violations JSON → codemod/fix → re-scan). Design-side detach/override analytics are weak.

### Cited Findings
- Storybook MCP is React-only in preview. — [Storybook docs](https://storybook.js.org/docs/ai/mcp/overview)
- Omlet is React/React Native only, with Angular "coming soon." — [npm @omlet/cli](https://www.npmjs.com/package/@omlet/cli); [cur.at](https://cur.at/6lyPe3b?m=web)
- Stripe found MCP-over-docs produced inconsistent outputs and moved to templates, rules and phased context via a CLI. — [Dr. Web](https://www.drweb.de/zombie-ui-stripe-design-system-ki/)
- Practitioners report adoption definitions and coverage are hard to measure consistently. — [guild.host](https://guild.host/presentations/measuring-the-unmeasurable-jucx6n)
- Figma users ask for more meaningful library usage analytics. — [Figma forum](https://forum.figma.com/t/more-meaningful-library-usage-analytics/59086)

### Inferences
- Opportunities for Helix CLI:
  1. `helix scan --json`: Angular adoption metrics (DS coverage %, custom-vs-DS ratio, override counts, token-vs-hardcoded values).
  2. `helix template`/`helix rules`: Stripe-style templates and phased rules.
  3. `helix agent setup`: install skills + MCP per agent, auto-update.
  4. `helix migrate`: ng update schematics or codemods with `--dry-run --json`.
  5. `helix export design-md`: DESIGN.md interop.
  6. A component manifest/registry JSON for Angular, since Storybook manifests and shadcn are React-only.
- Making every command idempotent and deterministic with stable exit codes lets `helix-check` serve as the agent's verification loop.

### Gaps
- Agent-auth patterns for private registries (e.g. scoped npm tokens for @cdx in agent sandboxes) were not researched.
