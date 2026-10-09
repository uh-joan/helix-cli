import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

async function helix(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [BIN, ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('--version prints the package version, exit 0', async () => {
  const r = await helix(['--version']);
  assert.equal(r.code, 0);
  assert.equal(r.stdout.trim(), pkg.version);
});

test('--help shows usage, exit 0', async () => {
  const r = await helix(['--help']);
  assert.equal(r.code, 0);
  assert.match(r.stdout, /Usage: helix/);
});

test('no args shows help, exit 0', async () => {
  const r = await helix([]);
  assert.equal(r.code, 0);
  assert.match(r.stdout, /Commands:/);
});

test('unknown command -> exit 2 with stderr', async () => {
  const r = await helix(['bogus']);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /unknown command/);
});

test('doctor is dispatched (implemented in N3)', async () => {
  const r = await helix(['doctor', 'fixtures/projects/healthy']);
  assert.equal(r.code, 0);
  assert.match(r.stdout, /helix doctor/);
});

test('scan is dispatched (implemented in N6)', async () => {
  const r = await helix(['scan', 'fixtures/apps/sample', '--format', 'text']);
  assert.equal(r.code, 0);
  assert.match(r.stdout, /coverage:/);
});
