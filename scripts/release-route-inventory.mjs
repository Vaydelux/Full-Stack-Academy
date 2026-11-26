/** Exhaustive local HTTP route inventory; not a browser or editorial certification. */
// Dots are canonical in Next.js reference IDs. Only single separators are allowed;
// exact matching rejects path traversal, percent escapes, and terminal newlines.
const isLessonId = id => typeof id === 'string' && /^\d{2}\.\d{2}\.\d{2}$/.exec(id)?.[0] === id;
const isReferenceId = id => typeof id === 'string' && /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.exec(id)?.[0] === id;
const isRoute = route => typeof route === 'string' && (route.startsWith('/learn/') && isLessonId(route.slice(7)) || route.startsWith('/reference/') && isReferenceId(route.slice(11)));
export function buildRouteInventory(lessons, references) {
 const paths = [...lessons.map(x => {
  if (!isLessonId(x.id)) throw Error('Invalid lesson ID');
  return '/learn/' + x.id;
 }), ...references.map(x => {
  if (!isReferenceId(x.id)) throw Error('Invalid reference ID');
  return '/reference/' + x.id;
 })];
 if (!lessons.length || !references.length || new Set(paths).size !== paths.length) throw Error('Empty or duplicate route inventory');
 return paths;
}
export async function verifyRouteInventory(base, paths, request = fetch) {
 if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(base)) throw Error('Local production origin required');
 let checked = 0;
 const failures = [];
 for (let i = 0; i < paths.length; i += 4) {
  await Promise.all(paths.slice(i, i + 4).map(async path => {
   try {
    if (!isRoute(path)) throw Error('Invalid path');
    const response = await request(base + path, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    if (response.status !== 200 || !response.headers.get('content-type')?.includes('text/html') || !body.includes('id="doc-main"') || !/<h1(?:\s|>)/i.test(body)) throw Error('Invalid document response: ' + response.status);
    checked++;
   } catch (error) { failures.push({ path, reason: String(error.message).slice(0, 160) }); }
  }));
 }
 return { checked, expected: paths.length, failures, passed: paths.length > 0 && checked === paths.length && failures.length === 0 };
}
