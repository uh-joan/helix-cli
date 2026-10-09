import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compareBaseline, makeBaseline, mergePerFile } from '../src/scan/baseline.mjs';
import { EXIT } from '../src/exit-codes.mjs';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));
const APP = fileURLToPath(new URL('../fixtures/apps/sample/', import.meta.url));

async function helix(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [BIN, ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('scan --format json emits a valid report over the fixture app', async () => {
  const r = await helix(['scan', APP, '--format', 'json']);
  assert.equal(r.code, EXIT.OK); // no baseline -> no regression -> 0
  const report = JSON.parse(r.stdout);
  assert.equal(report.schemaVersion, '1.0');
  assert.deepEqual(report.summary.templateElements, { helix: 2, materialThemed: 2, rawEquivalent: 2, custom: 2 });
  assert.equal(report.summary.legacyCdx.selectors, 2);
  assert.equal(report.summary.styleDebt.hardcodedColor, 3);
});

test('scan --format sarif emits valid SARIF', async () => {
  const r = await helix(['scan', APP, '--format', 'sarif']);
  const s = JSON.parse(r.stdout);
  assert.equal(s.version, '2.1.0');
  assert.ok(s.runs[0].results.length > 0);
});

test('baseline ratchet: equal passes, regression -> exit 4', () => {
  const perFile = { 'a.scss': 5, 'b.html': 2 };
  const base = makeBaseline(perFile);
  assert.equal(compareBaseline(perFile, base).regressions, 0); // equal
  const worse = { 'a.scss': 6, 'b.html': 2 };
  const cmp = compareBaseline(worse, base);
  assert.equal(cmp.regressions, 1);
  assert.equal(cmp.regressedFiles[0].file, 'a.scss');
  const better = { 'a.scss': 1, 'b.html': 2 };
  assert.equal(compareBaseline(better, base).improvements, 1);
});

test('scan --baseline: unchanged tree exits 0, worsened tree exits 4', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-scan-'));
  const bl = join(dir, 'helix-baseline.json');
  try {
    // write baseline from the current fixture
    let r = await helix(['scan', APP, '--baseline', bl, '--update-baseline']);
    assert.equal(r.code, EXIT.OK);
    // re-scan unchanged against the baseline -> no regression
    r = await helix(['scan', APP, '--baseline', bl, '--fail-on', 'regression']);
    assert.equal(r.code, EXIT.OK);
    // a stricter baseline (zero debt) -> current tree regresses -> exit 4
    writeFileSync(bl, JSON.stringify({ schemaVersion: 1, files: {} }));
    r = await helix(['scan', APP, '--baseline', bl, '--fail-on', 'regression']);
    assert.equal(r.code, EXIT.REGRESSION);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('mergePerFile sums maps', () => {
  assert.deepEqual(mergePerFile({ a: 1 }, { a: 2, b: 3 }), { a: 3, b: 3 });
});
