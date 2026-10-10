import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot, listComponents, getComponent } from '../snapshot/load.mjs';

export default async function component(argv) {
  const snap = loadSnapshot();
  const [sub, ...rest] = argv;
  const names = listComponents(snap);

  if (!sub || sub === 'list') {
    process.stdout.write(`helix components (${names.length}):\n`);
    for (const c of names) {
      process.stdout.write(`  ${c.name}  (${c.selector})  —  ${(c.summary || '').slice(0, 72)}\n`);
    }
    process.stdout.write(`\nhelix component get <name|selector> [--json]\n`);
    return EXIT.OK;
  }

  if (sub === 'get') {
    const q = rest.find((a) => !a.startsWith('-'));
    const json = rest.includes('--json');
    if (!q) {
      process.stderr.write('helix component get <name|selector>\n');
      return EXIT.USAGE;
    }
    const comp = getComponent(snap, q);
    if (!comp) {
      const near = names.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).map((c) => c.name);
      process.stderr.write(`helix component: unknown '${q}'.` + (near.length ? ` Did you mean: ${near.join(', ')}?` : ` Run 'helix component list'.`) + '\n');
      return EXIT.USAGE;
    }
    if (json) {
      process.stdout.write(JSON.stringify({ name: comp.name, displayName: comp.displayName, selector: comp.selector, summary: comp.summary, body: comp.raw }, null, 2) + '\n');
    } else {
      process.stdout.write(comp.raw + '\n');
    }
    return EXIT.OK;
  }

  process.stderr.write(`helix component: unknown subcommand '${sub}' (list|get).\n`);
  return EXIT.USAGE;
}
