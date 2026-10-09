# graph.md — helix-cli Phase 0 build

Operating graph for building the Helix CLI first slice. Structure follows the
loops-and-graphs method: bounded nodes, edges only where one node consumes
another's output, a deterministic gate on every node, capped correction edges.
Status lives in [progress.md](progress.md); gate results in [checks.md](checks.md).

> **State: DRAFT — awaiting approval.** No build has started. Nodes N0–N7 below
> are the proposed split. See "Open inputs" before approving.

## Inputs

| Field | Value |
|---|---|
| **TASK** | Build `@hlx/cli` Phase 0: scaffold + `helix doctor` + `helix scan`, run baselines on the three consumer apps. |
| **OUTPUT** | The `@hlx/cli` package in this repo (`src/`, built `bin/helix`), three committed `helix-baseline.json`, and graph.md / checks.md / progress.md kept current. |
| **CHECKS** | Build passes; each node's gate (checks.md) is green; `helix scan` reproduces ~665 hard-coded colours and ~690 Material overrides on the consumer apps; `helix doctor` reconciles the snapshot against the installed Helix packages. |
| **SOURCES** | `docs/proposal.md`, `README.md`; the Helix Angular artifact snapshot (`tokens.json`, component manifest, `Template*`); the three consumer apps (read-only); the Helix ESLint/Stylelint presets. |
| **SCOPE** | This repo only. Create `src/`, `package.json`, tests, fixtures, baselines, planning `.md`. Do **not** modify `cdx-next` or the consumer apps — scan them read-only. |
| **LIMIT** | Phase 0 only (nodes N0–N7). Stop at the N7 exit criterion, a blocker, or the node budget. |

Scope name `@hlx` is the working assumption; the binary is `helix` regardless.

## Principles applied

- Baseline before change: N7 is the whole point — commit numbers that later runs ratchet down.
- One scope + one fixed evaluator per node (see the gate column).
- Deterministic steps are **code, not model calls** (see Code nodes).
- Fewer nodes: Phase 0 is eight nodes, not twenty. Later phases extend this graph, they don't rewrite it.

## Nodes

Each node is one bounded job: one input, one output, one gate. Edges mean "consumes the output of".

### N0 — Project scaffold
- **Does:** `@hlx/cli` package — `package.json` (bin `helix`), TS + build (tsup/esbuild), test runner (vitest), command router, the contract (flags-only input, JSON→stdout, logs→stderr, exit codes 0/1/2/3/4).
- **Output:** buildable skeleton; `helix --help` and `helix --version` work.
- **Gate:** `npm run build` exits 0; `helix --help` exits 0; `helix --version` prints; smoke test passes.
- **Edges in:** none. **Enables:** all.

### N1 — Snapshot format + loader
- **Does:** define the bundled snapshot schema (tokens, component manifest, templates, rules) and a no-network `loadSnapshot()`. Commit a fixture snapshot derived from the Helix Angular artifact; mark the exposed semantic-token set (the `--hlx-*` subset) distinct from primitives (`color-*`) and internals (`components-*`).
- **Output:** `loadSnapshot()`, types, committed fixture snapshot.
- **Gate:** unit test loads the fixture; asserts token count, that only semantic tokens are exposed, and the template list is non-empty; schema validation passes.
- **Edges in:** N0. **Parallel with:** N2.

### N2 — Report contract (JSON + SARIF + exit codes)
- **Does:** the versioned report shape (`schemaVersion`, `summary`, `findings`, `baseline`), a SARIF emitter, and the exit-code mapper.
- **Output:** types, serializer, a JSON schema the output validates against.
- **Gate:** a sample report validates against the schema; SARIF output validates against the SARIF schema; exit-code unit tests pass.
- **Edges in:** N0. **Parallel with:** N1.

### N3 — `helix doctor`
- **Does:** env checks (Node, `.npmrc`/registry reachability, `@hlx` version skew, theme class, fonts, Storybook builder, agent config); snapshot↔installed-package reconciliation; legacy `@cdx` detection. Flags `--json`, `--fix`, `--offline`.
- **Output:** the `helix doctor` command.
- **Gate:** fixture projects — healthy → exit 0; broken env → exit 3; legacy-`@cdx` fixture → flagged; `--json` validates against the contract.
- **Edges in:** N0, N1, N2.

### N4 — Template scanner (HTML)
- **Does:** parse Angular templates via `@angular-eslint/template-parser`; classify every element into Helix (`hlx-*`) / Material-themed (`mat-*`) / raw-equivalent / custom; compute coverage; count legacy `cdx-*`.
- **Output:** template-scan module returning findings.
- **Gate:** fixture templates with known counts → asserted coverage and legacy counts; inline + external templates and control-flow blocks handled.
- **Edges in:** N0, N1. **Parallel with:** N5.

### N5 — Style scanner (SCSS)
- **Does:** Stylelint/PostCSS stack wrapping the Helix preset; count hard-coded colours, `.mat-mdc-*`, `::ng-deep`, `!important`, non-semantic token usage, and descriptionless disables.
- **Output:** style-scan module returning findings.
- **Gate:** fixture SCSS with known debt → asserted counts; wraps the preset (no bespoke rule engine).
- **Edges in:** N0, N1. **Parallel with:** N4.

### N6 — `helix scan` assembly + baseline ratchet
- **Does:** combine N4+N5 into the report (N2); categorise; `--baseline`, `--fail-on regression|any|none`, `--format json|sarif|text`, `--changed-since`.
- **Output:** the `helix scan` command.
- **Gate:** fixture run → summary matches expected; baseline test — counts up → exit 4, down → exit 0, equal → pass; SARIF validates.
- **Edges in:** N2, N4, N5.

### N7 — Consumer-app baselines (Phase 0 exit)
- **Does:** run `helix scan` read-only on the three consumer apps; commit three `helix-baseline.json`; write a short runbook.
- **Output:** three baselines + runbook.
- **Gate:** baselines exist and open; colour/override totals reproduce ~665 / ~690 within tolerance; `helix doctor` confirms snapshot↔package on each app.
- **Edges in:** N3, N6.

## Code nodes (deterministic — never a model call)

Exit-code mapper · SARIF serializer · baseline diff (regression detection) · coverage arithmetic · snapshot loader + schema validator · element classifier lookup. If a required tool (the real preset, the snapshot export) is unavailable, name the blocker and keep the fixture-backed nodes moving.

## Edges / parallelism

```
N0 ──┬── N1 ──┬── N4 ──┐
     │        └── N5 ──┤
     └── N2 ───────────┼── N6 ── N7
          └──── N3 ────────────── (N7 also consumes N3)
```
Parallel sets: {N1, N2} after N0 · {N3, N4, N5} after their inputs · N6 waits on {N2,N4,N5} · N7 waits on {N3,N6}.

## Gates (loop)

Order on every gate: **deterministic check first, node report second, model confidence last.** A failed gate opens the correction edge; do not weaken a gate to get a pass. Full table in [checks.md](checks.md).

## Return paths

- **Correction edge:** a failed gate returns the unit to the node that made it, with the reason, the evidence, and scope "fix this node only". Capped at 3 attempts, then it becomes a blocker in progress.md.
- **Learning edge:** an accepted result writes its rule back here (e.g. "the preset is wrapped, not reimplemented") so the next run and the cdx-next graph start from it.

## Completion checklist (from CHECKS)

- [ ] Every node's output exists and can be opened.
- [ ] Every gate ran against the saved artifact (checks.md rows all `pass`).
- [ ] `helix build` + full test suite green.
- [ ] Three `helix-baseline.json` committed; totals reproduce ~665 / ~690.
- [ ] `helix doctor` reconciles snapshot↔packages and flags legacy `@cdx`.
- [ ] graph.md and progress.md match the nodes that actually ran.

If the limit or a blocker stops the run, return a partial status with the exact nodes left.

## Open inputs (confirm before N3 / N7)

1. **Consumer-app locations** — where are the three apps, and are they checked out locally for read-only scanning?
2. **Snapshot availability** — is there an artifact→snapshot export to depend on, or do we hand-build the Phase 0 fixture snapshot from the artifact's `tokens.json` for now?
3. **Preset availability** — are the Helix ESLint/Stylelint presets installable locally (so N5 wraps the real rules), or do we stub them for Phase 0?
