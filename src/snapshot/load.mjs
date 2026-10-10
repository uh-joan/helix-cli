// Loads the bundled snapshot (no network) and exposes the queries the scanner
// needs: the exposed-token set and selector classification.
import { readFileSync } from 'node:fs';

const DEFAULT = new URL('./helix-snapshot.json', import.meta.url);

export function loadSnapshot(url = DEFAULT) {
  const snap = JSON.parse(readFileSync(url));
  validate(snap);
  return snap;
}

export function validate(snap) {
  const fail = (m) => {
    throw new Error(`invalid snapshot: ${m}`);
  };
  if (!snap || typeof snap !== 'object') fail('not an object');
  if (typeof snap.schemaVersion !== 'string') fail('missing schemaVersion');
  if (!snap.tokens || !Array.isArray(snap.tokens.color)) fail('tokens.color must be an array');
  for (const t of snap.tokens.color) {
    if (typeof t.name !== 'string' || typeof t.exposed !== 'boolean') fail(`bad color token ${t?.name}`);
  }
  const c = snap.classification;
  if (!c || !Array.isArray(c.compliantPrefixes) || !Array.isArray(c.legacyPrefixes)) {
    fail('classification prefixes missing');
  }
  return true;
}

export function exposedColorTokens(snap) {
  return snap.tokens.color.filter((t) => t.exposed);
}

export function isExposedToken(snap, name) {
  const t = snap.tokens.color.find((x) => x.name === name);
  return Boolean(t && t.exposed);
}

export const TEMPLATE_STEPS = ['overview', 'anatomy', 'rules', 'uses'];

export function listTemplates(snap) {
  return snap.templates ?? [];
}
export function getTemplate(snap, slug) {
  return (snap.templateGuides || {})[slug] || null;
}
export function templateStep(guide, step) {
  if (step === 'all') return guide.raw;
  return guide.steps?.[step] ?? null;
}
export function listComponents(snap) {
  return snap.components ?? [];
}
export function getComponent(snap, q) {
  const g = snap.componentGuides || {};
  const lc = String(q).toLowerCase();
  for (const k of Object.keys(g)) if (k.toLowerCase() === lc) return g[k];
  for (const k of Object.keys(g)) if ((g[k].selector || '').toLowerCase() === lc) return g[k];
  return null;
}

// Classify an element tag/selector into one adoption bucket.
export function classifySelector(snap, tag) {
  const t = String(tag).toLowerCase();
  const { compliantPrefixes, themedPrefixes, legacyPrefixes, rawEquivalents } = snap.classification;
  if (compliantPrefixes.some((p) => t.startsWith(p))) return 'helix';
  if (themedPrefixes.some((p) => t.startsWith(p))) return 'themed';
  if (legacyPrefixes.some((p) => t.startsWith(p))) return 'legacy';
  if (rawEquivalents.includes(t)) return 'raw';
  return 'custom';
}
