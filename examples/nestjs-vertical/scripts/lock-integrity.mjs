/** Deterministic npm lock manifest audit. It does NOT prove npm install or hash authenticity. */
export function inspectLockManifest(manifest, lock) {
  const issues = [];
  const problem = message => issues.push(message);
  if (!manifest || typeof manifest !== 'object') return { valid: false, issues: ['Missing package manifest'] };
  if (!lock || typeof lock !== 'object' || lock.lockfileVersion !== 3 || !lock.packages || typeof lock.packages !== 'object') {
    return { valid: false, issues: ['Expected a complete npm v3 package lock'] };
  }
  const root = lock.packages[''];
  if (!root || typeof root !== 'object') {
    return { valid: false, issues: ['Lockfile root package missing'] };
  }
  if (root.name !== manifest.name || root.version !== manifest.version) problem('Root name/version mismatch');
  for (const section of ['dependencies', 'devDependencies']) {
    const expected = manifest[section] ?? {};
    const actual = root[section] ?? {};
    if (!expected || !actual || typeof expected !== 'object' || typeof actual !== 'object' ||
        Array.isArray(expected) || Array.isArray(actual)) {
      problem(section + ' must be a package map');
      continue;
    }
    const expectedNames = Object.keys(expected).sort();
    const actualNames = Object.keys(actual).sort();
    if (JSON.stringify(expectedNames) !== JSON.stringify(actualNames)) {
      problem('Lockfile root ' + section + ' contains missing or extra packages');
    }
    for (const [name, spec] of Object.entries(expected)) {
      if (actual[name] !== spec) problem('Root lock mismatch for ' + name);
      const packageEntry = lock.packages['node_modules/' + name];
      if (!packageEntry || typeof packageEntry.version !== 'string' || !packageEntry.version) {
        problem('Resolved package missing for ' + name);
        continue;
      }
      if (typeof packageEntry.integrity !== 'string' ||
          !/^sha(?:512|384|256|1)-[A-Za-z0-9+/]+={0,2}$/.test(packageEntry.integrity)) {
        problem('Missing or malformed package integrity for ' + name);
      }
    }
  }
  return { valid: issues.length === 0, issues };
}
