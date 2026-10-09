// Baseline ratchet: per-file debt counts. CI fails only when a file's count
// goes up, so every merge can only improve the numbers (Primer's burn-down).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export const BASELINE_VERSION = 1;

export function loadBaseline(path) {
  if (!existsSync(path)) return null;
  const b = JSON.parse(readFileSync(path, 'utf8'));
  if (b.schemaVersion !== BASELINE_VERSION) throw new Error(`baseline schema mismatch in ${path}`);
  return b;
}

export function makeBaseline(perFile) {
  const files = {};
  for (const [f, n] of Object.entries(perFile)) if (n > 0) files[f] = n;
  return { schemaVersion: BASELINE_VERSION, files };
}

export function writeBaseline(path, perFile) {
  writeFileSync(path, JSON.stringify(makeBaseline(perFile), null, 2) + '\n');
}

// Merge the per-file maps the scanners produced into one debt-per-file map.
export function mergePerFile(...maps) {
  const out = {};
  for (const m of maps) for (const [f, n] of Object.entries(m ?? {})) out[f] = (out[f] ?? 0) + n;
  return out;
}

export function compareBaseline(perFile, baseline) {
  const base = baseline?.files ?? {};
  const keys = new Set([...Object.keys(perFile), ...Object.keys(base)]);
  let regressions = 0;
  let improvements = 0;
  const regressedFiles = [];
  for (const f of keys) {
    const cur = perFile[f] ?? 0;
    const was = base[f] ?? 0;
    if (cur > was) {
      regressions++;
      regressedFiles.push({ file: f, was, now: cur });
    } else if (cur < was) {
      improvements++;
    }
  }
  return { regressions, improvements, regressedFiles };
}
