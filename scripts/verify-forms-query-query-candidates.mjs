/** Read-only 09.03 Query candidate parity and promotion-boundary audit.
 * Source contracts only. No Node24, browser or accessibility approval implied.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=p=>path.join(root,p);
const read=p=>fs.readFileSync(file(p),'utf8').replaceAll('\r\n','\n');
const json=p=>JSON.parse(read(p));
const ids=Array.from({length:8},(_,i)=>'09.03.'+String(i+1).padStart(2,'0'));
const base='release-candidates/forms-query/09.03';
const fences=s=>[...s.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(m=>m[1].trim());

export function inspectQueryPublicationCandidates(){
 const catalog=new Map(json('data/curriculum.json').lessons.map(item=>[item.id,item]));
 const pkg=json('package.json');
 const nested=json('examples/forms-query-vertical/react-client/package.json');
 const lock=json('examples/forms-query-vertical/react-client/package-lock.json');
 const versions=json('content/stack-versions.json');
 const checkpoint=json('docs/checkpoint.json').snapshot;
 const registry=read('src/content/lesson-registry.tsx');
 const metadataRegistry=read('src/lib/academy/published.ts');
 const issues=[],records=[];
 const fail=(id,reason)=>issues.push({id,reason});
 for(const id of ids){
  try{
   const entry=catalog.get(id),stage=json('drafts/forms-query/lessons/'+id+'.meta.json');
   if(!entry||entry.moduleId!=='09.03'||stage.id!==id||entry.title!==stage.title)
    throw Error('Canonical Query topic mismatch');
   const slug=stage.labSlug;
   if(!/^[a-z][a-z0-9-]*$/.test(slug))throw Error('Invalid lab slug');
   const lab='forms-query-'+slug,rootLab=base+'/labs/'+lab;
   const meta=json(base+'/lessons/'+id+'.meta.json');
   const body=read(base+'/lessons/'+id+'.mdx');
   const staged=read('drafts/forms-query/lessons/'+id+'.mdx');
   const c=json(rootLab+'/lab.json'),proposed=c.proposedPublishedLabManifest;
   const stageLab=json('drafts/forms-query/labs/'+slug+'/lab.json');
   const pub=meta.publishedMetadata;
   if(meta.publicationReady!==false||c.promotionReady!==false||c.candidateOnly!==true)
    fail(id,'Candidate incorrectly claims publication approval');
   if(meta.targetPath!=='src/content/lessons/'+id+'.meta.json')fail(id,'Invalid published metadata target');
   if(pub.id!==id||pub.title!==entry.title||pub.moduleId!=='09.03'||pub.trackId!=='09'||
      pub.level!==entry.level||pub.reviewedAt!==null||pub.status!=='authored')
    fail(id,'Publication metadata canonical/approval mismatch');
   if(pub.description?.length<40||pub.objectives?.length<3||pub.objectives.some(v=>v.length<15)||
      pub.rubric?.length<3||pub.sources?.length<2||pub.sources.some(v=>!v.url.startsWith('https://')))
    fail(id,'Published metadata pedagogy/source schema incomplete');
   for(const [technology,major] of Object.entries(pub.stack))if(versions[technology]!==major)
    fail(id,'Unpinned stack major '+technology);
   if(pub.labId!=='lab.react.'+lab||proposed.id!==pub.labId||proposed.lessonId!==id||
      proposed.title!==entry.title||proposed.status!=='authored'||!proposed.runtime.includes('browser'))
    fail(id,'Proposed lab identity/runtime mismatched');
   if(proposed.starter!=='labs/'+lab+'/starter/solution.tsx'||
      proposed.solution!=='labs/'+lab+'/solution/solution.tsx'||
      proposed.tests!=='labs/'+lab+'/solution.test.mjs')
    fail(id,'Published lab file path mismatch');
   if(!proposed.verify.includes('npm run lab:'+lab)||
      pkg.scripts['lab:'+lab]!=='node scripts/verify-query-release-browser.mjs --lab '+slug)
    fail(id,'Missing exact per-lab genuine browser script');
   if(!c.testsImplemented||c.runtimeTestsExecuted!==false||stageLab.readyToPublish!==false)
    fail(id,'Misleading test execution or staged state');
   if(!body.includes('<LabGate lessonId="'+id+'" labId="lab.react.'+lab+'"')||
      (body.match(/<LessonStep\b/g)||[]).length!==3||!body.includes('<KnowledgeCheck'))
    fail(id,'Candidate MDX teaching components missing');
   const originalFences=fences(staged),plannedFences=fences(body);
   const starter=read(rootLab+'/starter/solution.tsx').trim(),solution=read(rootLab+'/solution/solution.tsx').trim();
   if(originalFences.length!==2||plannedFences.length!==2||
      originalFences[0]!==plannedFences[0]||originalFences[1]!==plannedFences[1]||
      starter!==read(stageLab.starter).trim()||solution!==read(stageLab.solution).trim()||
      starter!==plannedFences[0]||solution!==plannedFences[1])
    fail(id,'Staged/registered TSX parity drift');
   if(!stage.officialReferences.every(url=>body.includes(url)))fail(id,'Missing official reference');
   const wrapper=read(rootLab+'/solution.test.mjs');
   if(!wrapper.includes('spawnSync(process.execPath')||
      !wrapper.includes("'--lab','"+slug+"'")||!wrapper.includes('assert.equal(result.status,0'))
    fail(id,'Per-lab wrapper does not execute real browser acceptance');
   if(slug==='ssr-hydration'){
    for(const subdir of ['starter','solution'])for(const asset of ['providers.tsx','task-list.tsx']){
     if(read(rootLab+'/'+subdir+'/'+asset)!==read('drafts/forms-query/labs/'+slug+'/'+asset))
      fail(id,'Missing or drifted Next SSR shared asset '+subdir+'/'+asset);
    }
    if(!proposed.runtime.includes('next-16-ssr'))fail(id,'SSR lab falsely described as a Vite-only browser test');
   }
   const installed=[
    fs.existsSync(file('src/content/lessons/'+id+'.mdx')),
    fs.existsSync(file('src/content/lessons/'+id+'.meta.json')),
    fs.existsSync(file('labs/'+lab+'/lab.json')),
    registry.includes('./lessons/'+id+'.mdx'),
    metadataRegistry.includes('lessons/'+id+'.meta.json')
   ];
   const published=installed.every(Boolean);
   if(installed.some(Boolean)&&!published)fail(id,'Partial live Query lesson/registry/lab transition');
   if(published){
    const liveMeta=json('src/content/lessons/'+id+'.meta.json');
    const liveLab=json('labs/'+lab+'/lab.json');
    if(liveMeta.id!==id||liveMeta.labId!==pub.labId||
       liveLab.id!==pub.labId||liveLab.lessonId!==id||!liveMeta.reviewedAt)
     fail(id,'Published Query asset drift');
   }
   records.push({id,title:entry.title,labSlug:slug,sourceCandidate:true,published,
    realBrowserExecuted:'not-established-by-source-audit',humanAccessibilityReviewed:false});
  }catch(error){fail(id,String(error.message??error));}
 }
 const published=records.filter(x=>x.published).length;
 if(records.length!==8)fail('module','Exactly eight Query candidate packs are required');
 if(published!==0&&published!==8)fail('module','Query 09.03 must publish atomically, eight topics at a time');
 if(checkpoint.publishedLessons<338+published)fail('checkpoint','Checkpoint undercounts live Query topics');
 for(const dep of ['@tanstack/react-query','react-hook-form','@hookform/resolvers']){
  if(!nested.dependencies[dep]||lock.packages?.['']?.dependencies?.[dep]!==nested.dependencies[dep]||
     !/^sha512-/.test(lock.packages?.['node_modules/'+dep]?.integrity??''))
   fail('nested','Missing real lock integrity for '+dep);
 }
 if(pkg.scripts['qualify:forms-query:query-browser']!=='node scripts/verify-query-release-browser.mjs')
  fail('browser','Missing aggregate real-browser Query verification');
 return {moduleId:'09.03',candidateCount:records.length,published,records,issues,
  sourceValid:issues.length===0,readyToPublish:false,publishedSnapshot:checkpoint.publishedLessons,
  note:'Candidate source validation only. Real React Query, Next SSR, Chromium and human accessibility gates remain unexecuted by this report.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=new Set(process.argv.slice(2));
 if([...flags].some(x=>!['--json','--check','--strict'].includes(x)))throw Error('Usage: --json|--check|--strict');
 const report=inspectQueryPublicationCandidates();
 if(flags.has('--json'))console.log(JSON.stringify(report,null,2));
 else console.log('Query 09.03 candidate packs: '+report.candidateCount+'/8, '+report.issues.length+' structural errors, '+report.published+' published.');
 if(report.issues.length)console.error(JSON.stringify(report.issues,null,2));
 if((flags.has('--check')&&report.issues.length)||(flags.has('--strict')&&!report.readyToPublish))process.exitCode=1;
}
