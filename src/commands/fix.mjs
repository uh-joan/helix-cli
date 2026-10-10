import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot } from '../snapshot/load.mjs';
import { fixColorDir } from '../fix/color.mjs';

function parseArgs(argv) {
  const opts = { category: 'color', path: '.', write: false, minConfidence: 0.8, json: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--write') opts.write = true;
    else if (a === '--dry-run') opts.write = false;
    else if (a === '--json') opts.json = true;
    else if (a === '--min-confidence') opts.minConfidence = Number(argv[++i]);
    else if (!a.startsWith('-')) positional.push(a);
  }
  if (positional[0]) opts.category = positional[0];
  if (positional[1]) opts.path = positional[1];
  return opts;
}

export default async function fix(argv) {
  const opts = parseArgs(argv);
  if (opts.category !== 'color') {
    process.stderr.write(`helix fix: unknown category '${opts.category}' (only 'color' in Phase 1).\n`);
    return EXIT.USAGE;
  }
  let snap;
  try {
    snap = loadSnapshot();
  } catch (e) {
    process.stderr.write(`helix fix: ${e.message}\n`);
    return EXIT.USAGE;
  }

  const r = fixColorDir(snap, opts.path, { minConfidence: opts.minConfidence, write: opts.write });

  if (opts.json) {
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
  } else {
    const mode = opts.write ? 'WRITE' : 'dry-run';
    process.stdout.write(`helix fix color — ${opts.path} (${mode}, min-confidence ${opts.minConfidence})\n`);
    for (const p of r.proposals.slice(0, 50)) {
      const mark = p.applied ? (opts.write ? 'fixed' : 'would') : 'skip ';
      process.stdout.write(`  [${mark}] ${p.file}: ${p.original} -> ${p.replacement}  (ΔE ${p.deltaE}, conf ${p.confidence})\n`);
    }
    if (r.proposals.length > 50) process.stdout.write(`  … ${r.proposals.length - 50} more\n`);
    process.stdout.write(
      `${r.applied} ${opts.write ? 'applied' : 'fixable'}, ${r.belowThreshold} below threshold` +
        (opts.write ? `, ${r.filesChanged} file(s) changed` : '') + '\n',
    );
    if (!opts.write && r.applied) process.stderr.write('dry run — re-run with --write to apply.\n');
  }
  return EXIT.OK;
}
