import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSnapshot, exposedColorTokens } from '../src/snapshot/load.mjs';
import { deltaE } from '../src/fix/ciede2000.mjs';
import { buildPalette, nearestToken, proposeColorFixes, fixColorDir, confidenceFromDeltaE } from '../src/fix/color.mjs';

const snap = loadSnapshot();
const palette = buildPalette(snap);

test('ciede2000: identical colours -> 0, and a known gap is positive', () => {
  assert.equal(deltaE('#1a73e8', '#1a73e8'), 0);
  assert.ok(deltaE('#000000', '#ffffff') > 50);
});

test('nearestToken returns ΔE 0 for an exact token value', () => {
  const t = exposedColorTokens(snap).find((x) => /^#/.test(x.value));
  const near = nearestToken(palette, t.value);
  assert.equal(near.name, t.name);
  assert.equal(near.deltaE, 0);
});

test('confidence: ΔE 0 -> 1, large ΔE -> 0', () => {
  assert.equal(confidenceFromDeltaE(0), 1);
  assert.equal(confidenceFromDeltaE(99), 0);
});

test('proposeColorFixes replaces exact-match hex with var(token, orig) at high confidence', () => {
  const t = exposedColorTokens(snap).find((x) => /^#/.test(x.value));
  const { proposals, fixedText } = proposeColorFixes(palette, `.x { color: ${t.value}; }`, 'x.scss');
  assert.equal(proposals.length, 1);
  assert.equal(proposals[0].token, t.name);
  assert.equal(proposals[0].confidence, 1);
  assert.match(fixedText, new RegExp(`var\\(${t.cssVar}, ${t.value}\\)`));
});

test('a var() fallback hex is not re-fixed', () => {
  const { proposals } = proposeColorFixes(palette, 'a { color: var(--hlx-text-primary, #2a2b2d); }', 'y.scss');
  assert.equal(proposals.length, 0);
});

test('fixColorDir: dry-run does not write; --write applies', () => {
  const dir = mkdtempSync(join(tmpdir(), 'helix-fix-'));
  const f = join(dir, 'a.scss');
  const token = exposedColorTokens(snap).find((x) => /^#/.test(x.value));
  try {
    writeFileSync(f, `.x { color: ${token.value}; }`);
    let r = fixColorDir(snap, dir, { write: false });
    assert.equal(r.applied, 1);
    assert.equal(r.filesChanged, 0);
    assert.match(readFileSync(f, 'utf8'), new RegExp(token.value)); // unchanged
    r = fixColorDir(snap, dir, { write: true });
    assert.equal(r.filesChanged, 1);
    assert.match(readFileSync(f, 'utf8'), new RegExp(`var\\(${token.cssVar},`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
