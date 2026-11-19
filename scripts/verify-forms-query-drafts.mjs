/**
 * Node-only prepublication audit for the Forms/Query staged curriculum.
 * This deliberately does NOT load React, RHF, Zod or TanStack Query and
 * cannot qualify UI behavior, TypeScript types or real HTTP semantics.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const staging=path.join(root,'drafts','forms-query');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const readJSON=relative=>JSON.parse(read(relative));
const catalog=readJSON('data/curriculum.json').lessons;
const expected=catalog.filter(x=>x.moduleId==='09.02'||x.moduleId==='09.03').sort((a,b)=>a.id.localeCompare(b.id));
const idPattern=/^09\.0[23]\.0[1-8]$/;
const problems=[];
function check(label,fn){try{fn()}catch(error){problems.push({label,error:error.message})}}
const safeFile=relative=>{
 assert.ok(/^drafts\/forms-query\/labs\/[a-z0-9-]+\/(starter|solution)\.tsx$/.test(relative),'Unsafe staged lab file path');
 const resolved=path.resolve(root,relative);
 assert.ok(resolved.startsWith(staging+path.sep),'Lab path escapes staging root');
 assert.ok(fs.statSync(resolved).isFile(), 'Missing source '+relative);
 return fs.readFileSync(resolved,'utf8');
};

check('canonical staging scope',()=>{
 assert.equal(expected.length,16);
 assert.equal(new Set(expected.map(x=>x.id)).size,16);
 assert.ok(expected.every(x=>idPattern.test(x.id)&&x.status==='planned'));
});
check('draft folder count',()=>{
 const drafts=fs.readdirSync(path.join(staging,'lessons')).sort();
 assert.equal(drafts.filter(x=>x.endsWith('.mdx')).length,16);
 assert.equal(drafts.filter(x=>x.endsWith('.meta.json')).length,16);
 assert.deepEqual(drafts.filter(x=>x.endsWith('.mdx')).map(x=>x.replace('.mdx','')).sort(),expected.map(x=>x.id));
 assert.deepEqual(drafts.filter(x=>x.endsWith('.meta.json')).map(x=>x.replace('.meta.json','')).sort(),expected.map(x=>x.id));
});
const allSlugs=new Set();
let passed=0;
for(const item of expected){
 check(item.id,()=>{
  const id=item.id;
  const meta=readJSON('drafts/forms-query/lessons/'+id+'.meta.json');
  const mdx=read('drafts/forms-query/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);
  assert.equal(meta.title,item.title);
  assert.equal(meta.moduleId,item.moduleId);
  assert.equal(meta.trackId,'09');
  assert.equal(meta.sourceStatus,'staged-unverified');
  assert.ok(meta.estimatedMinutes>=15 && meta.estimatedMinutes<=180);
  assert.ok(Array.isArray(meta.prerequisites)&&meta.prerequisites.length>=1);
  assert.ok(meta.prerequisites.every(dep=>catalog.some(topic=>topic.id===dep)));
  assert.equal(meta.prerequisites[0],id==='09.02.01'?'09.01.08':id==='09.03.01'?'09.02.08':id.slice(0,6)+String(Number(id.slice(-2))-1).padStart(2,'0'));
  assert.equal(typeof meta.objective,'string');
  assert.ok(meta.objective.length>55);
  assert.ok(meta.expectedBehavior.length>60 && meta.commonFailure.length>50 && meta.securityBoundary.length>50);
  assert.ok(Array.isArray(meta.rubric)&&meta.rubric.length>=3);
  assert.ok(Array.isArray(meta.officialReferences)&&meta.officialReferences.length>=2);
  assert.ok(meta.officialReferences.every(url=>typeof url==='string'&&url.startsWith('https://')));
  assert.equal(meta.officialReferences[0],item.referenceUrl);
  assert.ok(/^[a-z0-9-]+$/.test(meta.labSlug));
  assert.ok(!allSlugs.has(meta.labSlug),'Duplicate staged lab slug');
  allSlugs.add(meta.labSlug);
  for(const mandatory of ['## The problem','## Build the mental model','<LearningGoals','<KnowledgeCheck','## Bug Hunt','## Guided local lab','## Official references','not','published']){
    assert.ok(mdx.toLowerCase().includes(mandatory.toLowerCase()),'Missing '+mandatory);
  }
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3);
  assert.ok(mdx.length>=3500,'Lesson lacks developed explanations and examples');
  for(const url of meta.officialReferences)assert.ok(mdx.includes(url),'Missing reference '+url);
  assert.ok(mdx.includes('lessonId="'+id+'"'),'Quiz is linked to wrong lesson');
  assert.ok(!/<LabGate/.test(mdx),'Do not render an unqualified published lab gate');
  assert.ok(!/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/i.test(mdx),'Apparent credential in MDX');
  const manifest=readJSON('drafts/forms-query/labs/'+meta.labSlug+'/lab.json');
  assert.equal(manifest.lessonId,id);
  assert.equal(manifest.title,item.title);
  assert.equal(manifest.sourceStatus,'staged-unverified');
  assert.equal(manifest.readyToPublish,false);
  assert.equal(manifest.requiresRealLibraryTest,true);
  assert.equal(manifest.requiresRealBrowserTest,true);
  assert.ok(manifest.expectedNegative.length>40);
  assert.ok(manifest.expectedPositive.length>40);
  const starter=safeFile(manifest.starter);
  const solution=safeFile(manifest.solution);
  assert.notEqual(starter,solution,'Red starter must differ from instructor source');
  assert.ok(starter.length>220 && solution.length>400,'Incomplete exercise source');
  assert.ok(solution.includes('export ') && starter.includes('export '));
  assert.ok(!solution.includes('dangerouslySetInnerHTML'));
  assert.ok(!solution.includes('eval('));
  if(id.startsWith('09.02'))assert.ok(solution.includes('react-hook-form'),'RHF code missing');
  else assert.ok(solution.includes('@tanstack/react-query'),'Query code missing');
  passed++;
 });
}
check('extra/missing lab directory',()=>{
 const labs=fs.readdirSync(path.join(staging,'labs')).filter(x=>fs.statSync(path.join(staging,'labs',x)).isDirectory());
 assert.equal(labs.length,16);
 assert.deepEqual(labs.sort(),[...allSlugs].sort());
});
check('no accidental live registry publication',()=>{
 const published=read('src/lib/academy/published.ts');
 const registry=read('src/content/lesson-registry.tsx');
 for(const lesson of expected){
  assert.ok(!published.includes('lessons/'+lesson.id+'.meta.json'),'Premature metadata publication');
  assert.ok(!registry.includes('lessons/'+lesson.id+'.mdx'),'Premature MDX publication');
 }
});
const summary={expected:expected.length,passed,checks:expected.length+4,failures:problems.length,staged:true,realLibraryTestsExecuted:false,realBrowserTestsExecuted:false};
if(problems.length){
 console.error(JSON.stringify({summary,problems},null,2));
 process.exitCode=1;
}else console.log(JSON.stringify(summary,null,2));
