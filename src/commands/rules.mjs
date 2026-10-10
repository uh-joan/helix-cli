import { existsSync, readFileSync } from 'node:fs';
import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot, getTemplate, listTemplates } from '../snapshot/load.mjs';

// Heuristics: given a file, which templates' rules are relevant to what it builds.
const HINTS = [
  { slug: 'page-states', re: /mat-progress-spinner|spinner|skeleton|empty-state|@if\s*\(\s*loading/i },
  { slug: 'ai-assistant', re: /aria-live|chat|message|assistant|hlx-ai-avatar|hlx-btn-ai/i },
  { slug: 'list-with-filters', re: /mat-chip-row|matChipRemove|filter/i },
  { slug: 'form-layout', re: /formGroup|mat-form-field|formControl/i },
  { slug: 'data-grid-wrapper', re: /ag-grid|agGrid|helixGridTheme/i },
  { slug: 'charts', re: /highcharts|styledMode/i },
];

export default async function rules(argv) {
  const snap = loadSnapshot();
  const arg = argv.find((a) => !a.startsWith('-'));
  const json = argv.includes('--json');
  if (!arg) {
    process.stderr.write('helix rules <template-slug | file>\n');
    return EXIT.USAGE;
  }

  // direct slug
  let matches = [];
  const direct = getTemplate(snap, arg);
  if (direct) {
    matches = [direct];
  } else if (existsSync(arg)) {
    const text = readFileSync(arg, 'utf8');
    matches = HINTS.filter((h) => h.re.test(text)).map((h) => getTemplate(snap, h.slug)).filter(Boolean);
    if (!matches.length) {
      process.stdout.write(`helix rules: no template rules matched ${arg}. Run 'helix template list'.\n`);
      return EXIT.OK;
    }
  } else {
    const near = listTemplates(snap).map((t) => t.slug).filter((s) => s.includes(arg));
    process.stderr.write(`helix rules: '${arg}' is not a template slug or a file.` + (near.length ? ` Did you mean: ${near.join(', ')}?` : '') + '\n');
    return EXIT.USAGE;
  }

  if (json) {
    process.stdout.write(JSON.stringify(matches.map((m) => ({ slug: m.slug, rules: m.steps.rules })), null, 2) + '\n');
  } else {
    for (const m of matches) {
      process.stdout.write(`## ${m.displayName} — rules\n\n${m.steps.rules}\n\n`);
    }
  }
  return EXIT.OK;
}
