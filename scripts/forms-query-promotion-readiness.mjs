/** Read-only, fail-closed readiness audit for Forms/Query publication. Node 22+.
 * --check checks source integrity; --strict also requires published artifacts
 * and an actual human a11y review. Neither option publishes anything.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=p=>path.join(root,p);
const exists=p=>fs.existsSync(file(p));
const read=p=>fs.readFileSync(file(p),'utf8');
const json=p=>JSON.parse(read(p));
const fence=new RegExp(String.fromCharCode(96).repeat(3)+'tsx\\s*\\n([\\s\\S]*?)\\n'+String.fromCharCode(96).repeat(3),'g');
export function inspectFormsQueryPromotion(){
 const catalog=json('data/curriculum.json').lessons;
 const pkg=json('package.json'),nested=json('examples/forms-query-vertical/react-client/package.json');
 const registry=read('src/content/lesson-registry.tsx'),indexed=read('src/lib/academy/published.ts');
 const versions=json('content/stack-versions.json');
 const checks={'09.02':read('scripts/verify-forms-query-staged-rhf.mjs'),'09.03':read('scripts/verify-forms-query-staged-query.mjs')};
 const browser=read('scripts/verify-forms-query-react-browser.mjs');
 const modules=[],topics=[],sourceErrors=[];
 const fail=(id,detail)=>sourceErrors.push({id,detail});
 for(const moduleId of ['09.02','09.03']){
  const entries=catalog.filter(x=>x.moduleId===moduleId).sort((a,b)=>a.id.localeCompare(b.id));
  if(entries.length!==8)fail(moduleId,'Not eight canonical lessons');
  for(const item of entries){
   const id=item.id,base='drafts/forms-query/lessons/'+id;
   if(!exists(base+'.mdx')||!exists(base+'.meta.json')){fail(id,'Missing draft lesson');continue}
   const meta=json(base+'.meta.json'),mdx=read(base+'.mdx'),slug=meta.labSlug;
   if(typeof slug!=='string'||!/^[a-z][a-z0-9-]*$/.test(slug)){fail(id,'Invalid lab slug');continue}
   const lab='drafts/forms-query/labs/'+slug+'/';
   if(!['lab.json','starter.tsx','solution.tsx'].every(n=>exists(lab+n))){fail(id,'Missing staged lab file');continue}
   const contract=json(lab+'lab.json'),starter=read(lab+'starter.tsx').trim(),solution=read(lab+'solution.tsx').trim();
   const blocks=[...mdx.matchAll(fence)].map(x=>x[1].trim());
   const problems=[],assert=(value,message)=>{if(!value)problems.push(message)};
   assert(meta.id===id&&contract.lessonId===id&&meta.title===item.title&&contract.title===item.title,'Canonical ID/title mismatch');
   assert(meta.moduleId===moduleId&&meta.trackId==='09','Module/track mismatch');
   assert(meta.sourceStatus==='staged-unverified'&&contract.readyToPublish===false,'Stage status mismatch');
   assert(contract.starter===lab+'starter.tsx'&&contract.solution===lab+'solution.tsx','Asset path mismatch');
   assert(contract.requiresRealLibraryTest===true&&contract.requiresRealBrowserTest===true,'Missing real test requirements');
   assert(meta.officialReferences?.[0]===item.referenceUrl&&meta.officialReferences?.length>=2,'Official reference mismatch');
   assert(meta.prerequisites?.length>=1&&meta.rubric?.length>=3,'Missing prerequisites/rubric');
   assert((mdx.match(/<LessonStep\b/g)||[]).length>=3&&mdx.includes('<KnowledgeCheck')&&mdx.includes('## Bug Hunt'),'Teaching sections absent');
   assert(blocks.length===2&&blocks[0]===starter&&blocks[1]===solution&&starter!==solution,'Broken starter/instructor MDX parity');
   assert(checks[moduleId].includes("'"+slug+"': async"),'No topic-specific browser test');
   assert(browser.includes('verifyStagedRHF')&&browser.includes('verifyStagedQuery')&&browser.includes('verifyStagedSsr'),'Missing browser/SSR qualification runner');
   for(const p of problems)fail(id,p);
   const live=[exists('src/content/lessons/'+id+'.mdx'),exists('src/content/lessons/'+id+'.meta.json'),
    exists('labs/forms-query-'+slug+'/lab.json'),registry.includes('./lessons/'+id+'.mdx'),indexed.includes('lessons/'+id+'.meta.json')];
   const published=live.every(Boolean);
   if(live.some(Boolean)&&!published)fail(id,'Partial publication: lesson, lab and both registries must be atomic');
   topics.push({id,moduleId,slug,stagedValid:problems.length===0,published});
  }
  let a11y=false;
  const evidence='docs/release-evidence/forms-query-'+moduleId+'-accessibility.json';
  if(exists(evidence))try{
   const e=json(evidence);
   a11y=e.moduleId===moduleId&&e.reviewed===true&&e.keyboard===true&&e.zoom200===true&&
    typeof e.reviewer==='string'&&e.reviewer.length>=3&&typeof e.screenReader==='string'&&e.screenReader.length>=3&&
    Array.isArray(e.lessonIds)&&entries.every(x=>e.lessonIds.includes(x.id));
  }catch{fail(moduleId,'Malformed human review record')}
  const group=topics.filter(t=>t.moduleId===moduleId),blockers=[];
  if(group.length!==8||group.some(t=>!t.stagedValid))blockers.push('Source staging incomplete');
  if(!a11y)blockers.push('Human keyboard/screen-reader/200% zoom review not recorded');
  if(group.some(t=>!t.published))blockers.push('Published MDX/metadata/lab/registry integration pending');
  if(moduleId==='09.02'&&(!pkg.dependencies?.['react-hook-form']||!pkg.dependencies?.['@hookform/resolvers']))blockers.push('Root runtime missing RHF/resolvers');
  if(moduleId==='09.03'&&!pkg.dependencies?.['@tanstack/react-query'])blockers.push('Root runtime missing TanStack Query');
  if(!versions.reactHookForm||!versions.tanstackQuery)blockers.push('Missing published stack major pins');
  if(!exists('examples/forms-query-vertical/react-client/package-lock.json'))blockers.push('Nested npm lockfile absent');
  modules.push({id:moduleId,total:entries.length,staged:group.filter(x=>x.stagedValid).length,
   published:group.filter(x=>x.published).length,a11y,blockers,ready:blockers.length===0});
 }
 const snapshot=json('docs/checkpoint.json').snapshot;
 return {status:modules.every(m=>m.ready)&&!sourceErrors.length?'ready':'prepublication',modules,topics,sourceErrors,
  snapshot:{published:snapshot.publishedLessons,mdx:snapshot.authoredMdxLessons,labs:snapshot.labFixtures},
  nestedDependenciesPresent:['react-hook-form','@hookform/resolvers','@tanstack/react-query'].every(n=>n in nested.dependencies),
  warning:'Read-only source audit. Does not execute npm, Chromium, React or a screen reader.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=new Set(process.argv.slice(2));
 if([...flags].some(x=>!['--json','--check','--strict'].includes(x)))throw Error('Usage: --json|--check|--strict');
 const result=inspectFormsQueryPromotion();
 if(flags.has('--json'))console.log(JSON.stringify(result,null,2));
 else for(const m of result.modules){console.log(m.id+': '+m.staged+'/'+m.total+' stage-valid, '+m.published+' published');for(const b of m.blockers)console.log(' - '+b)}
 if(result.sourceErrors.length)console.error(JSON.stringify(result.sourceErrors,null,2));
 if((flags.has('--check')&&result.sourceErrors.length)||(flags.has('--strict')&&result.status!=='ready'))process.exitCode=1;
}
