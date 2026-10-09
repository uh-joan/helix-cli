import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { EXIT } from '../src/exit-codes.mjs';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));
const project = (name) => fileURLToPath(new URL(`../fixtures/projects/${name}/`, import.meta.url));

async function helix(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [BIN, ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('healthy project -> exit 0', async () => {
  const r = await helix(['doctor', project('healthy'), '--json']);
  assert.equal(r.code, EXIT.OK);
  const rep = JSON.parse(r.stdout);
  assert.equal(rep.summary.fail, 0);
  assert.equal(rep.checks.find((c) => c.id === 'design-system-present').status, 'pass');
  assert.equal(rep.checks.find((c) => c.id === 'theme-class').status, 'pass');
});

test('broken env (no DS package, no theme) -> exit 3', async () => {
  const r = await helix(['doctor', project('broken'), '--json']);
  assert.equal(r.code, EXIT.ENV);
  const rep = JSON.parse(r.stdout);
  assert.ok(rep.summary.fail >= 2);
  assert.equal(rep.checks.find((c) => c.id === 'design-system-present').status, 'fail');
  assert.equal(rep.checks.find((c) => c.id === 'theme-class').status, 'fail');
});

test('legacy @cdx project -> flagged, still exit 0', async () => {
  const r = await helix(['doctor', project('legacy'), '--json']);
  assert.equal(r.code, EXIT.OK);
  const rep = JSON.parse(r.stdout);
  const legacy = rep.checks.find((c) => c.id === 'legacy-cdx');
  assert.equal(legacy.status, 'warn');
  assert.match(legacy.message, /@cdx/);
});

test('--json report has the required shape', async () => {
  const r = await helix(['doctor', project('healthy'), '--json']);
  const rep = JSON.parse(r.stdout);
  assert.equal(rep.schemaVersion, '1.0');
  assert.equal(rep.command, 'doctor');
  assert.ok(Array.isArray(rep.checks));
  for (const c of rep.checks) {
    assert.ok(c.id && ['pass', 'warn', 'fail', 'info'].includes(c.status));
  }
  assert.ok(Number.isInteger(rep.summary.pass));
});

test('text output renders and --fix lists suggestions', async () => {
  const r = await helix(['doctor', project('broken'), '--fix']);
  assert.equal(r.code, EXIT.ENV);
  assert.match(r.stdout, /helix doctor/);
  assert.match(r.stderr, /--fix:/);
});
