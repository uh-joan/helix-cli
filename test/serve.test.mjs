import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EXIT } from '../src/exit-codes.mjs';

const execFileP = promisify(execFile);
const BIN = fileURLToPath(new URL('../bin/helix.mjs', import.meta.url));

async function helix(args) {
  try {
    const { stdout } = await execFileP(process.execPath, [BIN, ...args]);
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('template list shows slugs', async () => {
  const r = await helix(['template', 'list']);
  assert.equal(r.code, EXIT.OK);
  assert.match(r.stdout, /ai-assistant/);
  assert.match(r.stdout, /page-states/);
});

test('template get --step serves a slice with a next hint', async () => {
  const r = await helix(['template', 'get', 'ai-assistant', '--step', 'overview']);
  assert.equal(r.code, EXIT.OK);
  assert.match(r.stdout, /AI assistant/);
  assert.match(r.stdout, /next: helix template get ai-assistant --step anatomy/);
});

test('template get rules step carries the real rules', async () => {
  const r = await helix(['template', 'get', 'ai-assistant', '--step', 'rules', '--json']);
  const o = JSON.parse(r.stdout);
  assert.equal(o.slug, 'ai-assistant');
  assert.match(o.body, /aria-live/);
});

test('template get unknown slug -> exit 2 with suggestion', async () => {
  const r = await helix(['template', 'get', 'assistant']);
  assert.equal(r.code, EXIT.USAGE);
  assert.match(r.stderr, /ai-assistant/);
});

test('rules by file maps hints to templates', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-rules-'));
  try {
    const f = join(dir, 'chat.html');
    writeFileSync(f, '<div aria-live="polite">message</div>');
    const r = await helix(['rules', f]);
    assert.equal(r.code, EXIT.OK);
    assert.match(r.stdout, /AI assistant — rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('component list + get', async () => {
  const list = await helix(['component', 'list']);
  assert.match(list.stdout, /Button/);
  const get = await helix(['component', 'get', 'Button', '--json']);
  const o = JSON.parse(get.stdout);
  assert.equal(o.selectorGuess, 'hlx-button');
});
