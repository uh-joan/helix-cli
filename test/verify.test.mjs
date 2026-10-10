import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSnapshot } from '../src/snapshot/load.mjs';
import { scanFiles } from '../src/scan/scan-files.mjs';
import { EXIT } from '../src/exit-codes.mjs';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));
const snap = loadSnapshot();

async function helix(args) {
  try {
    const { stdout } = await execFileP(process.execPath, [BIN, ...args]);
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '' };
  }
}

test('scanFiles finds violations across html/scss', () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-vf-'));
  try {
    const bad = join(dir, 'a.scss');
    const clean = join(dir, 'b.scss');
    writeFileSync(bad, '.x { color: #1a73e8; }');
    writeFileSync(clean, '.y { color: var(--hlx-text-primary); }');
    assert.ok(scanFiles(snap, [bad]).findings.length >= 1);
    assert.equal(scanFiles(snap, [clean]).findings.length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('verify <files>: clean file -> exit 0, dirty file -> exit 1', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-vf2-'));
  try {
    const bad = join(dir, 'a.scss');
    const clean = join(dir, 'b.scss');
    writeFileSync(bad, '.x { color: #1a73e8; }');
    writeFileSync(clean, '.y { color: var(--hlx-text-primary); }');
    assert.equal((await helix(['verify', clean])).code, EXIT.OK);
    const r = await helix(['verify', bad]);
    assert.equal(r.code, EXIT.VIOLATIONS);
    assert.match(r.stdout, /FAIL/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
