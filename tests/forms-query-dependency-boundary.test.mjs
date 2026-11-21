import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('nested real npm lock authenticates the teaching React dependencies',()=>{
 const pkg=json('examples/forms-query-vertical/react-client/package.json');
 const lock=json('examples/forms-query-vertical/react-client/package-lock.json');
 const versions=json('content/stack-versions.json');
 assert.equal(versions.reactHookForm,'7');
 assert.equal(versions.tanstackQuery,'5');
 for(const dep of ['react-hook-form','@hookform/resolvers','@tanstack/react-query']){
  assert.equal(lock.packages[''].dependencies[dep],pkg.dependencies[dep]);
  assert.ok(/^sha512-/.test(lock.packages['node_modules/'+dep].integrity));
 }
});
test('published teaching code fences do not require runtime dependencies in root Next',()=>{
 const pkg=json('package.json');
 const mdxIds=Array.from({length:16},(_,i)=>(i<8?'09.02.':'09.03.')+String(i%8+1).padStart(2,'0'));
 for(const dep of ['react-hook-form','@hookform/resolvers','@tanstack/react-query']){
  assert.equal(pkg.dependencies[dep],undefined,'Unexpected root dependency: '+dep);
 }
 for(const id of mdxIds){
  const content=read('drafts/forms-query/lessons/'+id+'.mdx');
  const imports=content.split('\n\n',1)[0].split('\n').filter(l=>l.startsWith('import '));
  assert.equal(imports.length,2,id+' imports a runtime module');
  assert.ok(imports.every(l=>l.includes("@/components/course/")),id+' has untrusted imports');
 }
});
test('publication audit requires the nested trust boundary rather than root dependency bloat',()=>{
 const source=read('scripts/forms-query-promotion-readiness.mjs');
 assert.doesNotMatch(source,/blockers\.push\('Root runtime missing/);
 assert.match(source,/Nested npm lock does not match or authenticate/);
 assert.match(source,/node_modules\/['"]\+dep/);
});
