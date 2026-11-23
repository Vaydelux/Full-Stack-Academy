/** Enforce the release acceptance toolchain, without restricting ordinary authoring. */
export function requireReleaseNodeRuntime(version, requiredMajor = 24) {
  const match = /^v(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?$/.exec(version ?? '');
  if (!match || !Number.isSafeInteger(requiredMajor) || requiredMajor < 1) {
    throw new Error('Invalid Node release-runtime requirement');
  }
  const actualMajor = Number(match[1]);
  if (actualMajor !== requiredMajor) {
    throw new Error('Offline release gate requires Node.js ' + requiredMajor +
      '.x; detected ' + version);
  }
  return { actualMajor, requiredMajor, allowed: true };
}
