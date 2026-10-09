# Consumer-app baselines (N7)

Phase 0 baselines for the three Helix consumer apps, captured read-only with
`helix scan`. In production each baseline lives in its own app repo and CI runs
`helix scan --baseline helix-baseline.json --fail-on regression`; they are
collected here as the Phase 0 deliverable (the app repos were not modified).

Regenerate:

```
helix scan <app> --baseline baselines/<app>.helix-baseline.json --update-baseline
```

## Snapshot at capture

Colour now covers `.scss`/`.css`, `.ts` (hex inside string literals only — ES
private fields and comments are excluded) and `.html` markup.

| app | coverage | colour | mat-mdc | ::ng-deep | !important | legacy sel. | `@cdx` pkgs |
|---|---|---|---|---|---|---|---|
| off-x-ui | 45% | 374 | 414 | 0 | 164 | 1 | 7 |
| cmc-gui-docker | 67% | 57 | 29 | 68 | 18 | 0 | 4 |
| cortellis-reg-ai-app | 53% | 224 | 18 | 31 | 59 | 0 | 4 |
| **total** | — | **655** | **461** | **99** | **241** | **1** | — |

`doctor` on all three: design system present, theme class present, **legacy
`@cdx` flagged** (every app is on `@cdx`, so all are migration targets).

## Vs the research estimate

The research estimated ~665 hard-coded colours and ~690 Material overrides
(`.mat-mdc-*` + `::ng-deep`).

- **Colour: 655 ≈ 665 — reproduced.** The earlier 427 undercount was hex in
  `.ts` (e.g. ~209 in off-x-ui `.ts`/`.html`), now counted.
- **Overrides: 560** (`.mat-mdc-*` 461 + `::ng-deep` 99) vs ~690 — still short.
  Likely the research also counted related patterns (`.mdc-*`, `.cdk-*`, or
  attribute-level overrides). Remaining follow-up; not required for the ratchet.

The **baseline ratchet works regardless** of absolute accuracy — its job is to
stop any count going up, and each app rescans to exit 0 against its baseline.
