#!/usr/bin/env node
// Generate the bundled snapshot from the vendored Helix Angular artifact files.
// Tokens: exposure flag (--hlx-*) + alias resolution. Templates: parse each
// vendored README into phased steps so `helix template get <x> --step` can serve
// a slice. This is the real artifact->snapshot export (fixtures/artifact/ is the
// vendored copy of the Claude Design artifact's project/ files).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ART = new URL('../fixtures/artifact/', import.meta.url);
const OUT = new URL('../src/snapshot/helix-snapshot.json', import.meta.url);

const raw = JSON.parse(readFileSync(new URL('tokens.json', ART)));

// --- tokens --------------------------------------------------------------
const NOT_EXPOSED_PREFIX = ['color-', 'ref-', 'components-', '$'];
const isExposed = (name) => !NOT_EXPOSED_PREFIX.some((p) => name.startsWith(p));

function resolve(value, idx, seen = new Set()) {
  const m = typeof value === 'string' && value.match(/^\{(.+)\}$/);
  if (!m) return value;
  const target = m[1];
  if (seen.has(target) || !idx.has(target)) return value;
  seen.add(target);
  return resolve(idx.get(target), idx, seen);
}
function mapFamily(tokens, { color = false } = {}) {
  const idx = color ? new Map(tokens.map((t) => [t.name, t.value])) : null;
  return tokens.map((t) => {
    const resolved = color ? resolve(t.value, idx) : t.value;
    return {
      name: t.name,
      value: resolved,
      ...(resolved !== t.value ? { rawValue: t.value } : {}),
      cssVar: `--hlx-${t.name}`,
      exposed: isExposed(t.name),
      ...(t.usage ? { usage: t.usage } : {}),
    };
  });
}
const color = mapFamily(raw.color?.tokens ?? [], { color: true });
const spacing = mapFamily(raw.spacing?.tokens ?? []);
const radius = mapFamily(raw.radius?.tokens ?? []);
const shadow = mapFamily(raw.shadow?.tokens ?? []);

// --- templates (parsed from vendored READMEs) ----------------------------
const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const firstLine = (re, text) => (text.match(re) || [])[0]?.trim() ?? null;

function parseTemplate(name, text) {
  const displayName = (text.match(/^#\s+(.+)$/m) || [])[1]?.trim() || name;
  const status = (text.match(/Status:\s*\*\*(.+?)\*\*/) || [])[1] || null;
  const parts = text.split(/^##\s+/m);
  const pre = parts[0];
  const sections = {};
  for (const p of parts.slice(1)) {
    const nl = p.indexOf('\n');
    sections[p.slice(0, nl).trim().toLowerCase()] = p.slice(nl + 1).trim();
  }
  const summary =
    pre.split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('#') && !l.startsWith('**')) || '';
  const avoid = firstLine(/^Avoid:.*$/m, text);
  const uses = firstLine(/^Uses:.*$/m, text);
  const related = firstLine(/^Related.*$/m, text);
  const whenAvoid = pre.split('\n').filter((l) => /^\*\*(When to use|Avoid when)\*\*/.test(l.trim())).join('\n');

  const steps = {
    overview: [`# ${displayName}${status ? ` (${status})` : ''}`, '', summary, whenAvoid ? '\n' + whenAvoid : '']
      .filter(Boolean)
      .join('\n'),
    anatomy: sections['anatomy'] || sections['shape'] || '(no explicit anatomy — see rules)',
    rules: [sections['rules'] || '(no explicit rules section)', avoid].filter(Boolean).join('\n\n'),
    uses: [uses, related].filter(Boolean).join('\n') || '(none listed)',
  };
  return { slug: slug(displayName), displayName, status, summary, steps, raw: text.trim() };
}

const compDir = new URL('project/components/', ART);
const templateGuides = {};
const templates = [];
if (existsSync(compDir)) {
  for (const e of readdirSync(compDir, { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith('Template')) continue;
    const readme = join(compDir.pathname, e.name, 'README.md');
    if (!existsSync(readme)) continue;
    const g = parseTemplate(e.name, readFileSync(readme, 'utf8'));
    templateGuides[g.slug] = g;
    templates.push({ slug: g.slug, displayName: g.displayName, status: g.status, summary: g.summary });
  }
}
templates.sort((a, b) => a.slug.localeCompare(b.slug));

const COMPONENTS = [
  'AiAvatar', 'AiButton', 'Autocomplete', 'Badge', 'Breadcrumbs', 'Button', 'ButtonToggle', 'Card', 'Checkbox',
  'Chip', 'DataGrid', 'DatePicker', 'Dialog', 'Divider', 'EmptyState', 'ExpansionPanel', 'Fab', 'Footer',
  'FormField', 'Header', 'Highcharts', 'Hyperlink', 'Icon', 'IconButton', 'List', 'Menu', 'Notification',
  'Paginator', 'ProgressBar', 'ProgressSpinner', 'RadioButton', 'RichTooltip', 'Select', 'Sidenav',
  'SkeletonLoader', 'SlideToggle', 'Slider', 'Snackbar', 'SortHeader', 'Stepper', 'Table', 'Tabs', 'TextArea',
  'TextInput', 'TimePicker', 'Toolbar', 'Tooltip', 'Tree',
];

const snapshot = {
  schemaVersion: '1.1',
  source: { artifact: 'helix-angular', generatedFrom: 'fixtures/artifact/', note: 'Exported from the vendored Helix Angular artifact files.' },
  classification: {
    compliantPrefixes: ['hlx-'],
    themedPrefixes: ['mat-'],
    legacyPrefixes: ['cdx-'],
    rawEquivalents: ['button', 'input', 'select', 'textarea', 'table', 'a'],
  },
  tokens: { color, spacing, radius, shadow },
  counts: {
    color: color.length,
    colorExposed: color.filter((t) => t.exposed).length,
    spacing: spacing.length,
    radius: radius.length,
    shadow: shadow.length,
    templates: templates.length,
  },
  templates,
  templateGuides,
  components: COMPONENTS,
};

mkdirSync(new URL('../src/snapshot/', import.meta.url), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
process.stdout.write(
  `snapshot: ${color.length} color (${snapshot.counts.colorExposed} exposed), ` +
    `${templates.length} templates parsed, ${COMPONENTS.length} components\n`,
);
