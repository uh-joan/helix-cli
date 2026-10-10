import { join } from 'node:path';
import { EXIT } from '../exit-codes.mjs';
import { upsertBlock, hasBlock } from '../agent/block.mjs';

const CLIENT_FILES = {
  claude: ['CLAUDE.md'],
  codex: ['AGENTS.md'],
  cursor: ['AGENTS.md'],
  copilot: ['.github/copilot-instructions.md'],
  all: ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md'],
};

function parseArgs(argv) {
  const opts = { path: '.', client: 'all', check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--client') opts.client = argv[++i];
    else if (a === '--check') opts.check = true;
    else if (!a.startsWith('-')) opts.path = a;
  }
  return opts;
}

export default async function agent(argv) {
  const [sub, ...rest] = argv;
  if (sub !== 'setup' && sub !== 'sync') {
    process.stderr.write(`helix agent: unknown subcommand '${sub ?? ''}' (setup).\n`);
    return EXIT.USAGE;
  }
  const opts = parseArgs(rest);
  const files = CLIENT_FILES[opts.client];
  if (!files) {
    process.stderr.write(`helix agent: unknown client '${opts.client}' (${Object.keys(CLIENT_FILES).join('|')}).\n`);
    return EXIT.USAGE;
  }

  if (opts.check) {
    let missing = 0;
    for (const f of files) {
      const p = join(opts.path, f);
      const present = hasBlock(p);
      if (!present) missing++;
      process.stdout.write(`  [${present ? 'ok  ' : 'MISS'}] ${f}\n`);
    }
    return missing ? EXIT.VIOLATIONS : EXIT.OK;
  }

  for (const f of files) {
    const r = upsertBlock(join(opts.path, f));
    process.stdout.write(`  ${r.action}: ${f}\n`);
  }
  process.stdout.write(`helix agent: wrote the managed Helix block to ${files.length} file(s) in ${opts.path}.\n`);
  return EXIT.OK;
}
