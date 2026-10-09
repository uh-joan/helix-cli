#!/usr/bin/env node
// Generate the Phase 0 bundled snapshot from the vendored Helix Angular tokens.
// Exposed semantic tokens surface at runtime as --hlx-*; primitives (color-*,
// ref-*) and component-internals (components-*) are NOT exposed, so helix fix
// must target only the exposed set. This computes that flag by the naming rule.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = new URL('../fixtures/artifact/tokens.json', import.meta.url);
const OUT = new URL('../src/snapshot/helix-snapshot.json', import.meta.url);

const raw = JSON.parse(readFileSync(SRC));

// --- exposure rule -------------------------------------------------------
const NOT_EXPOSED_PREFIX = ['color-', 'ref-', 'components-', '$'];
const isExposed = (name) => !NOT_EXPOSED_PREFIX.some((p) => name.startsWith(p));

// --- alias resolution ( "{other-token}" -> hex ) -------------------------
function buildColorIndex(tokens) {
  const idx = new Map();
  for (const t of tokens) idx.set(t.name, t.value);
  return idx;
}
function resolve(value, idx, seen = new Set()) {
  const m = typeof value === 'string' && value.match(/^\{(.+)\}$/);
  if (!m) return value;
  const target = m[1];
  if (seen.has(target) || !idx.has(target)) return value; // unresolved alias: leave raw
  seen.add(target);
  return resolve(idx.get(target), idx, seen);
}

function mapFamily(tokens, { color = false } = {}) {
  const idx = color ? buildColorIndex(tokens) : null;
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

// Component / template manifest (names only in Phase 0; full manifest later).
const TEMPLATES = [
  'AiAssistant', 'AiChatHistory', 'AiEntryPoints', 'AiGenerateField', 'AiGenerationTrace',
  'AiInlineActions', 'AiPromptStarters', 'AiSources', 'AiUsageLimits', 'AppShell', 'Charts',
  'DataGrid', 'Dialog', 'EntityDetail', 'ErrorPages', 'Export', 'Filters', 'Forms',
  'ListWithFilters', 'PageStates', 'Sidebar',
];
const COMPONENTS = [
  'AiAvatar', 'AiButton', 'Autocomplete', 'Badge', 'Breadcrumbs', 'Button', 'ButtonToggle',
  'Card', 'Checkbox', 'Chip', 'DataGrid', 'DatePicker', 'Dialog', 'Divider', 'EmptyState',
  'ExpansionPanel', 'Fab', 'Footer', 'FormField', 'Header', 'Highcharts', 'Hyperlink', 'Icon',
  'IconButton', 'List', 'Menu', 'Notification', 'Paginator', 'ProgressBar', 'ProgressSpinner',
  'RadioButton', 'RichTooltip', 'Select', 'Sidenav', 'SkeletonLoader', 'SlideToggle', 'Slider',
  'Snackbar', 'SortHeader', 'Stepper', 'Table', 'Tabs', 'TextArea', 'TextInput', 'TimePicker',
  'Toolbar', 'Tooltip', 'Tree',
];

const snapshot = {
  schemaVersion: '1.0',
  source: {
    artifact: 'helix-angular',
    generatedFrom: 'fixtures/artifact/tokens.json',
    note: 'Phase 0 fixture snapshot; real artifact->snapshot export replaces this later.',
  },
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
  },
  templates: TEMPLATES,
  components: COMPONENTS,
};

mkdirSync(new URL('../src/snapshot/', import.meta.url), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
process.stdout.write(
  `snapshot written: ${color.length} color (${snapshot.counts.colorExposed} exposed), ` +
    `${spacing.length} spacing, ${radius.length} radius, ${shadow.length} shadow; ` +
    `${TEMPLATES.length} templates, ${COMPONENTS.length} components\n`,
);
