import assert from 'node:assert/strict';
import { candidatePaths, gitBlobId, inspectCandidate } from './nest-candidate-contract.mjs';

export const MODULES=Object.freeze(['11.01','11.02','11.03','11.04']);
const common=['package.json','tsconfig.json','scripts/red-green.mjs','scripts/module-qualification.mjs','scripts/require-lock.mjs','scripts/lock-integrity.mjs','scripts/verify-runtime-test-coverage.mjs','package-lock.json','tests/pg-test-guard.mjs','tests/pg-test-guard.test.mjs'].map(p=>'examples/nestjs-vertical/'+p);
const bind=(path,read)=>({path,gitBlob:gitBlobId(read(path).replaceAll('\r\n','\n'))});
const topicsFor=(catalog,id)=>catalog.lessons.filter(l=>l.moduleId===id).sort((a,b)=>a.id.localeCompare(b.id));
export function buildCandidateModule(moduleId, catalog, read, sourceCommit) {
 assert.ok(MODULES.includes(moduleId));assert.match(sourceCommit,/^[a-f0-9]{40}$/);
 const topics=topicsFor(catalog,moduleId);assert.equal(topics.length,8);
 const candidates=topics.map(topic=>{
  const {id,title,level}=topic,meta=JSON.parse(read('drafts/nestjs/lessons/'+id+'.meta.json')),slug=meta.labSlug;
  const paths=candidatePaths(id,slug),labId='lab.node.nestjs-'+slug;
  return {id,moduleId,title,slug,publicationReady:false,runtimeExecuted:false,reviewedAt:null,sourceBindings:paths.sources.map(p=>bind(p,read)),targetPaths:paths.targets,
   runtime:{suite:paths.suite,topic:id,integration:paths.integration,negativeMode:id==='11.04.08'?'unsafe-starter-source-only':'semantic-runtime'},
   proposedMetadata:{id,title,trackId:'11',moduleId,level,estimatedMinutes:meta.estimatedMinutes,description:meta.objective+' '+meta.acceptance,labId,stack:{node:'24',nestjs:'12',typescriptNestjs:'6'},prerequisites:meta.prerequisites,objectives:[meta.objective,meta.acceptance,meta.securityBoundary],rubric:[meta.objective,meta.acceptance,meta.securityBoundary],sources:meta.officialReferences.map((url,i)=>({label:i===0?'Primary official reference':'Supporting official reference',url})),reviewedAt:null},
   proposedLab:{id:labId,lessonId:id,title:'NestJS practice: '+title,runtime:'node-24-nestjs-12-typescript-6',starter:paths.targets[3],solution:paths.targets[4],tests:paths.targets[5],expected:meta.acceptance,security:meta.securityBoundary}};
 });
 const result={schemaVersion:1,moduleId,sourceCommit,publicationReady:false,commonSourceBindings:common.map(p=>bind(p,read)),candidates};
 inspectCandidateModule(result,moduleId,catalog,read);
 return result;
}
export function inspectCandidateModule(pack,moduleId,catalog,read) {
 assert.ok(MODULES.includes(moduleId));assert.equal(pack.schemaVersion,1);assert.equal(pack.moduleId,moduleId);assert.equal(pack.publicationReady,false);assert.match(pack.sourceCommit,/^[a-f0-9]{40}$/);
 assert.deepEqual(pack.commonSourceBindings.map(b=>b.path),common);
 for(const b of pack.commonSourceBindings){const source=read(b.path);assert.ok(gitBlobId(source)===b.gitBlob||gitBlobId(source.replaceAll('\r\n','\n'))===b.gitBlob,'Shared candidate source changed: '+b.path);}
 const topics=topicsFor(catalog,moduleId);assert.equal(topics.length,8);
 assert.deepEqual(pack.candidates.map(c=>c.id),topics.map(t=>t.id),'Missing, duplicate or reordered candidates');
 const results=pack.candidates.map((c,i)=>inspectCandidate(c,topics[i],read));
 const targets=pack.candidates.flatMap(c=>c.targetPaths);assert.equal(new Set(targets).size,48,'Duplicate projected target');
 return {moduleId,candidates:results.length,targets:targets.length,sourceBound:true,publicationApproved:false};
}
