import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('project is discoverable from the curriculum and documentation navigation',()=>{
 assert.match(read('src/app/learn/page.tsx'),/href="\/learn\/projects"/);
 assert.match(read('src/components/course/DocShell.tsx'),/href="\/learn\/projects"/);
 assert.match(read('src/app/learn/projects/page.tsx'),/href="\/learn\/projects\/forms-query"/);
});
test('project routes are clearly local-only and not indexed before browser qualification',()=>{
 for(const page of ['src/app/learn/projects/page.tsx','src/app/learn/projects/forms-query/page.tsx']){
  const source=read(page);
  assert.match(source,/index: false/);
  assert.match(source,/local|Local/);
 }
});
test('project detail links to concrete source and testing instructions',()=>{
 const source=read('src/app/learn/projects/forms-query/page.tsx');
 assert.match(source,/node examples\/forms-query-vertical\/task-api\.mjs/);
 assert.match(source,/node --test tests\/forms-query-workflow\.test\.mjs/);
 assert.match(source,/node --test tests\/forms-query-contract\.test\.mjs/);
 assert.match(source,/github\.com\/Vaydelux\/Full-Stack-Academy\/blob\/main\/examples/);
});
test('project never imports unauthenticated local server into Next runtime',()=>{
 for(const page of ['src/app/learn/projects/page.tsx','src/app/learn/projects/forms-query/page.tsx']){
  assert.doesNotMatch(read(page),/import .*task-api\.mjs/);
  assert.doesNotMatch(read(page),/localhost:3337\/api|127\.0\.0\.1:3337\/api/);
 }
});
test('project describes real status transitions and conflict recovery',()=>{
 const source=read('src/app/learn/projects/forms-query/page.tsx');
 assert.match(source,/If-Match/);
 assert.match(source,/PATCH/);
 assert.match(source,/409 or 412/);
});
// Exact registry reconciliation is performed by checkpoint:check and
// test:curriculum-readiness. This gate protects the historical publication floor
// without rejecting successful module promotion in the same offline suite.
function assertPublicationSnapshot(snapshot){
 const {publishedLessons,authoredMdxLessons,catalogTopics}=snapshot;
 assert.ok([publishedLessons,authoredMdxLessons,catalogTopics].every(Number.isSafeInteger));
 assert.ok(publishedLessons>=338,'Published lesson baseline regressed');
 assert.ok(authoredMdxLessons>=337,'MDX lesson baseline regressed');
 assert.ok(authoredMdxLessons<=publishedLessons&&publishedLessons<=catalogTopics,'Invalid publication totals');
}
test('publication snapshot preserves the historical floor',()=>{
 assertPublicationSnapshot(JSON.parse(read('docs/checkpoint.json')).snapshot);
});
test('publication snapshot accepts both planned P1 promotion counts and final coverage',()=>{
 for(const [publishedLessons,authoredMdxLessons] of [[338,337],[346,345],[354,353],[889,888]]){
  assert.doesNotThrow(()=>assertPublicationSnapshot({publishedLessons,authoredMdxLessons,catalogTopics:889}));
 }
});
test('publication snapshot rejects regression or inconsistent totals',()=>{
 for(const [publishedLessons,authoredMdxLessons] of [[337,337],[338,336],[346,347],[890,889],[346.5,345]]){
  assert.throws(()=>assertPublicationSnapshot({publishedLessons,authoredMdxLessons,catalogTopics:889}));
 }
});
