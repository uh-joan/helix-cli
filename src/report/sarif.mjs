// Minimal SARIF 2.1.0 emitter so findings load in CI code-scanning views.
const LEVEL = { error: 'error', warn: 'warning', warning: 'warning', info: 'note', note: 'note' };

export function toSarif(report) {
  const rules = new Map();
  const results = report.findings.map((f) => {
    if (!rules.has(f.ruleId)) {
      rules.set(f.ruleId, { id: f.ruleId, ...(f.docs ? { helpUri: f.docs } : {}) });
    }
    return {
      ruleId: f.ruleId,
      level: LEVEL[f.severity] ?? 'warning',
      message: { text: f.message ?? f.ruleId },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: f.location.file },
            region: {
              ...(f.location.line ? { startLine: f.location.line } : {}),
              ...(f.location.column ? { startColumn: f.location.column } : {}),
            },
          },
        },
      ],
    };
  });

  return {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: report.tool?.name ?? 'helix',
            version: report.tool?.version ?? '0.0.0',
            rules: [...rules.values()],
          },
        },
        results,
      },
    ],
  };
}

// Structural check for the fields any SARIF consumer requires.
export function validateSarif(s) {
  const fail = (m) => {
    throw new Error(`invalid SARIF: ${m}`);
  };
  if (s?.version !== '2.1.0') fail('version must be 2.1.0');
  if (!Array.isArray(s.runs) || s.runs.length === 0) fail('runs missing');
  if (!s.runs[0].tool?.driver?.name) fail('tool.driver.name missing');
  if (!Array.isArray(s.runs[0].results)) fail('results must be an array');
  return true;
}
