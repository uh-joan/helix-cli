# progress.md — helix-cli Phase 0

Live state. On resumption, read [graph.md](graph.md) and this file first, then
continue from **Next action**.

## Graph
- **Done:** N0–N6 + N3 (36/36 tests). **N7 baselines captured** on all three consumer apps (off-x-ui, cmc-gui-docker, cortellis-reg-ai-app); committed under `baselines/`, each rescans to exit 0.
- **Phase 0 complete** (with two flagged follow-ups below).
- **Follow-ups (not blockers):** colour scan should cover `.ts`/inline styles (N7 undercount: 427 vs ~665 — see baselines/README.md); wrap the real `@hlx/stylelint-config-helix` (N5); real token extraction for snapshot↔package reconciliation (N3); `--changed-since` (N4).

## Outputs
- `graph.md`, `checks.md`, `progress.md` — current.
- `@hlx/cli`: `bin/helix.mjs`, `src/cli.mjs`, `src/exit-codes.mjs`, `src/commands/{doctor,scan}.mjs`, `src/snapshot/{load.mjs,helix-snapshot.json}`, `src/report/{report,sarif}.mjs`, `src/scan/{template-scan,style-scan,baseline}.mjs`, `scripts/{build,build-snapshot}.mjs`.
- Snapshot generated from `fixtures/artifact/tokens.json` (vendored); 225 colours (35 exposed), 21 templates, 48 components.
- Tests: `test/{cli,exit-codes,snapshot,report,template-scan,style-scan,scan}.test.mjs` — 31 pass.
- Dep added: `@angular/compiler` (real template parsing, N4).
- `helix scan fixtures/apps/sample` works: coverage 67%, debt color 3 / mat 1 / ng-deep 1 / !important 2, legacy selectors 2.
- Three `helix-baseline.json` — not created yet (N7).

## Decisions
- Graph scoped to Phase 0 (N0–N7): scaffold + `helix doctor` + `helix scan` + consumer baselines. Later phases extend this graph, not rewrite it.
- Deterministic steps are code nodes (exit-code mapper, SARIF, baseline diff, coverage, snapshot loader).
- Scope name `@hlx` (working); binary `helix`.
- **N0 built zero-dependency** (Node ESM + `node:test`, no bundler/install): robust with no network, fits the private-registry concern. `npm run build` = syntax-check gate; swap in `tsc` later without changing the contract. doctor/scan are registered placeholders returning exit 2 until N3/N6.
- Defaults taken (approved): snapshot = hand-built fixture from the artifact `tokens.json` (N1); lint presets = stubbed for now (N5). Only consumer-app paths still block N7.

## Open issues
- **Consumer-app locations** still unknown → the only hard blocker, and only for N7 (last node).
- N5 uses a text scanner (approved default); wrap the real Stylelint preset later.
- Snapshot is a hand-built fixture (approved default); wire the real artifact→snapshot export later.

## Next action
Phase 0 is done. Highest-value next step (Phase 1 or a Phase 0 fix): extend colour debt scanning to `.ts`/inline styles to close the N7 undercount, then wire `--fail-on regression` into each app's CI. The migration to `@hlx` is tracked separately in cdx-next (not touched here).
