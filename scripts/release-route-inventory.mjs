/** Exhaustive local HTTP route inventory; not a browser or editorial certification. */
export function buildRouteInventory(lessons, references) {
 const paths = [...lessons.map(x => {
  if (!/^\d{2}\.\d{2}\.\d{2}$/.test(x.id)) throw Error('Invalid lesson ID');
  return '/learn/' + x.id;
 }), ...references.map(x => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.id)) throw Error('Invalid reference ID');
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
    if (!/^\/(learn\/\d{2}\.\d{2}\.\d{2}|reference\/[a-z0-9]+(?:-[a-z0-9]+)*)$/.test(path)) throw Error('Invalid path');
    const response = await request(base + path, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    if (response.status !== 200 || !response.headers.get('content-type')?.includes('text/html') || !body.includes('id="doc-main"') || !/<h1(?:\s|>)/i.test(body)) throw Error('Invalid document response: ' + response.status);
    checked++;
   } catch (error) { failures.push({ path, reason: String(error.message).slice(0, 160) }); }
  }));
 }
 return { checked, expected: paths.length, failures, passed: paths.length > 0 && checked === paths.length && failures.length === 0 };
}
