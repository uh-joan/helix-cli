import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot } from '../snapshot/load.mjs';
import { scanTemplateDir } from '../scan/template-scan.mjs';
import { scanStyleDir } from '../scan/style-scan.mjs';
import { createReport, decideScanExit, toText } from '../report/report.mjs';
import { toSarif } from '../report/sarif.mjs';
import { loadBaseline, writeBaseline, mergePerFile, compareBaseline } from '../scan/baseline.mjs';

const VERSION = '0.0.0';

function parseArgs(argv) {
  const opts = { path: '.', format: 'text', baseline: null, failOn: 'regression', updateBaseline: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--format') opts.format = argv[++i];
    else if (a === '--baseline') opts.baseline = argv[++i];
    else if (a === '--fail-on') opts.failOn = argv[++i];
    else if (a === '--update-baseline') opts.updateBaseline = true;
    else if (!a.startsWith('-')) opts.path = a;
  }
  return opts;
}

// Pure: build the report from scan results. Reused by tests without I/O.
export function buildScanReport({ snap, templates, styles, baseline, project = {} }) {
  const summary = {
    templateElements: {
      helix: templates.counts.helix,
      materialThemed: templates.counts.themed,
      rawEquivalent: templates.counts.raw,
      custom: templates.counts.custom,
    },
    helixCoverage: templates.coverage,
    styleDebt: { ...styles.counts },
    legacyCdx: { selectors: templates.counts.legacy },
    disablesWithoutReason: styles.counts.disablesWithoutReason,
  };
  return createReport({
    tool: { name: 'helix', version: VERSION },
    snapshot: { artifact: snap.source?.artifact ?? 'helix-angular', version: VERSION, reconciled: false },
    project: { root: '.', hlxVersion: null, helixMajor: null, ...project },
    summary,
    baseline,
    findings: [...templates.findings, ...styles.findings],
  });
}

export default async function scan(argv) {
  const opts = parseArgs(argv);
  let snap;
  try {
    snap = loadSnapshot();
  } catch (e) {
    process.stderr.write(`helix scan: ${e.message}\n`);
    return EXIT.USAGE;
  }

  const templates = scanTemplateDir(snap, opts.path);
  const styles = scanStyleDir(snap, opts.path);
  const perFile = mergePerFile(templates.perFile, styles.perFile);

  if (opts.updateBaseline && opts.baseline) {
    writeBaseline(opts.baseline, perFile);
    process.stderr.write(`helix scan: baseline written to ${opts.baseline}\n`);
    return EXIT.OK;
  }

  let baseline = null;
  if (opts.baseline) {
    const loaded = loadBaseline(opts.baseline);
    baseline = { file: opts.baseline, ...compareBaseline(perFile, loaded) };
  }

  const report = buildScanReport({ snap, templates, styles, baseline });

  if (opts.format === 'json') process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  else if (opts.format === 'sarif') process.stdout.write(JSON.stringify(toSarif(report), null, 2) + '\n');
  else process.stdout.write(toText(report) + '\n');

  return decideScanExit(report, opts.failOn);
}
