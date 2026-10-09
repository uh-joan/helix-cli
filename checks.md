# checks.md — helix-cli Phase 0 gates

One row per node requirement. Verdict ∈ {pass, fail, unresolved}. Evidence is a
file path or actual check output — deterministic check first. A `fail` opens the
correction edge (graph.md); do not weaken a gate to reach `pass`.

Suite: `npm run build` + `node --test` → **39/39 pass**.

| node | requirement | verdict | evidence |
|---|---|---|---|
| N0 | `npm run build` exits 0 | pass | "build ok", 13 modules checked |
| N0 | `helix --help` exits 0; `helix --version` prints | pass | `--version`→`0.0.0`; `--help`→0; unknown→2 |
| N0 | exit-code contract (0/1/2/3/4) unit-tested | pass | test/exit-codes.test.mjs, test/cli.test.mjs |
| N1 | fixture snapshot loads; schema validates | pass | test/snapshot.test.mjs; `validate()` rejects malformed |
| N1 | only semantic `--hlx-*` tokens exposed (primitives/internals excluded) | pass | 35/225 color exposed; `surface-primary` yes, `color-purple-600` no; cssVar=`--hlx-<name>` |
| N1 | template list non-empty; token count asserted | pass | 21 templates; `counts.color === tokens.color.length` |
| N2 | sample report validates against the report schema | pass | test/report.test.mjs; rejects bad schema / missing location |
| N2 | SARIF output validates against the SARIF schema | pass | `toSarif`→`validateSarif`; result carries ruleId/level/region |
| N2 | exit-code mapper unit tests pass | pass | `decideScanExit`: regression→4, any→1, none→0 |
| N3 | doctor fixtures: healthy→exit 0 | pass | fixtures/projects/healthy → 5 ok, exit 0 |
| N3 | doctor fixtures: broken env→exit 3 | pass | fixtures/projects/broken → 2 fail (no DS pkg, no theme), exit 3 |
| N3 | doctor fixtures: legacy-`@cdx`→flagged | pass | fixtures/projects/legacy → `legacy-cdx` warn, exit 0 |
| N3 | `--json` validates against the contract | pass | report has schemaVersion/command/checks[]/summary; status ∈ pass/warn/fail/info |
| N4 | fixture templates → coverage numbers asserted | pass | dir scan helix2/themed2/raw2/custom2; coverage 0.6667 |
| N4 | legacy `cdx-*` count asserted | pass | 2 legacy findings (`cdx-header`,`cdx-footer`) with file+line |
| N4 | inline + external templates and control-flow handled | pass | `@if/@else` parsed via **@angular/compiler**; inline `template:` extracted from .ts |
| N5 | fixture SCSS → debt counts asserted | pass | hardcoded 3 / mat-mdc 1 / ng-deep 1 / !important 2 / nonSemantic 1 |
| N5 | descriptionless disables counted | pass | `disablesWithoutReason` = 1 |
| N5 | wraps the Helix preset (no bespoke engine) | unresolved | **deferred by approved default** — Phase 0 uses a text scanner; wrap `@hlx/stylelint-config-helix` when installable |
| N6 | fixture run → summary matches expected | pass | `scan --json`: templateElements helix2/themed2/raw2/custom2, legacyCdx.selectors 2, hardcodedColor 3 |
| N6 | baseline: counts up → exit 4 | pass | stricter baseline → exit 4 (REGRESSION) |
| N6 | baseline: counts down → exit 0; equal → pass | pass | unchanged tree → exit 0; `compareBaseline` improvements on decrease |
| N6 | `--format json\|sarif\|text` all emit valid output | pass | json validates; SARIF 2.1.0 valid; text renders coverage/debt |
| N7 | three `helix-baseline.json` exist and open | pass | baselines/{off-x-ui,cmc-gui-docker,cortellis-reg-ai-app}.helix-baseline.json; each rescans → exit 0 |
| N7 | colour/override totals reproduce ~665 / ~690 | pass (colour) / partial (overrides) | colour **655 ≈ 665** after adding .ts/.html hex; overrides 560 (mat-mdc 461 + ng-deep 99) vs ~690 — remaining follow-up (`.mdc-*`/`.cdk-*`), not needed for the ratchet |
| N7 | `helix doctor` runs per app, flags legacy `@cdx` | pass | all 3 apps: DS present + theme + legacy-`@cdx` flagged. Token-level snapshot↔package reconciliation still a follow-up |
