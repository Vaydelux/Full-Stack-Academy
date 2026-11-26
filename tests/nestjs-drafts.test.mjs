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
 assert.deepEqual(audit.modules.map(m=>[m.moduleId,m.drafted]),
  [['11.01',8],['11.02',8],['11.03',8],['11.04',8]]);
 assert.ok(audit.modules.every(m=>[0,8].includes(m.published)));
});
test('no staged NestJS lesson masquerades as a published lesson',()=>{
 assert.ok(audit.publishedUnchanged>=338);
 assert.ok(audit.topics.every(x=>['draft','published'].includes(x.publication)&&x.sourceReady));
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
 assert.match(smoke,/verifyRedGreen\(load/);
 assert.match(read('examples/nestjs-vertical/scripts/red-green.mjs'),/assert\.rejects/);
 assert.equal((smoke.match(/test\('11\.01\./g)||[]).length,8);
});
test('a missing npm lock and manual qualification cannot be treated as green',()=>{
 assert.match(read('examples/nestjs-vertical/scripts/require-lock.mjs'),/package-lock\.json/);
 for(const courseModule of audit.modules){
  assert.equal(courseModule.runtimeQualified,false);
  assert.ok(courseModule.blockers.some(x=>x.includes('real module')));
  assert.ok(courseModule.blockers.some(x=>x.includes('accessibility')));
 }
});

test('the Nest 12 lab uses ESM emission and suppresses tracked build output',()=>{
 const tsconfig=JSON.parse(read('examples/nestjs-vertical/tsconfig.json'));
 assert.equal(tsconfig.compilerOptions.module,'ESNext');
 assert.equal(tsconfig.compilerOptions.moduleResolution,'Bundler');
 assert.match(read('.gitignore'),/^\/examples\/nestjs-vertical\/dist\/$/m);
});
test('WebSocket rooms are joined only after a verified tenant context exists',()=>{
 const solution=read('drafts/nestjs/labs/websocket-gateways/solution.ts');
 assert.match(solution,/handleConnection\(client: Socket\)/);
 assert.match(solution,/client\.disconnect\(true\)/);
 assert.match(solution,/client\.join\('tenant:' \+ tenantId\)/);
 assert.match(solution,/this\.server\.to\('tenant:' \+ tenantId\)/);
});

test('unqualified Nest draft source is excluded from the Next root lint pipeline',()=>{
 const config=read('eslint.config.mjs');
 assert.match(config,/"drafts\/nestjs\/\*\*"/);
 assert.match(config,/"examples\/nestjs-vertical\/\*\*"/);
});


test('P10 all four NestJS modules contain thirty-two distinct applied assessments and walkthroughs',()=>{
 const ids=['11.01','11.02','11.03','11.04'].flatMap(mod=>Array.from({length:8},(_,i)=>mod+'.'+String(i+1).padStart(2,'0')));
 const questions=new Set(),answerCounts=[0,0,0,0];
 for(const id of ids){
  const mdx=read('drafts/nestjs/lessons/'+id+'.mdx').replaceAll('\r\n','\n');
  const tags=mdx.match(/<KnowledgeCheck[^\n]+\/>/g);
  assert.equal(tags?.length,1,id);
  const tag=tags[0];
  const question=JSON.parse(tag.match(/question=(".*?") choices=/)[1]);
  assert.ok(!questions.has(question),id+' repeated assessment');
  questions.add(question);
  const choices=JSON.parse(tag.match(/choices=\{(\[[^\n]*?\])\}/)[1]);
  const answer=Number(tag.match(/correctIndex=\{(\d+)\}/)[1]);
  assert.equal(choices.length,4,id);
  assert.equal(new Set(choices).size,4,id);
  assert.ok(answer>=0&&answer<4,id);
  answerCounts[answer]++;
  const walk=mdx.match(/## Applied engineering walkthrough\n([\s\S]*?)(?=## Bug Hunt)/)?.[1]??'';
  assert.ok(walk.split(/\s+/).length>=150,id+' shallow walkthrough');
  assert.ok(walk.includes('### Diagnose the concrete failure'),id);
  assert.ok(walk.includes('### Independent exercise and evidence'),id);
  assert.ok(walk.includes('**Qualification boundary:**'),id);
  assert.doesNotMatch(mdx,/<LabGate\b/,id);
 }
 assert.equal(questions.size,32);
 assert.ok(answerCounts.every(count=>count>0),'Avoid all correct answers in the same position');
});
