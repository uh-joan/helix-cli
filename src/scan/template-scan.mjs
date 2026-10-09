// Template scanner — uses the real Angular compiler (not regex) to classify
// every element into Helix / Material-themed / raw-equivalent / custom, count
// coverage, and flag legacy cdx-* for the @cdx->@hlx migration.
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { parseTemplate } from '@angular/compiler';
import { classifySelector } from '../snapshot/load.mjs';

const CHILD_ARRAY_KEYS = ['children', 'branches', 'cases'];
const CHILD_BLOCK_KEYS = ['empty', 'placeholder', 'loading', 'error'];

function childrenOf(node) {
  const out = [];
  for (const k of CHILD_ARRAY_KEYS) {
    const v = node[k];
    if (!Array.isArray(v)) continue;
    if (k === 'children') out.push(...v);
    else for (const b of v) if (Array.isArray(b?.children)) out.push(...b.children);
  }
  for (const k of CHILD_BLOCK_KEYS) {
    const v = node[k];
    if (v && Array.isArray(v.children)) out.push(...v.children);
  }
  return out;
}

const isElement = (n) => typeof n?.name === 'string' && Array.isArray(n?.attributes);

export function scanTemplateString(snap, text, file = 'inline.html') {
  const counts = { helix: 0, themed: 0, raw: 0, custom: 0, legacy: 0 };
  const findings = [];
  let parsed;
  try {
    parsed = parseTemplate(text, file);
  } catch {
    return { counts, findings, parseError: true };
  }

  const visit = (nodes) => {
    for (const n of nodes ?? []) {
      if (isElement(n)) {
        const bucket = classifySelector(snap, n.name);
        if (bucket === 'legacy') {
          counts.legacy++;
          findings.push({
            ruleId: 'helix/migration/legacy-cdx-selector',
            category: 'migration',
            severity: 'warn',
            location: { file, line: (n.startSourceSpan?.start?.line ?? 0) + 1, column: (n.startSourceSpan?.start?.col ?? 0) + 1 },
            message: `Legacy <${n.name}>; migrate to the hlx- equivalent.`,
          });
        } else {
          counts[bucket]++;
        }
      }
      visit(childrenOf(n));
    }
  };
  visit(parsed.nodes);
  return { counts, findings };
}

// Inline templates in component .ts files (template: `...`).
export function extractInlineTemplates(tsText) {
  const out = [];
  const re = /template\s*:\s*`([\s\S]*?)`/g;
  let m;
  while ((m = re.exec(tsText))) out.push(m[1]);
  return out;
}

export function coverage(counts) {
  const denom = counts.helix + counts.themed + counts.raw;
  return denom === 0 ? null : (counts.helix + counts.themed) / denom;
}

function walk(dir, exts, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.includes(extname(e.name))) acc.push(p);
  }
  return acc;
}

export function scanTemplateDir(snap, dir) {
  const counts = { helix: 0, themed: 0, raw: 0, custom: 0, legacy: 0 };
  const findings = [];
  const perFile = {}; // relative path -> legacy (migration) count
  const add = (f, r) => {
    for (const k of Object.keys(counts)) counts[k] += r.counts[k];
    findings.push(...r.findings);
    const rel = relative(dir, f);
    perFile[rel] = (perFile[rel] ?? 0) + r.counts.legacy;
  };
  for (const f of walk(dir, ['.html'])) add(f, scanTemplateString(snap, readFileSync(f, 'utf8'), f));
  for (const f of walk(dir, ['.ts'])) {
    const ts = readFileSync(f, 'utf8');
    for (const tpl of extractInlineTemplates(ts)) add(f, scanTemplateString(snap, tpl, f));
  }
  return { counts, coverage: coverage(counts), findings, perFile };
}
