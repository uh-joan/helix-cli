// Scan an explicit list of files (used by verify). Routes each file to the
// template and style scanners by extension and collects findings.
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { scanTemplateString, extractInlineTemplates } from './template-scan.mjs';
import { scanScssString, scanColorsInCode, scanColorsInMarkup } from './style-scan.mjs';

export function scanFiles(snap, files) {
  const findings = [];
  const scanned = [];
  for (const f of files) {
    let text;
    try {
      text = readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    const ext = extname(f);
    if (ext === '.html') {
      findings.push(...scanTemplateString(snap, text, f).findings, ...scanColorsInMarkup(text, f));
      scanned.push(f);
    } else if (ext === '.ts') {
      for (const t of extractInlineTemplates(text)) findings.push(...scanTemplateString(snap, t, f).findings);
      findings.push(...scanColorsInCode(text, f));
      scanned.push(f);
    } else if (ext === '.scss' || ext === '.css') {
      findings.push(...scanScssString(snap, text, f).findings);
      scanned.push(f);
    }
  }
  return { findings, scanned };
}
