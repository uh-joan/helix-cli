import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot, listComponents } from '../snapshot/load.mjs';

// Phase 2: component names from the snapshot. Full per-component guideline
// bodies (anatomy/variants/tokens/do-don't) are a follow-up — the composed
// `helix template` guides already carry the usage rules for now.
const toSelector = (name) => 'hlx-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export default async function component(argv) {
  const snap = loadSnapshot();
  const [sub, ...rest] = argv;
  const names = listComponents(snap);

  if (!sub || sub === 'list') {
    process.stdout.write(`helix components (${names.length}):\n`);
    for (const n of names) process.stdout.write(`  ${n}\n`);
    return EXIT.OK;
  }

  if (sub === 'get') {
    const q = rest.find((a) => !a.startsWith('-'));
    const json = rest.includes('--json');
    if (!q) {
      process.stderr.write('helix component get <name>\n');
      return EXIT.USAGE;
    }
    const match = names.find((n) => n.toLowerCase() === q.toLowerCase() || toSelector(n) === q.toLowerCase());
    if (!match) {
      const near = names.filter((n) => n.toLowerCase().includes(q.toLowerCase()));
      process.stderr.write(`helix component: unknown '${q}'.` + (near.length ? ` Did you mean: ${near.join(', ')}?` : '') + '\n');
      return EXIT.USAGE;
    }
    const info = {
      name: match,
      selectorGuess: toSelector(match),
      note: 'Phase 2: name + selector only. Usage rules live in the composed `helix template` guides; full component manifest (variants/tokens/do-don\'t) is a follow-up.',
    };
    if (json) process.stdout.write(JSON.stringify(info, null, 2) + '\n');
    else process.stdout.write(`${info.name}  (${info.selectorGuess})\n${info.note}\n`);
    return EXIT.OK;
  }

  process.stderr.write(`helix component: unknown subcommand '${sub}' (list|get).\n`);
  return EXIT.USAGE;
}
