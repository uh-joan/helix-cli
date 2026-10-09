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

| app | coverage | colour | mat-mdc | ::ng-deep | !important | legacy sel. | `@cdx` pkgs |
|---|---|---|---|---|---|---|---|
| off-x-ui | 45% | 165 | 414 | 0 | 164 | 1 | 7 |
| cmc-gui-docker | 67% | 53 | 29 | 68 | 18 | 0 | 4 |
| cortellis-reg-ai-app | 53% | 209 | 18 | 31 | 59 | 0 | 4 |
| **total** | — | **427** | **461** | **99** | **241** | **1** | — |

`doctor` on all three: design system present, theme class present, **legacy
`@cdx` flagged** (every app is on `@cdx`, so all are migration targets).

## Known undercount vs the research estimate

The research estimated ~665 hard-coded colours and ~690 Material overrides
(`.mat-mdc-*` + `::ng-deep`). Captured here: **427 colours**, **560 overrides**
(461 + 99). The main reason is a Phase 0 scanner limitation, not a discrepancy in
the apps:

- The colour scanner reads **`.scss`/`.css` only**. A large share of hard-coded
  colour lives in **`.ts`** (chart/config/logic and inline styles) — e.g.
  **~203 hex in off-x-ui `.ts`** alone — which is not yet counted.

Follow-up: extend colour debt scanning to `.ts` and inline component styles;
that should close most of the gap. The **baseline ratchet works regardless** of
absolute accuracy — its job is to stop any count going up, and each app rescans
to exit 0 against its baseline today.
