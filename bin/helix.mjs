#!/usr/bin/env node
import { run } from '../src/cli.mjs';

run(process.argv.slice(2))
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write(`helix: ${err?.stack ?? err}\n`);
    process.exit(2);
  });
