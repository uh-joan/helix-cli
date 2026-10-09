import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadSnapshot } from '../src/snapshot/load.mjs';
import { scanTemplateString, scanTemplateDir, coverage, extractInlineTemplates } from '../src/scan/template-scan.mjs';

const snap = loadSnapshot();
const APP = fileURLToPath(new URL('../fixtures/apps/sample/', import.meta.url));

test('classifies a template incl. control flow and legacy cdx-*', () => {
  const html = `<div><cdx-header></cdx-header><hlx-card><button>x</button><mat-button>m</mat-button></hlx-card>` +
    `@if (x) { <mat-spinner></mat-spinner> } @else { <input/> <app-thing></app-thing> }</div>`;
  const { counts } = scanTemplateString(snap, html, 'r.html');
  assert.deepEqual(counts, { helix: 1, themed: 2, raw: 2, custom: 2, legacy: 1 });
  assert.equal(coverage(counts).toFixed(2), '0.60');
});

test('inline template extraction', () => {
  const ts = 'x; template: `<hlx-button></hlx-button>` ; y';
  assert.deepEqual(extractInlineTemplates(ts), ['<hlx-button></hlx-button>']);
});

test('scans a directory (external + inline templates)', () => {
  const { counts, coverage: cov, findings } = scanTemplateDir(snap, APP);
  // html: helix1 themed2 raw2 custom2 legacy1 ; ts: helix1 legacy1
  assert.deepEqual(counts, { helix: 2, themed: 2, raw: 2, custom: 2, legacy: 2 });
  assert.equal(cov.toFixed(4), '0.6667');
  assert.equal(findings.filter((f) => f.ruleId === 'helix/migration/legacy-cdx-selector').length, 2);
  assert.ok(findings.every((f) => f.location.file && f.location.line > 0));
});
