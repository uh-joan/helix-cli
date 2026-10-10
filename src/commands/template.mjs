import { EXIT } from '../exit-codes.mjs';
import { loadSnapshot, listTemplates, getTemplate, templateStep, TEMPLATE_STEPS } from '../snapshot/load.mjs';

const STEPS = [...TEMPLATE_STEPS, 'all'];

export default async function template(argv) {
  const snap = loadSnapshot();
  const [sub, ...rest] = argv;

  if (!sub || sub === 'list') {
    const tpls = listTemplates(snap);
    process.stdout.write(`helix templates (${tpls.length}):\n`);
    for (const t of tpls) {
      process.stdout.write(`  ${t.slug}  —  ${t.displayName}${t.status ? ` (${t.status})` : ''}\n`);
    }
    process.stdout.write(`\nhelix template get <slug> [--step ${STEPS.join('|')}]\n`);
    return EXIT.OK;
  }

  if (sub === 'get') {
    let step = 'overview';
    let json = false;
    let slug = null;
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '--step') step = rest[++i];
      else if (rest[i] === '--json') json = true;
      else if (!rest[i].startsWith('-')) slug = rest[i];
    }
    if (!slug) {
      process.stderr.write('helix template get <slug> [--step ...]\n');
      return EXIT.USAGE;
    }
    const guide = getTemplate(snap, slug);
    if (!guide) {
      const near = listTemplates(snap).map((t) => t.slug).filter((s) => s.includes(slug) || slug.includes(s));
      process.stderr.write(`helix template: unknown '${slug}'.` + (near.length ? ` Did you mean: ${near.join(', ')}?` : ` Run 'helix template list'.`) + '\n');
      return EXIT.USAGE;
    }
    if (!STEPS.includes(step)) {
      process.stderr.write(`helix template: unknown step '${step}' (${STEPS.join('|')}).\n`);
      return EXIT.USAGE;
    }
    const body = templateStep(guide, step);
    if (json) {
      process.stdout.write(JSON.stringify({ slug: guide.slug, displayName: guide.displayName, status: guide.status, step, body }, null, 2) + '\n');
    } else {
      process.stdout.write(body + '\n');
      if (step !== 'all') {
        const next = STEPS[STEPS.indexOf(step) + 1];
        if (next && next !== 'all') process.stdout.write(`\n— next: helix template get ${guide.slug} --step ${next}\n`);
      }
    }
    return EXIT.OK;
  }

  process.stderr.write(`helix template: unknown subcommand '${sub}' (list|get).\n`);
  return EXIT.USAGE;
}
