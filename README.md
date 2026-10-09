# helix-cli

**Status: proposal / pre-build.** Planning folder for a Helix CLI (`@cdx/cli`,
binary `helix`). There is no code yet; it holds the research and the proposal it
came from.

> **In one sentence:** the Helix CLI tells a team or an AI agent how far an Angular
> app is from Helix, fixes the mechanical part, and gives a deterministic pass/fail
> check.

## Why

- **Stripe's lesson.** Giving agents access to design-system docs (Stripe tried an
  MCP server over Sail) produced inconsistent UI: one prompt, three users, three
  outputs. Stripe replaced it with a CLI that serves templates, rules and checks.
- **Where the field has settled (2026).** Skills carry the knowledge, MCP stays thin,
  and a CLI is the only thing that changes or checks files. Angular and Nx both cut
  their MCP surfaces back this year.
- **A gap nobody fills.** No tool measures design-system adoption in **Angular**
  templates. Omlet, react-scanner, Storybook's manifest and shadcn are React-first.
- **Helix has the debt to burn down.** The consumer apps have about 665 hard-coded
  colours and about 690 Material-internal overrides. One app is pinned to @cdx 18.3
  while Helix is on 22, and AI chat UIs have been rebuilt five times.

## Proposed command surface

| Command | Does |
| --- | --- |
| `helix doctor` | Checks environment and setup health (replaces `helix-check`). Supports `--json` and `--fix` |
| `helix scan` | Adoption and debt metrics across templates, TS and SCSS. Output as JSON or SARIF, with a baseline that fails only on regressions |
| `helix fix` | Mechanical autofix, e.g. colour → nearest token with a fallback. Dry run by default |
| `helix verify` | The agent's definition of done: scans changed files and fails on any new violation |
| `helix pattern` / `rules` / `component` | Serves pattern guides, rules and the component manifest step by step, as Stripe does |
| `helix migrate` | Runs `ng update` for each major, scans after every step, and hands what's left to agents |
| `helix agent setup` | Installs skills, AGENTS.md / CLAUDE.md blocks and Copilot instructions (replaces `helix-ai sync`) |
| `helix export design-md` | Generates a DESIGN.md from the @cdx tokens |
| `helix mcp` *(later)* | A thin MCP wrapper over the same `--json` commands |

The contract every command follows:
- Input comes only from flags.
- JSON goes to stdout; logs go to stderr.
- Nothing is written without `--write`.
- Exit codes: `0` pass · `1` violations · `2` usage/config error · `3` environment failure · `4` regression against the baseline.

## Roadmap

| Phase | Scope |
| --- | --- |
| **0: Measure** (first slice, ~4 weeks) | `helix doctor` and `helix scan`. Run read-only on the three consumer apps and commit the baselines |
| 1: Ratchet and fix | Fail CI on regressions; `helix fix color`; `helix verify`; a `helix-adoption` skill |
| 2: Guide the build | `pattern`, `rules`, `component`; `agent setup`; a `.well-known` skills index |
| 3: Move versions | `ng-add` and `ng update` migrations per major; `helix migrate --agent` |
| 4: Extend | `helix mcp`; Figma ↔ token drift checks; DESIGN.md export |

## What already exists (to absorb, not rebuild)

- **`helix-check`**: a bin in `@cdx/ngx-branding`. It checks the Node version, `.npmrc`, package versions against the Helix major, the theme class, `index.html` fonts and branding. It becomes `helix doctor`.
- **`@cdx/helix-ai sync`**: a CLI in `cdx-next/packages/helix-ai` that writes skills, the AGENTS.md block and Copilot instructions. It becomes `helix agent setup`.
- **Public skills**: https://github.com/uh-joan/helix-skills (`npx skills add uh-joan/helix-skills`).
- **Lint presets**: `@cdx/eslint-config-helix` and `@cdx/stylelint-config-helix`. `helix scan` should *wrap* these, not duplicate them.
- **Single-source pattern guides** (`*.guide.md` in cdx-next). These feed the docs, skills and Storybook, and will feed the CLI's pattern and rules data.

## Open decisions

- Package name and home: `@cdx/cli` inside cdx-next, or a standalone repo.
- Distribution: the CLI ships from the private Artifactory, so agents need a read-only token. The public skills must still work when the CLI isn't available.
- Coverage formula: should Material-themed `mat-*` count as compliant? The proposal says yes.
- Whether the Stripe evidence, which is secondhand, should be tested with a small "three users, three outputs" evaluation in Phase 2.

## Docs

- [`docs/proposal.md`](docs/proposal.md): the full research report and proposal (landscape, table stakes vs differentiators, gaps, the CLI design, packaging, risks). All claims are cited.
- [`docs/research-notes/`](docs/research-notes/): the six source notes:
  - `component_distribution_clis.md`: shadcn, Panda, Chakra, Tailwind, Radix, v0
  - `angular_nx_tooling.md`: Angular schematics and MCP, Nx, Spartan, PrimeNG, Kendo
  - `enterprise_ds_tooling_a.md`: Atlassian, Polaris, Primer, Salesforce SLDS
  - `enterprise_ds_tooling_b.md`: Carbon, Fluent, Spectrum, Paste, Canvas, EUI, Pajamas, PatternFly, MUI, Ant Design
  - `tokens_design_to_code.md`: Style Dictionary, Terrazzo, Code Connect, Figma MCP, Storybook MCP, Supernova
  - `agent_native_and_adoption.md`: Stripe, agent-CLI conventions, DESIGN.md, Omlet, codemod platforms

Related: `cdx-next/HELIX-AI-PROJECT.md` and `cdx-next/HELIX-CLI-PROPOSAL.md` (both local and git-ignored).
