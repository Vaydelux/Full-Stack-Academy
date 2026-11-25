import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const modules = Object.freeze({'11.01':'architecture','11.02':'request-pipeline','11.03':'domain-modules','11.04':'advanced'});
const sha = /^[a-f0-9]{40}$/;
export function gitBlobId(text) {
  const bytes=Buffer.from(text,'utf8');
  return createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
export function candidatePaths(id,slug) {
  assert.match(id,/^11\.0[1-4]\.0[1-8]$/);
  assert.match(slug,/^[a-z][a-z0-9-]+$/);
  const lesson='drafts/nestjs/lessons/'+id;
  const lab='drafts/nestjs/labs/'+slug+'/';
  const target='labs/nestjs-'+slug+'/';
  const suite='examples/nestjs-vertical/tests/'+modules[id.slice(0,5)]+'.test.mjs';
  const integration=id==='11.03.06'?'examples/nestjs-vertical/tests/postgres.integration.test.mjs':id==='11.04.03'?'examples/nestjs-vertical/tests/websocket.integration.test.mjs':null;
  return {sources:[lesson+'.mdx',lesson+'.meta.json',lab+'lab.json',lab+'starter.ts',lab+'solution.ts',suite,...(integration?[integration]:[])],
    targets:['src/content/lessons/'+id+'.mdx','src/content/lessons/'+id+'.meta.json',target+'lab.json',target+'starter/solution.ts',target+'solution/solution.ts',target+'solution.test.mjs'],suite,integration};
}
export function inspectCandidate(candidate, topic, read) {
  const {id,moduleId,title,level}=topic;
  assert.equal(candidate.id,id);assert.equal(candidate.moduleId,moduleId);assert.equal(candidate.title,title);
  assert.equal(candidate.publicationReady,false);assert.equal(candidate.runtimeExecuted,false);assert.equal(candidate.reviewedAt,null);
  const paths=candidatePaths(id,candidate.slug);
  assert.deepEqual(candidate.targetPaths,paths.targets);
  assert.deepEqual(candidate.sourceBindings.map(x=>x.path),paths.sources);
  for(const binding of candidate.sourceBindings){
    assert.match(binding.gitBlob,sha);
    const content=read(binding.path);
    assert.ok(gitBlobId(content)===binding.gitBlob||gitBlobId(content.replaceAll('\r\n','\n'))===binding.gitBlob,'Candidate source changed: '+binding.path);
  }
  const meta=JSON.parse(read(paths.sources[1])),lab=JSON.parse(read(paths.sources[2]));
  assert.equal(meta.id,id);assert.equal(meta.title,title);assert.equal(meta.moduleId,moduleId);assert.equal(meta.labSlug,candidate.slug);
  assert.equal(meta.sourceStatus,'draft-unverified');assert.equal(meta.runtimeQualification,'not-run');assert.equal(meta.reviewStatus,'unreviewed');
  assert.equal(lab.lessonId,id);assert.equal(lab.readyToPublish,false);assert.equal(lab.requiresRealNestTest,true);
  assert.equal(lab.expectedPositive,meta.acceptance);assert.equal(lab.expectedNegative,meta.misconception);
  assert.equal(lab.starter,paths.sources[3]);assert.equal(lab.solution,paths.sources[4]);
  const article=read(paths.sources[0]);
  const fences=[...article.replaceAll('\r\n','\n').matchAll(/```ts\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());
  assert.deepEqual(fences,paths.sources.slice(3,5).map(p=>read(p).replaceAll('\r\n','\n').trim()));
  assert.notEqual(fences[0],fences[1]);assert.ok(!article.includes('<LabGate'));
  const runtime=read(paths.suite), names=[...runtime.matchAll(/^\s*test\(\s*['"](11\.\d{2}\.\d{2})\b/gm)].map(x=>x[1]);
  assert.equal(names.filter(x=>x===id).length,1,'Missing or duplicate topic runtime assertion');
  if(paths.integration)assert.ok(read(paths.integration).includes("test('"+id+' '),'Missing topic integration');
  assert.deepEqual(candidate.runtime,{suite:paths.suite,topic:id,integration:paths.integration,negativeMode:id==='11.04.08'?'unsafe-starter-source-only':'semantic-runtime'});
  assert.deepEqual(candidate.proposedMetadata,{id,title,trackId:'11',moduleId,level,estimatedMinutes:meta.estimatedMinutes,description:meta.objective+' '+meta.acceptance,labId:'lab.node.nestjs-'+candidate.slug,stack:{node:'24',nestjs:'12',typescriptNestjs:'6'},prerequisites:meta.prerequisites,objectives:[meta.objective,meta.acceptance,meta.securityBoundary],rubric:[meta.objective,meta.acceptance,meta.securityBoundary],sources:meta.officialReferences.map((url,i)=>({label:i===0?'Primary official reference':'Supporting official reference',url})),reviewedAt:null});
  assert.deepEqual(candidate.proposedLab,{id:'lab.node.nestjs-'+candidate.slug,lessonId:id,title:'NestJS practice: '+title,runtime:'node-24-nestjs-12-typescript-6',starter:paths.targets[3],solution:paths.targets[4],tests:paths.targets[5],expected:meta.acceptance,security:meta.securityBoundary});
  return {id,sourceBound:true,publicationApproved:false};
}
