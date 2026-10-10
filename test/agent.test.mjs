import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { upsertBlock, hasBlock, BEGIN, END } from '../src/agent/block.mjs';
import { EXIT } from '../src/exit-codes.mjs';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));

async function helix(args, cwd) {
  try {
    const { stdout } = await execFileP(process.execPath, [BIN, ...args], { cwd });
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '' };
  }
}

test('upsertBlock: create, then update in place (idempotent, preserves surrounding text)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-agent-'));
  try {
    const f = join(dir, 'AGENTS.md');
    writeFileSync(f, '# My project\n\nExisting notes.\n');
    upsertBlock(f);
    let t = readFileSync(f, 'utf8');
    assert.match(t, /# My project/); // preserved
    assert.match(t, /helix verify/);
    assert.equal((t.match(new RegExp(BEGIN, 'g')) || []).length, 1);
    upsertBlock(f); // second run
    t = readFileSync(f, 'utf8');
    assert.equal((t.match(new RegExp(BEGIN, 'g')) || []).length, 1); // still one block
    assert.equal((t.match(new RegExp(END, 'g')) || []).length, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('agent setup writes files; --check reports presence', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-agent2-'));
  try {
    let r = await helix(['agent', 'setup', '--client', 'claude'], dir);
    assert.equal(r.code, EXIT.OK);
    assert.ok(hasBlock(join(dir, 'CLAUDE.md')));
    r = await helix(['agent', 'setup', '--check', '--client', 'claude'], dir);
    assert.equal(r.code, EXIT.OK);
    // a client whose file was not written -> --check reports missing (exit 1)
    const r2 = await helix(['agent', 'setup', '--check', '--client', 'copilot'], dir);
    assert.equal(r2.code, EXIT.VIOLATIONS);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
