// helix fix color — map a hard-coded hex to the nearest exposed semantic token
// by CIEDE2000 ΔE, emitting var(--hlx-<name>, #orig) so the change stays
// reviewable. Dry-run by default; .scss/.css only (safe CSS value context).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { exposedColorTokens } from '../snapshot/load.mjs';
import { hexToLab, ciede2000 } from './ciede2000.mjs';

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const HEX_IN_FALLBACK = /var\(\s*--[\w-]+\s*,\s*#(?:[0-9a-fA-F]{3,8})\b/g;

// ΔE 0 -> confidence 1; ΔE at/above SPAN -> 0. Tunable.
const SPAN = 5;
export const confidenceFromDeltaE = (dE) => Math.max(0, 1 - dE / SPAN);

export function buildPalette(snap) {
  return exposedColorTokens(snap)
    .filter((t) => /^#/.test(String(t.value)))
    .map((t) => ({ name: t.name, cssVar: t.cssVar, value: t.value, lab: hexToLab(t.value) }));
}

export function nearestToken(palette, hex) {
  const lab = hexToLab(hex);
  let best = null;
  for (const t of palette) {
    const dE = ciede2000(lab, t.lab);
    if (!best || dE < best.deltaE) best = { ...t, deltaE: dE };
  }
  return best;
}

// Propose fixes for one CSS/SCSS text. Returns {proposals, fixedText}.
export function proposeColorFixes(palette, text, file, { minConfidence = 0.8 } = {}) {
  const fallback = [...text.matchAll(HEX_IN_FALLBACK)].map((m) => [m.index, m.index + m[0].length]);
  const proposals = [];
  for (const m of text.matchAll(HEX)) {
    if (fallback.some(([a, b]) => m.index >= a && m.index <= b)) continue;
    const near = nearestToken(palette, m[0]);
    if (!near) continue;
    const confidence = confidenceFromDeltaE(near.deltaE);
    proposals.push({
      file,
      index: m.index,
      original: m[0],
      token: near.name,
      replacement: `var(${near.cssVar}, ${m[0]})`,
      deltaE: Number(near.deltaE.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
      applied: confidence >= minConfidence,
    });
  }
  // apply right-to-left so indices stay valid
  let fixedText = text;
  for (const p of [...proposals].filter((p) => p.applied).sort((a, b) => b.index - a.index)) {
    fixedText = fixedText.slice(0, p.index) + p.replacement + fixedText.slice(p.index + p.original.length);
  }
  return { proposals, fixedText };
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

export function fixColorDir(snap, dir, { minConfidence = 0.8, write = false } = {}) {
  const palette = buildPalette(snap);
  const all = [];
  let filesChanged = 0;
  for (const f of walk(dir, ['.scss', '.css'])) {
    const text = readFileSync(f, 'utf8');
    const { proposals, fixedText } = proposeColorFixes(palette, text, relative(dir, f), { minConfidence });
    if (!proposals.length) continue;
    all.push(...proposals);
    if (write && fixedText !== text) {
      writeFileSync(f, fixedText);
      filesChanged++;
    }
  }
  const applied = all.filter((p) => p.applied).length;
  return { proposals: all, applied, belowThreshold: all.length - applied, filesChanged, wrote: write };
}
