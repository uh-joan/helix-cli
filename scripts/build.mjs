#!/usr/bin/env node
// Zero-dependency build gate: syntax-check every source module.
// Real toolchain (tsc) can replace this later without changing the contract.
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dirs = ['bin', 'src', 'scripts'];

const files = [];
for (const dir of dirs) {
  let entries;
  try {
    entries = readdirSync(new URL(`../${dir}/`, import.meta.url), { recursive: true, withFileTypes: true });
  } catch {
    continue;
  }
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.mjs')) {
      files.push(`${e.parentPath}/${e.name}`);
    }
  }
}

let failed = 0;
for (const f of files) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  } catch (err) {
    failed++;
    process.stderr.write(`syntax error: ${f}\n${err.stderr ?? ''}\n`);
  }
}

process.stdout.write(`checked ${files.length} module(s) under ${dirs.join(', ')} (root ${root})\n`);
if (failed > 0) {
  process.stderr.write(`build failed: ${failed} module(s) with errors\n`);
  process.exit(1);
}
process.stdout.write('build ok\n');
