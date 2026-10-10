# CI templates

## `helix-scan.yml` — the adoption ratchet for a consumer app

Copy to the app repo at `.github/workflows/helix-scan.yml`. On every PR it runs
`helix scan . --baseline helix-baseline.json --fail-on regression`, which exits
**4** (failing the job) only when a debt count goes **up** in some file. Every
merged change can then only hold or improve the numbers.

### One-time setup in the app

1. Install the CLI (until `@hlx/cli` is on the private registry, use the git
   source):
   ```bash
   npm i -g github:uh-joan/helix-cli
   ```
2. Commit the baseline:
   ```bash
   helix scan . --baseline helix-baseline.json --update-baseline
   git add helix-baseline.json && git commit -m "chore: helix baseline"
   ```
3. Add the workflow and open a PR. A PR that increases debt fails the Helix scan
   check; one that holds or reduces it passes.

Findings are also uploaded as SARIF to the repo's Security tab (optional step).

Once `npm-hlx` is live, swap the install line for `npm i -g @hlx/cli` (with the
app's `.npmrc` scope mapping + token).
