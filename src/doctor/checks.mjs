// helix doctor checks. Each returns { id, status, message, fix? } where status
// is 'pass' | 'warn' | 'fail' | 'info'. A 'fail' is an environment failure and
// drives exit code 3; 'warn'/'info' never fail the gate on their own.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

export function readPackageJson(dir) {
  const p = join(dir, 'package.json');
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

export function allDeps(pkg) {
  if (!pkg) return {};
  return { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
}

function collectText(dir, exts = ['.html', '.scss', '.css', '.ts'], acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) collectText(p, exts, acc);
    else if (exts.includes(extname(e.name))) {
      try {
        acc.push(readFileSync(p, 'utf8'));
      } catch {
        /* ignore */
      }
    }
  }
  return acc;
}

export function runChecks(projectDir, snap, { offline = false } = {}) {
  const pkg = readPackageJson(projectDir);
  const deps = allDeps(pkg);
  const depNames = Object.keys(deps);
  const hlxDeps = depNames.filter((n) => n.startsWith('@hlx/'));
  const cdxDeps = depNames.filter((n) => n.startsWith('@cdx/'));
  const text = collectText(projectDir).join('\n');

  const checks = [];

  // env: a Helix design system (new or legacy) must be installed
  checks.push(
    hlxDeps.length || cdxDeps.length
      ? { id: 'design-system-present', status: 'pass', message: `Helix packages: ${[...hlxDeps, ...cdxDeps].join(', ') || 'none'}` }
      : { id: 'design-system-present', status: 'fail', message: 'No @hlx/* or @cdx/* packages in package.json.', fix: 'Install @hlx/theme-angular-material.' },
  );

  // env: the Helix theme class must be applied
  const hasTheme = /helix-theme-material|hlx-theme/.test(text);
  checks.push(
    hasTheme
      ? { id: 'theme-class', status: 'pass', message: 'Helix theme class present.' }
      : { id: 'theme-class', status: 'fail', message: 'Helix theme class (helix-theme-material) not found.', fix: 'Add the theme class to the app root.' },
  );

  // warn: .npmrc should map the scope to the registry
  const npmrc = existsSync(join(projectDir, '.npmrc')) ? readFileSync(join(projectDir, '.npmrc'), 'utf8') : '';
  const mapsScope = /@hlx:registry=|@cdx:registry=/.test(npmrc);
  checks.push(
    mapsScope
      ? { id: 'npmrc-scope', status: 'pass', message: '.npmrc maps the Helix scope.' }
      : { id: 'npmrc-scope', status: 'warn', message: '.npmrc does not map @hlx to a registry.', fix: 'Add "@hlx:registry=<artifactory url>".' },
  );

  // warn: brand fonts should be wired in
  checks.push(
    /Source Sans|clarivate-font|Clarivate/i.test(text)
      ? { id: 'fonts', status: 'pass', message: 'Brand fonts referenced.' }
      : { id: 'fonts', status: 'warn', message: 'Brand fonts (Source Sans 3 / Clarivate) not referenced.' },
  );

  // warn (flag): legacy @cdx present during the break to @hlx
  if (cdxDeps.length) {
    checks.push({
      id: 'legacy-cdx',
      status: 'warn',
      message: `Legacy @cdx packages present: ${cdxDeps.join(', ')}. Migrate to @hlx.`,
      fix: 'helix migrate (scope codemod).',
    });
  } else {
    checks.push({ id: 'legacy-cdx', status: 'pass', message: 'No legacy @cdx packages.' });
  }

  // info: runtime node
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  checks.push({
    id: 'node-version',
    status: nodeMajor >= 20 ? 'pass' : 'warn',
    message: `Node ${process.versions.node}`,
  });

  // info: snapshot<->installed-package reconciliation (needs installed packages)
  const themePkg = join(projectDir, 'node_modules', '@hlx', 'theme-angular-material');
  checks.push(
    existsSync(themePkg)
      ? reconcile(themePkg, snap)
      : { id: 'snapshot-reconcile', status: 'info', message: 'Installed @hlx packages not found; reconciliation skipped.' },
  );

  if (offline) checks.push({ id: 'offline', status: 'info', message: 'Offline: registry reachability not checked.' });

  return checks;
}

function reconcile(themePkgDir, snap) {
  // Phase 0: a placeholder that confirms the snapshot has exposed tokens to
  // reconcile against. Real token extraction from the package lands with N3-real.
  const exposed = snap.tokens.color.filter((t) => t.exposed).length;
  return { id: 'snapshot-reconcile', status: 'info', message: `Package found; ${exposed} exposed tokens to reconcile (extraction TODO).` };
}

export function summarize(checks) {
  const summary = { pass: 0, warn: 0, fail: 0, info: 0 };
  for (const c of checks) summary[c.status]++;
  return summary;
}
