// SCSS debt scanner (Phase 0: text-based; wraps the Helix Stylelint preset
// later). Counts the Polaris-style categories plus the Helix-specific rules:
// non-semantic token usage and per-app ng-deep that should be hlx-prose.
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
// A hex used as a var() fallback — var(--hlx-x, #hex) — is allowed, not debt.
const HEX_IN_FALLBACK = /var\(\s*--[\w-]+\s*,\s*#(?:[0-9a-fA-F]{3,8})\b/g;
const HLX_VAR = /var\(\s*(--hlx-[\w-]+)\s*\)/g;

export function scanScssString(snap, text, file = 'styles.scss') {
  const exposed = new Set(snap.tokens.color.filter((t) => t.exposed).map((t) => t.cssVar));
  // spacing/radius/shadow are exposed too
  for (const fam of ['spacing', 'radius', 'shadow']) {
    for (const t of snap.tokens[fam] ?? []) exposed.add(t.cssVar);
  }

  const count = (re) => (text.match(re) ?? []).length;

  const hexTotal = count(HEX);
  const hexFallback = count(HEX_IN_FALLBACK);
  const hardcodedColor = Math.max(0, hexTotal - hexFallback);

  // non-semantic: var(--hlx-...) referencing a token that is not exposed
  let nonSemanticToken = 0;
  for (const m of text.matchAll(HLX_VAR)) if (!exposed.has(m[1])) nonSemanticToken++;

  // descriptionless stylelint-disable (no ` -- reason`)
  let disablesWithoutReason = 0;
  for (const line of text.split('\n')) {
    if (line.includes('stylelint-disable') && !line.includes(' -- ')) disablesWithoutReason++;
  }

  const counts = {
    hardcodedColor,
    materialInternalOverride: count(/\.mat-mdc-[\w-]+/g),
    ngDeep: count(/::ng-deep/g),
    important: count(/!important/g),
    nonSemanticToken,
    disablesWithoutReason,
  };

  const findings = [];
  // one finding per hard-coded colour, with the nearest-token fix left for N (fix)
  let idx = 0;
  const lines = text.split('\n');
  lines.forEach((ln, i) => {
    const allowed = new Set([...ln.matchAll(HEX_IN_FALLBACK)].map((m) => m.index));
    for (const m of ln.matchAll(HEX)) {
      // crude overlap check: skip hexes that are part of a var() fallback on this line
      if ([...allowed].some((a) => m.index >= a && m.index <= a + 40)) continue;
      findings.push({
        ruleId: 'helix/color/no-hardcoded',
        category: 'color',
        severity: 'warn',
        location: { file, line: i + 1, column: m.index + 1 },
        message: `Hard-coded ${m[0]}; use a Helix semantic token.`,
      });
      idx++;
    }
  });

  return { counts, findings };
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

export function scanStyleDir(snap, dir) {
  const counts = {
    hardcodedColor: 0,
    materialInternalOverride: 0,
    ngDeep: 0,
    important: 0,
    nonSemanticToken: 0,
    disablesWithoutReason: 0,
  };
  const findings = [];
  const perFile = {}; // relative path -> total style-debt count
  for (const f of walk(dir, ['.scss', '.css'])) {
    const r = scanScssString(snap, readFileSync(f, 'utf8'), f);
    for (const k of Object.keys(counts)) counts[k] += r.counts[k];
    findings.push(...r.findings);
    perFile[relative(dir, f)] = Object.values(r.counts).reduce((a, b) => a + b, 0);
  }
  return { counts, findings, perFile };
}
