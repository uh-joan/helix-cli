#!/usr/bin/env node
// Nightly build: run the suite, scan each consumer app against its committed
// baseline, and write a morning report (reports/<date>.md + reports/latest.md).
// Resolves paths from its own location so it works under launchd regardless of cwd.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { loadSnapshot } from '../src/snapshot/load.mjs';
import { scanTemplateDir } from '../src/scan/template-scan.mjs';
import { scanStyleDir } from '../src/scan/style-scan.mjs';
import { loadBaseline, mergePerFile, compareBaseline } from '../src/scan/baseline.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(join(ROOT, 'nightly.config.json'), 'utf8'));
const now = new Date();
const date = now.toISOString().slice(0, 10);

function runTests() {
  try {
    const out = execFileSync(process.execPath, ['--test'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    const pass = Number((out.match(/pass (\d+)/) || [])[1] ?? 0);
    const fail = Number((out.match(/fail (\d+)/) || [])[1] ?? 0);
    return { ok: fail === 0, pass, fail };
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    return { ok: false, pass: Number((out.match(/pass (\d+)/) || [])[1] ?? 0), fail: Number((out.match(/fail (\d+)/) || [])[1] ?? 1) };
  }
}

function scanApp(snap, app) {
  if (!existsSync(app.path)) return { name: app.name, missing: true };
  const t = scanTemplateDir(snap, app.path);
  const s = scanStyleDir(snap, app.path);
  const perFile = mergePerFile(t.perFile, s.perFile);
  const blPath = join(ROOT, 'baselines', `${app.name}.helix-baseline.json`);
  let cmp = null;
  try {
    const bl = loadBaseline(blPath);
    if (bl) cmp = compareBaseline(perFile, bl);
  } catch {
    /* no baseline */
  }
  return {
    name: app.name,
    coverage: t.coverage,
    color: s.counts.hardcodedColor,
    matOverride: s.counts.materialInternalOverride,
    ngDeep: s.counts.ngDeep,
    important: s.counts.important,
    legacy: t.counts.legacy,
    regressions: cmp?.regressions ?? null,
    improvements: cmp?.improvements ?? null,
  };
}

const tests = runTests();
let snap, results = [];
try {
  snap = loadSnapshot();
  results = cfg.apps.map((a) => scanApp(snap, a));
} catch (e) {
  results = [{ error: e.message }];
}

const regressed = results.filter((r) => (r.regressions ?? 0) > 0);
const status = !tests.ok || regressed.length ? 'NEEDS ATTENTION' : 'OK';

const pct = (n) => (typeof n === 'number' ? `${Math.round(n * 100)}%` : 'n/a');
const rows = results
  .map((r) =>
    r.missing
      ? `| ${r.name} | _missing_ | | | | | | |`
      : r.error
        ? `| _error_ | ${r.error} | | | | | | |`
        : `| ${r.name} | ${pct(r.coverage)} | ${r.color} | ${r.matOverride} | ${r.ngDeep} | ${r.important} | ${r.legacy} | ${r.regressions ?? '—'} / ${r.improvements ?? '—'} |`,
  )
  .join('\n');

const report = `# Helix nightly — ${date}

**Status: ${status}**  ·  generated ${now.toISOString()}

- Build + suite: ${tests.ok ? 'PASS' : 'FAIL'} (${tests.pass} pass / ${tests.fail} fail)
- Apps scanned: ${results.filter((r) => !r.missing && !r.error).length}/${cfg.apps.length}
- Regressions vs baseline: ${regressed.length ? regressed.map((r) => r.name).join(', ') : 'none'}

| app | coverage | colour | mat-override | ng-deep | !important | legacy cdx | regr/impr |
|---|---|---|---|---|---|---|---|
${rows}

_Columns are current counts; regr/impr is vs each app's committed baseline. A
regression (count up in any file) is what CI's \`--fail-on regression\` would catch._
`;

mkdirSync(join(ROOT, 'reports'), { recursive: true });
writeFileSync(join(ROOT, 'reports', `${date}.md`), report);
writeFileSync(join(ROOT, 'reports', 'latest.md'), report);
process.stdout.write(`nightly: ${status} — report at reports/latest.md\n`);
process.exit(status === 'OK' ? 0 : 1);
