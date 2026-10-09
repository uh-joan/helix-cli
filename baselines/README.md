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

`materialInternalOverride` counts the Material internals you should not style:
`.mat-mdc-*` (Angular Material wrappers) and the raw `.mdc-*` classes they wrap.
`::ng-deep` is a separate field.

| app | coverage | colour | mat-override | ::ng-deep | !important | legacy sel. | `@cdx` pkgs |
|---|---|---|---|---|---|---|---|
| off-x-ui | 45% | 374 | 614 | 0 | 164 | 1 | 7 |
| cmc-gui-docker | 67% | 57 | 52 | 68 | 18 | 0 | 4 |
| cortellis-reg-ai-app | 53% | 224 | 22 | 31 | 59 | 0 | 4 |
| **total** | — | **655** | **688** | **99** | **241** | **1** | — |

`doctor` on all three: design system present, theme class present, **legacy
`@cdx` flagged** (every app is on `@cdx`, so all are migration targets).

## Vs the research estimate — both reproduced

The research estimated ~665 hard-coded colours and ~690 Material overrides.

- **Colour: 655 ≈ 665.** The earlier 427 undercount was hex in `.ts` (≈209 in
  off-x-ui `.ts`/`.html`), now counted (string-scoped, so no private-field
  false positives).
- **Material overrides: 688 ≈ 690.** The earlier 560 counted only `.mat-mdc-*`;
  adding the raw `.mdc-*` classes (227 across the apps) lands at 688.
  `.cdk-*` (29) is a different library and is left out to avoid overshooting.

The baseline ratchet works regardless of absolute accuracy — its job is to stop
any count going up, and each app rescans to exit 0 against its baseline.
