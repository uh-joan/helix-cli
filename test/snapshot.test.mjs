import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSnapshot,
  validate,
  exposedColorTokens,
  isExposedToken,
  classifySelector,
} from '../src/snapshot/load.mjs';

const snap = loadSnapshot();

test('snapshot loads and self-counts are consistent', () => {
  assert.equal(snap.counts.color, snap.tokens.color.length);
  assert.equal(snap.counts.colorExposed, exposedColorTokens(snap).length);
  assert.ok(exposedColorTokens(snap).length > 0);
});

test('only semantic tokens are exposed; primitives and internals are not', () => {
  for (const t of snap.tokens.color) {
    const looksPrimitive = /^(color-|ref-|components-|\$)/.test(t.name);
    assert.equal(t.exposed, !looksPrimitive, `${t.name} exposure`);
    if (t.exposed) assert.equal(t.cssVar, `--hlx-${t.name}`);
  }
  // concrete anchors from the real artifact
  assert.equal(isExposedToken(snap, 'surface-primary'), true);
  assert.equal(isExposedToken(snap, 'color-purple-600'), false);
});

test('exposed color tokens resolve to usable values (no raw alias left)', () => {
  for (const t of exposedColorTokens(snap)) {
    assert.doesNotMatch(String(t.value), /^\{.+\}$/, `${t.name} still an alias`);
  }
});

test('template catalog is present', () => {
  assert.ok(snap.templates.includes('AiAssistant'));
  assert.ok(snap.templates.includes('PageStates'));
});

test('selector classification', () => {
  assert.equal(classifySelector(snap, 'hlx-button'), 'helix');
  assert.equal(classifySelector(snap, 'mat-button'), 'themed');
  assert.equal(classifySelector(snap, 'cdx-header'), 'legacy');
  assert.equal(classifySelector(snap, 'button'), 'raw');
  assert.equal(classifySelector(snap, 'app-results'), 'custom');
});

test('validate rejects a malformed snapshot', () => {
  assert.throws(() => validate({ schemaVersion: '1.0' }), /tokens\.color/);
  assert.throws(() => validate(null), /not an object/);
});
