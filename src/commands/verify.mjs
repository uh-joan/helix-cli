// helix verify — the agent gate. Scans the changed files and fails (exit 1) on
// any violation, so "the task is not done until verify exits 0".
import { execFileSync } from 'node:child_process';
import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot } from '../snapshot/load.mjs';
import { scanFiles } from '../scan/scan-files.mjs';

const SCANNABLE = /\.(html|ts|scss|css)$/;

function parseArgs(argv) {
  const opts = { changedSince: null, json: false, files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--changed-since') opts.changedSince = argv[++i];
    else if (a === '--json') opts.json = true;
    else if (!a.startsWith('-')) opts.files.push(a);
  }
  return opts;
}

export function changedFiles(ref, cwd = '.') {
  const out = execFileSync('git', ['diff', '--name-only', ref], { cwd, encoding: 'utf8' });
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

export default async function verify(argv) {
  const opts = parseArgs(argv);
  let snap;
  try {
    snap = loadSnapshot();
  } catch (e) {
    process.stderr.write(`helix verify: ${e.message}\n`);
    return EXIT.USAGE;
  }

  let files = opts.files;
  if (opts.changedSince) {
    try {
      files = changedFiles(opts.changedSince);
    } catch (e) {
      process.stderr.write(`helix verify: git diff failed: ${e.message}\n`);
      return EXIT.USAGE;
    }
  }
  files = files.filter((f) => SCANNABLE.test(f));

  const { findings, scanned } = scanFiles(snap, files);
  const result = { scanned: scanned.length, violations: findings.length, findings };

  if (opts.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else if (findings.length === 0) {
    process.stdout.write(`helix verify: ok — ${scanned.length} changed file(s), 0 violations.\n`);
  } else {
    process.stdout.write(`helix verify: FAIL — ${findings.length} violation(s) in ${scanned.length} changed file(s):\n`);
    for (const f of findings.slice(0, 50)) {
      process.stdout.write(`  ${f.location.file}:${f.location.line} ${f.ruleId} — ${f.message}\n`);
    }
  }
  return findings.length ? EXIT.VIOLATIONS : EXIT.OK;
}
