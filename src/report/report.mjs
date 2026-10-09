// The versioned scan report: one shape read by people and agents. See the
// example in docs/proposal.md. Also the scan exit-code decision.
import { EXIT } from '../exit-codes.mjs';

export const REPORT_SCHEMA_VERSION = '1.0';

export function createReport({ tool, snapshot, project, summary, baseline = null, findings = [] }) {
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    tool,
    snapshot,
    project,
    summary,
    baseline,
    findings,
  };
}

export function validateReport(r) {
  const fail = (m) => {
    throw new Error(`invalid report: ${m}`);
  };
  if (!r || typeof r !== 'object') fail('not an object');
  if (r.schemaVersion !== REPORT_SCHEMA_VERSION) fail('schemaVersion mismatch');
  if (!r.tool?.name) fail('tool.name missing');
  if (!r.summary || typeof r.summary !== 'object') fail('summary missing');
  if (!Array.isArray(r.findings)) fail('findings must be an array');
  for (const f of r.findings) {
    if (!f.ruleId || !f.location?.file) fail(`finding missing ruleId/location (${f.ruleId})`);
  }
  return true;
}

export function hasViolations(r) {
  return r.findings.length > 0;
}

// Fixed exit codes (contract): scan never returns ENV (that is doctor's).
export function decideScanExit(r, failOn = 'regression') {
  if (failOn === 'none') return EXIT.OK;
  if (failOn === 'any') return hasViolations(r) ? EXIT.VIOLATIONS : EXIT.OK;
  // default: regression against baseline
  return (r.baseline?.regressions ?? 0) > 0 ? EXIT.REGRESSION : EXIT.OK;
}

export function toText(r) {
  const s = r.summary;
  const lines = [
    `helix scan — ${r.project?.root ?? '.'}`,
    `coverage: ${fmtPct(s.helixCoverage)}  findings: ${r.findings.length}`,
  ];
  if (s.styleDebt) {
    lines.push(
      `debt: color ${s.styleDebt.hardcodedColor ?? 0}, mat-overrides ${s.styleDebt.materialInternalOverride ?? 0}, ng-deep ${s.styleDebt.ngDeep ?? 0}, !important ${s.styleDebt.important ?? 0}`,
    );
  }
  if (s.legacyCdx) {
    lines.push(`legacy @cdx: imports ${s.legacyCdx.imports ?? 0}, selectors ${s.legacyCdx.selectors ?? 0}`);
  }
  if (r.baseline) {
    lines.push(`baseline: regressions ${r.baseline.regressions}, improvements ${r.baseline.improvements}`);
  }
  return lines.join('\n');
}

function fmtPct(n) {
  return typeof n === 'number' ? `${Math.round(n * 100)}%` : 'n/a';
}
