/** A broken starter must fail its intended semantic assertion, not loading or infrastructure. */
import assert, { AssertionError } from 'node:assert/strict';

export async function verifyRedGreen(load, slug, probe, expectedFailure = error => error instanceof AssertionError) {
  const solution = await load(slug, 'solution');
  const starter = await load(slug, 'starter');
  await probe(solution);
  await assert.rejects(async () => probe(starter), expectedFailure,
    'Starter must fail its intended behavioral contract: ' + slug);
}

/** Only the deliberately missing cross-module export is an accepted DI failure. */
export function missingTasksExport(error) {
  return error?.constructor?.name === 'UnknownDependenciesException' &&
    /ReportsService/.test(error.message ?? '') && /TasksService/.test(error.message ?? '');
}
