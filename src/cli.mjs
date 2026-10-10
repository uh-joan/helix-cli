// Command router. Contract: input from flags only; JSON→stdout, logs→stderr;
// nothing written without --write; fixed exit codes (see exit-codes.mjs).
import { readFileSync } from 'node:fs';
import { EXIT } from './exit-codes.mjs';
import doctor from './commands/doctor.mjs';
import scan from './commands/scan.mjs';
import fix from './commands/fix.mjs';
import verify from './commands/verify.mjs';
import template from './commands/template.mjs';
import rules from './commands/rules.mjs';
import component from './commands/component.mjs';
import agent from './commands/agent.mjs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const COMMANDS = { doctor, scan, fix, verify, template, rules, component, agent };

const HELP = `helix v${pkg.version}

Usage: helix <command> [options]

Commands:
  doctor            Environment + setup health; snapshot<->package reconciliation
  scan [path]       Adoption + debt metrics over templates, TS and SCSS
  fix color [path]  Hard-coded colour -> nearest --hlx-* token (ΔE). Dry-run by default
  verify            The agent gate: scan changed files, fail on any new violation
  template list|get Serve Helix templates in phases (get <slug> --step overview|anatomy|rules|uses)
  rules <slug|file> Rules relevant to a template or a file
  component list|get Component catalogue (name + selector + guide)
  agent setup       Write the managed Helix block to AGENTS.md / CLAUDE.md / Copilot (--client, --check)

Options:
  -h, --help        Show this help
  -v, --version     Show version

Contract: flags only | JSON->stdout, logs->stderr | nothing written without --write
Exit codes: 0 pass | 1 violations | 2 usage/config | 3 environment | 4 regression`;

export async function run(argv) {
  const args = Array.isArray(argv) ? argv : [];

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    process.stdout.write(HELP + '\n');
    return EXIT.OK;
  }
  if (args.includes('-v') || args.includes('--version')) {
    process.stdout.write(pkg.version + '\n');
    return EXIT.OK;
  }

  const [name, ...rest] = args;
  const cmd = COMMANDS[name];
  if (!cmd) {
    process.stderr.write(`helix: unknown command '${name}'. Run 'helix --help'.\n`);
    return EXIT.USAGE;
  }
  return await cmd(rest);
}
