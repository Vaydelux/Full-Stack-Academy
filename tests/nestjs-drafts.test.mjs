import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectNestJsDrafts} from '../scripts/verify-nestjs-drafts.mjs';
const audit=inspectNestJsDrafts();
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('exactly 32 new topic authorship assets exist, with no duplicate IDs or slugs',()=>{
 assert.deepEqual(audit.issues,[]);
 assert.equal(audit.drafted,32);
 assert.equal(new Set(audit.topics.map(t=>t.id)).size,32);
 assert.equal(new Set(audit.topics.map(t=>t.labSlug)).size,32);
});
test('four complete eight-topic source draft families are present',()=>{
 assert.deepEqual(audit.modules.map(m=>[m.moduleId,m.drafted,m.published]),
  [['11.01',8,0],['11.02',8,0],['11.03',8,0],['11.04',8,0]]);
});
test('no staged NestJS lesson masquerades as a published lesson',()=>{
 assert.equal(audit.publishedUnchanged,338);
 assert.ok(audit.topics.every(x=>x.publication==='draft'&&x.sourceReady));
 assert.equal(audit.canPublish,false);
 assert.equal(audit.realNestRuntimeExecuted,false);
});
test('the runtime harness uses real Nest packages and tests both starters and instructors',()=>{
 const pkg=JSON.parse(read('examples/nestjs-vertical/package.json'));
 const smoke=read('examples/nestjs-vertical/tests/architecture.test.mjs');
 for(const name of ['@nestjs/core','@nestjs/common','@nestjs/testing','@nestjs/platform-fastify','@nestjs/websockets'])
  assert.ok(pkg.dependencies[name]?.startsWith('^12.'),'Missing Nest12 runtime '+name);
 assert.match(smoke,/NestFactory\.create/);
 assert.match(smoke,/Test\.createTestingModule/);
 assert.match(smoke,/assert\.rejects/);
 assert.equal((smoke.match(/test\('11\.01\./g)||[]).length,8);
});
test('a missing npm lock and manual qualification cannot be treated as green',()=>{
 assert.match(read('examples/nestjs-vertical/scripts/require-lock.mjs'),/package-lock\.json/);
 for(const module of audit.modules){
  assert.equal(module.runtimeQualified,false);
  assert.ok(module.blockers.some(x=>x.includes('real module')));
  assert.ok(module.blockers.some(x=>x.includes('accessibility')));
 }
});
