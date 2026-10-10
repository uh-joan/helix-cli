// The managed Helix guidance block written into agent config files. Delimited
// so `helix agent setup` can update it in place without touching the rest.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const BEGIN = '<!-- helix:begin -->';
export const END = '<!-- helix:end -->';

export const BLOCK = `${BEGIN}
## Helix design system — agent guidance (managed by \`helix agent setup\`)

This app uses the Helix design system (\`@hlx/*\`, Angular + Material 3). Use the Helix CLI:

- \`helix scan\` — adoption + debt metrics; \`helix doctor\` — setup health.
- \`helix template list\` then \`helix template get <slug> --step <overview|anatomy|rules|uses>\` — the pattern to build (e.g. \`ai-assistant\`, \`page-states\`, \`list-with-filters\`).
- \`helix component get <name>\` — component usage; \`helix rules <file>\` — rules for a file.
- \`helix fix color --write\` — replace a hard-coded colour with the nearest \`--hlx-*\` token.

Rules:
- Use Helix / themed-Material components (\`hlx-*\`, \`mat-*\`), not raw \`<button>\`/\`<input>\` where a component exists.
- Consume semantic tokens as \`--hlx-*\` custom properties; never hard-code hex or use primitives (\`color-*\`, \`components-*\`).
- Legacy \`@cdx/*\` imports and \`cdx-*\` selectors are debt — migrate to \`@hlx/*\`.
- **The task is not done until \`helix verify --changed-since <base>\` exits 0.**
${END}`;

export function hasBlock(file) {
  return existsSync(file) && readFileSync(file, 'utf8').includes(BEGIN);
}

// Insert or replace the managed block; leave the rest of the file untouched.
export function upsertBlock(file) {
  let existed = existsSync(file);
  let text = existed ? readFileSync(file, 'utf8') : '';
  const had = text.includes(BEGIN);
  if (had) {
    const start = text.indexOf(BEGIN);
    const end = text.indexOf(END);
    const after = end >= 0 ? text.slice(end + END.length) : '';
    text = text.slice(0, start) + BLOCK + after;
  } else {
    text = (text.trim() ? text.replace(/\s*$/, '') + '\n\n' : '') + BLOCK + '\n';
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  return { file, action: had ? 'updated' : existed ? 'appended' : 'created' };
}
