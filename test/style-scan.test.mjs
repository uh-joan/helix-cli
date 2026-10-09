import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { loadSnapshot } from '../src/snapshot/load.mjs';
import { scanScssString, scanStyleDir } from '../src/scan/style-scan.mjs';

const snap = loadSnapshot();
const SCSS = fileURLToPath(new URL('../fixtures/apps/sample/results.component.scss', import.meta.url));

test('counts debt categories with known fixture', () => {
  const { counts } = scanScssString(snap, readFileSync(SCSS, 'utf8'), SCSS);
  assert.deepEqual(counts, {
    hardcodedColor: 3, // #1a73e8, #fff, #000 ; the var() fallback #2a2b2d is allowed
    materialInternalOverride: 1,
    ngDeep: 1,
    important: 2,
    nonSemanticToken: 1, // var(--hlx-color-purple-600) is a primitive, not exposed
    disablesWithoutReason: 1,
  });
});

test('a var() fallback hex is not counted as hard-coded', () => {
  const r = scanScssString(snap, 'a { color: var(--hlx-text-primary, #2a2b2d); }', 'f.scss');
  assert.equal(r.counts.hardcodedColor, 0);
  assert.equal(r.findings.length, 0);
});

test('findings carry file + line and match the hard-coded count', () => {
  const { counts, findings } = scanScssString(snap, readFileSync(SCSS, 'utf8'), SCSS);
  const hc = findings.filter((f) => f.ruleId === 'helix/color/no-hardcoded');
  assert.equal(hc.length, counts.hardcodedColor);
  assert.ok(hc.every((f) => f.location.line > 0));
});

test('scanStyleDir aggregates', () => {
  const { counts } = scanStyleDir(snap, fileURLToPath(new URL('../fixtures/apps/sample/', import.meta.url)));
  assert.equal(counts.hardcodedColor, 3);
  assert.equal(counts.ngDeep, 1);
});
