import {p1ModuleStates} from '../scripts/p1-browser-state.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["10.03.01","10.03.02","10.03.03","10.03.04","10.03.05","10.03.06","10.03.07","10.03.08","10.04.01","10.04.02","10.04.03","10.04.04","10.04.05","10.04.06","10.04.07","10.04.08"];
const slugs=["security-proxy-tls","security-cors-csrf","security-session-cookies","security-request-limiter","security-body-size","security-ssrf-allowlist","security-log-redaction","security-insecure-endpoint","openapi-document-layout","openapi-request-response","openapi-bearer-schemes","openapi-operation-ids","openapi-generate-client","openapi-contract-compat","openapi-version-strategy","openapi-generated-client-capstone"];
test('16 security/OpenAPI lessons have metadata, guided steps and actual checked-in labs',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<16;i++){
  const id=ids[i],slug=slugs[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+slug+'/lab.json'));
  const mdx=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.trackId,'10');assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.stack.node,'24');assert.equal(meta.stack.typescript,'5');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);assert.equal(lab.runtime,'node-24');
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3);
  assert.ok(meta.sources.length===2&&meta.sources.every(x=>mdx.includes(x.url)));
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3,id+' must have exactly 3 guided steps');
  for(const mark of ['<LearningGoals','<Misconception','<KnowledgeCheck','## Bug Hunt','## Official references','interactive={false}',`<LabGate lessonId="${id}"`])assert.ok(mdx.includes(mark),id+' missing '+mark);
  for(const file of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,file)).isFile(),file);
  assert.equal(pkg.scripts['lab:'+slug],'node --test labs/'+slug+'/solution.test.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
 }
});
test('every module in Track 10 has authored local lessons; RHF remains planned',()=>{
 const meta=fs.readdirSync(path.join(root,'src/content/lessons')).filter(x=>/^10\.0[1-4]\.\d{2}\.meta\.json$/.test(x));
 assert.equal(meta.length,32);
 const states=p1ModuleStates(fs.readdirSync(path.join(root,'src/content/lessons')));
 assert.equal(read('src/lib/academy/published.ts').includes('lessons/09.02.01.meta.json'),states['09.02'],'Registry must match complete tracked RHF metadata');
 const cp=JSON.parse(read('docs/checkpoint.json'));
 for(const mod of ['10.01','10.02','10.03','10.04'])assert.ok(cp.snapshot.completeModules.includes(mod),mod);
 assert.ok(cp.snapshot.publishedLessons>=338,'Retain baseline publishedLessons coverage');
 assert.ok(cp.snapshot.authoredMdxLessons>=337,'Retain baseline authoredMdxLessons coverage');
 assert.ok(cp.snapshot.labFixtures>=337,'Retain baseline labFixtures coverage');
 assert.ok(cp.snapshot.completeModules.length>=42,'Retain baseline completeModules.length coverage');
 assert.equal(cp.snapshot.authoredReferenceDrafts,JSON.parse(read('data/reference-index.json')).entries.length,'all canonical references must remain authored');
});
test('checked-in OpenAPI 3.1 security contract contains real operations and JSON schemas',()=>{
 const doc=JSON.parse(read('examples/task-contract/task-api.openapi.json'));
 assert.equal(doc.openapi,'3.1.1');
 assert.equal(doc.components.securitySchemes.BearerAuth.scheme,'bearer');
 assert.deepEqual(doc.paths['/health'].get.security,[]);
 assert.deepEqual(doc.paths['/api/notes'].post.security,[{BearerAuth:[]}]);
 const ids=['getHealth','listNotes','createNote'];
 const actual=Object.values(doc.paths).flatMap(x=>Object.values(x).map(v=>v.operationId));
 assert.deepEqual([...actual].sort(),ids.sort());
 assert.equal(doc.components.schemas.CreateNote.additionalProperties,false);
 assert.ok(doc.paths['/api/notes'].post.responses['422']);
});
test('actual generated SDK and real loopback API are present, with strict red starter gate',()=>{
 const generator=read('examples/task-contract/generate-client.mjs');
 const server=read('labs/security-insecure-endpoint/solution/solution.mjs');
 const capstone=read('labs/openapi-generated-client-capstone/solution.test.mjs');
 const pkg=JSON.parse(read('package.json'));
 assert.ok(generator.includes('export function generateClient'));
 assert.ok(generator.includes('Invalid or duplicate operationId'));
 assert.ok(generator.includes("redirect:'error'"));
 assert.ok(server.includes('timingSafeEqual')&&server.includes('createServer('));
 assert.ok(capstone.includes('127.0.0.1')&&capstone.includes('unauthorized.listNotes()'));
 assert.ok(pkg.scripts['test:backend-contract'].includes('labs/openapi-generated-client-capstone/solution.test.mjs'));
 assert.equal(pkg.scripts['test:red-backend-contract'],'node --test tests/backend-contract-red-starters.test.mjs');
 assert.ok(read('scripts/verify-offline.mjs').includes("'test:backend-contract'"));
 assert.ok(read('scripts/verify-offline.mjs').includes("'test:red-backend-contract'"));
 assert.ok(read('scripts/validate-content.mjs').includes('security|openapi'));
});
test('the local browser route smoke includes all backend lessons and first planned noindex',async()=>{
 const smoke=read('scripts/backend-contract-track-smoke.mjs');
 const {backendContractLessonIds}=await import('../scripts/backend-contract-track-smoke.mjs');
 assert.deepEqual(backendContractLessonIds, [
  '10.03.01','10.03.02','10.03.03','10.03.04','10.03.05','10.03.06','10.03.07','10.03.08',
  '10.04.01','10.04.02','10.04.03','10.04.04','10.04.05','10.04.06','10.04.07','10.04.08',
 ]);
 assert.ok(smoke.includes("09.02.01"));
 assert.ok(read('scripts/browser-smoke.mjs').includes('verifyBackendContractTrack'));
});
