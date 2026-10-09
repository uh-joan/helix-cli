# helix-cli

**Status: proposal / pre-build.** Planning folder for a Helix CLI (`@hlx/cli`,
binary `helix`). There is no code yet; it holds the research and the proposal it
came from.

> **In one sentence:** the Helix CLI tells a team or an AI agent how far an Angular
> app is from Helix, fixes the mechanical part, serves the Helix templates and
> rules on demand, and gives a deterministic pass/fail check.

## Scope: a clean break from `@cdx`

Helix is breaking away from the legacy `@cdx/*` packages and everything they drag
in. The new design system ships under its own scope — **`@hlx/*`** (working name;
the binary stays `helix`) — with no `@cdx` dependency anywhere. This already matches
the design language: the system's classes are `hlx-*` and its runtime tokens are
`--hlx-*`; only the npm scope and the `cdx-*` component selectors are legacy.

For the CLI this is not just a rename. The consumer apps are all on `@cdx/*` today
(one pinned to `@cdx` 18.3), so the move to `@hlx` is itself a large, measurable
migration — and turning that migration into a number that can only go down is
exactly what the CLI is for. Legacy `@cdx/*` imports and `cdx-*` selectors are
counted as debt; the compliant target is `@hlx/*`, `hlx-*` and themed `mat-*`.

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
  colours and about 690 Material-internal overrides, sit on the legacy `@cdx` scope,
  and have had their AI chat UIs rebuilt five times.

## Source of truth: the Helix Angular design system

Helix is defined in two layers, and the CLI depends on the split.

- **The Helix implementation is the code apps install.** The new `@hlx/*` packages,
  the Angular Material (M3) theme Sass, the branded shell components, the Storybook
  stories and the `docs-website` pattern examples live in the implementation repo
  (`cdx-next` today, being re-homed as Helix breaks away from `@cdx`). This is what
  app code imports, and therefore what `helix scan` measures code *against*.
- **The Helix Angular artifact is the canonical definition.** The
  [Helix Angular design system in Claude Design](https://claude.ai/artifact/MNWR5SeSkVUbdm4Qpp9QbU)
  holds the tokens (`tokens.json`), the component manifest (one folder per
  component, with guidelines, API and a live preview), the **templates** (the
  `Template*` family — ~21 composed page/section patterns, nine of them for AI),
  and the foundations and usage rules. It is **generated from the implementation** —
  tokens map to the Sass tokens, and component and template previews render the real
  Storybook stories — "so they can't drift." That guarantee is what makes it safe
  for the CLI to treat the artifact as its source.

The CLI consumes the artifact, never the other way round, and never at runtime:

```
Helix implementation  ──(ng/Storybook/docs-website generators)──▶  Helix Angular artifact
Helix Angular artifact  ──(release-time export)──▶  @hlx/cli bundled snapshot (JSON)
Helix implementation  ──(npm publish to Artifactory)──▶  @hlx/* packages  ──▶  what `helix scan` measures
                                     `helix doctor`: assert the snapshot matches the installed packages
```

`@hlx/cli` ships a versioned snapshot of the artifact's `project/` data, so it works
in CI and agent sandboxes with no network to claude.ai and **no `@hlx/*` package
required to run** — the snapshot is self-contained. The only place the CLI reads the
installed packages is `helix doctor`, which reconciles the snapshot's token names and
component selectors against what the installed `@hlx/*` packages actually export, and
flags any lingering `@cdx/*`.

**Tokens.** Semantic tokens are consumed at runtime as `--hlx-*` CSS custom
properties (`var(--hlx-text-primary)`, `var(--hlx-surface-minimal)`,
`var(--hlx-spacing-3)`, `var(--hlx-gradient-ai)`). The primitive ramps (`color-*`,
`ref-*`) and component-internal tokens (`components-*`) are intentionally **not**
exposed. So `helix fix` maps a hard-coded colour to the nearest *semantic* token
and emits `var(--hlx-<name>, #hex)`, never a primitive.

**Templates are first-class and growing.** The team extends the `Template*` catalog
over time, so the CLI reads the catalog from the snapshot rather than hard-coding a
list. `helix template get ai-assistant --step structure` is the direct answer to the
five times the AI chat UI has been rebuilt.

## Proposed command surface

| Command | Does |
| --- | --- |
| `helix doctor` | Checks environment and setup health (replaces `helix-check`), reconciles the snapshot against the installed `@hlx/*` packages, and flags any legacy `@cdx/*`. Supports `--json` and `--fix` |
| `helix scan` | Adoption and debt metrics across templates, TS and SCSS, including the `@cdx`→`@hlx` migration. Output as JSON or SARIF, with a baseline that fails only on regressions |
| `helix fix` | Mechanical autofix, e.g. colour → nearest semantic `--hlx-*` token with a fallback; `cdx-*` → `hlx-*` where safe. Dry run by default |
| `helix verify` | The agent's definition of done: scans changed files and fails on any new violation |
| `helix template` / `rules` / `component` | Serves the Helix templates, scoped rules and the component manifest step by step, from the snapshot, as Stripe does |
| `helix migrate` | Moves apps off `@cdx` onto `@hlx` and runs `ng update` for each major, scanning after every step, and hands what's left to agents |
| `helix agent setup` | Installs skills, AGENTS.md / CLAUDE.md blocks and Copilot instructions (replaces `helix-ai sync`) |
| `helix export design-md` | Generates a DESIGN.md from the snapshot tokens |
| `helix mcp` *(later)* | A thin MCP wrapper over the same `--json` commands |

The contract every command follows:
- Input comes only from flags.
- JSON goes to stdout; logs go to stderr.
- Nothing is written without `--write`.
- Exit codes: `0` pass · `1` violations · `2` usage/config error · `3` environment failure · `4` regression against the baseline.

## Roadmap

| Phase | Scope |
| --- | --- |
| **0: Measure** (first slice, ~4 weeks) | `helix doctor` (incl. snapshot↔package reconciliation and legacy `@cdx` detection) and `helix scan`. Run read-only on the three consumer apps and commit the baselines |
| 1: Ratchet and fix | Fail CI on regressions; `helix fix color` and `cdx-*`→`hlx-*`; `helix verify`; a `helix-adoption` skill |
| 2: Guide the build | `template`, `rules`, `component` from the snapshot; `agent setup`; a `.well-known` skills index |
| 3: Move off @cdx | `ng-add` for `@hlx`; `@cdx`→`@hlx` scope migration and ng-update migrations per major; `helix migrate --agent` |
| 4: Extend | `helix mcp`; snapshot dashboard; DESIGN.md export |

## What already exists (to absorb and re-home under `@hlx`)

- **`helix-check`**: a bin in the legacy `@cdx/ngx-branding`. It checks the Node version, `.npmrc`, package versions against the Helix major, the theme class, `index.html` fonts and branding. It becomes `helix doctor`.
- **`helix-ai sync`**: a CLI (legacy `@cdx/helix-ai`) that writes skills, the AGENTS.md block and Copilot instructions. It becomes `helix agent setup`.
- **The Helix Angular artifact**: the canonical tokens / component manifest / template catalog the CLI snapshots.
- **Public skills**: https://github.com/uh-joan/helix-skills (`npx skills add uh-joan/helix-skills`).
- **Lint presets**: the Helix ESLint and Stylelint configs (legacy `@cdx/eslint-config-helix` / `@cdx/stylelint-config-helix`, re-homed under `@hlx`). `helix scan` should *wrap* these, not duplicate them.
- **Single-source pattern examples** (`docs-website` patterns + Storybook `Patterns/*`). These generate the artifact's templates, and the CLI serves them from the snapshot.

## Open decisions

- The new scope name (`@hlx` is the working assumption) and package home: inside the implementation repo, or a standalone repo.
- How far the `@cdx`→`@hlx` break goes in one step vs. a transition period where both resolve, and whether the CLI should support a compatibility window.
- Distribution: the CLI ships from the private Artifactory, so agents need a read-only token. The public skills must still work when the CLI isn't available.
- Snapshot export: who runs the artifact→snapshot export, and how `helix doctor` reconciles the snapshot against the installed `@hlx/*` packages (token names, selectors).
- Coverage formula: should Material-themed `mat-*` count as compliant? The proposal says yes.
- Whether the Stripe evidence, which is secondhand, should be tested with a small "three users, three outputs" evaluation in Phase 2.

## Docs

- [`docs/proposal.md`](docs/proposal.md): the full research report and proposal (landscape, table stakes vs differentiators, gaps, the CLI design, packaging, risks). All market claims are cited.
- [`docs/research-notes/`](docs/research-notes/): the six source notes:
  - `component_distribution_clis.md`: shadcn, Panda, Chakra, Tailwind, Radix, v0
  - `angular_nx_tooling.md`: Angular schematics and MCP, Nx, Spartan, PrimeNG, Kendo
  - `enterprise_ds_tooling_a.md`: Atlassian, Polaris, Primer, Salesforce SLDS
  - `enterprise_ds_tooling_b.md`: Carbon, Fluent, Spectrum, Paste, Canvas, EUI, Pajamas, PatternFly, MUI, Ant Design
  - `tokens_design_to_code.md`: Style Dictionary, Terrazzo, Code Connect, Figma MCP, Storybook MCP, Supernova (background; the Figma/Supernova paths were considered and dropped — see the proposal)
  - `agent_native_and_adoption.md`: Stripe, agent-CLI conventions, DESIGN.md, Omlet, codemod platforms

> Note: the research notes and some repo references still use the legacy `@cdx`
> naming; they are the factual record from before the break and are left as-is.
