import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createReport,
  validateReport,
  decideScanExit,
  toText,
} from '../src/report/report.mjs';
import { toSarif, validateSarif } from '../src/report/sarif.mjs';
import { EXIT } from '../src/exit-codes.mjs';

function sample({ findings = [], baseline = null } = {}) {
  return createReport({
    tool: { name: 'helix', version: '0.0.0' },
    snapshot: { artifact: 'helix-angular', version: '0.0.0', reconciled: true },
    project: { root: '.', hlxVersion: null, legacyCdxVersion: '18.3.0', helixMajor: 22 },
    summary: {
      helixCoverage: 0.72,
      styleDebt: { hardcodedColor: 665, materialInternalOverride: 690, ngDeep: 143, important: 88 },
      legacyCdx: { imports: 128, selectors: 8 },
    },
    baseline,
    findings,
  });
}

const finding = {
  ruleId: 'helix/color/no-hardcoded',
  category: 'color',
  severity: 'warn',
  location: { file: 'src/a.scss', line: 42, column: 11 },
  message: 'Hard-coded #2a2b2d; use a Helix semantic token.',
  fix: { kind: 'token', token: 'text-primary', replacement: 'var(--hlx-text-primary, #2a2b2d)' },
  docs: 'https://helix/foundations/color',
};

test('a well-formed report validates', () => {
  assert.doesNotThrow(() => validateReport(sample({ findings: [finding] })));
});

test('validateReport rejects schema/field problems', () => {
  assert.throws(() => validateReport({ schemaVersion: '9' }), /schemaVersion/);
  assert.throws(() => validateReport(sample({ findings: [{ ruleId: 'x' }] })), /location/);
});

test('exit codes: regression default, any, none', () => {
  assert.equal(decideScanExit(sample({ findings: [finding] })), EXIT.OK); // no baseline regressions
  assert.equal(decideScanExit(sample({ baseline: { regressions: 2, improvements: 0 } })), EXIT.REGRESSION);
  assert.equal(decideScanExit(sample({ findings: [finding] }), 'any'), EXIT.VIOLATIONS);
  assert.equal(decideScanExit(sample({ findings: [finding] }), 'none'), EXIT.OK);
});

test('SARIF output is structurally valid and carries the finding', () => {
  const s = toSarif(sample({ findings: [finding] }));
  assert.doesNotThrow(() => validateSarif(s));
  assert.equal(s.runs[0].results[0].ruleId, 'helix/color/no-hardcoded');
  assert.equal(s.runs[0].results[0].level, 'warning');
  assert.equal(s.runs[0].results[0].locations[0].physicalLocation.region.startLine, 42);
});

test('text summary renders coverage and debt', () => {
  const t = toText(sample({ findings: [finding], baseline: { regressions: 0, improvements: 37 } }));
  assert.match(t, /coverage: 72%/);
  assert.match(t, /color 665/);
  assert.match(t, /legacy @cdx/);
});
