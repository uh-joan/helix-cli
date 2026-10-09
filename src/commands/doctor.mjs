import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot } from '../snapshot/load.mjs';
import { runChecks, summarize } from '../doctor/checks.mjs';

const VERSION = '0.0.0';
const ICON = { pass: 'ok  ', warn: 'warn', fail: 'FAIL', info: '--  ' };

function parseArgs(argv) {
  const opts = { path: '.', json: false, fix: false, offline: false };
  for (const a of argv) {
    if (a === '--json') opts.json = true;
    else if (a === '--fix') opts.fix = true;
    else if (a === '--offline') opts.offline = true;
    else if (!a.startsWith('-')) opts.path = a;
  }
  return opts;
}

export function buildDoctorReport(projectDir, snap, opts) {
  const checks = runChecks(projectDir, snap, { offline: opts.offline });
  const summary = summarize(checks);
  return {
    schemaVersion: '1.0',
    tool: { name: 'helix', version: VERSION },
    command: 'doctor',
    project: { root: projectDir },
    checks,
    summary,
    exit: summary.fail > 0 ? EXIT.ENV : EXIT.OK,
  };
}

export default async function doctor(argv) {
  const opts = parseArgs(argv);
  let snap;
  try {
    snap = loadSnapshot();
  } catch (e) {
    process.stderr.write(`helix doctor: ${e.message}\n`);
    return EXIT.USAGE;
  }

  const report = buildDoctorReport(opts.path, snap, opts);

  if (opts.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write(`helix doctor — ${opts.path}\n`);
    for (const c of report.checks) process.stdout.write(`  [${ICON[c.status]}] ${c.id}: ${c.message}\n`);
    process.stdout.write(
      `summary: ${report.summary.pass} ok, ${report.summary.warn} warn, ${report.summary.fail} fail\n`,
    );
    if (opts.fix) {
      const fixable = report.checks.filter((c) => c.fix);
      process.stderr.write(
        fixable.length
          ? `--fix: ${fixable.length} suggestion(s); automatic apply not implemented in Phase 0:\n` +
              fixable.map((c) => `  - ${c.id}: ${c.fix}`).join('\n') + '\n'
          : '--fix: nothing to fix.\n',
      );
    }
  }

  return report.exit;
}
