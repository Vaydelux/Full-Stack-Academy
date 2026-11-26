/** Read-only source triage. No source content is executed; no publication approval is issued. */
const idPattern=/^\d{2}\.\d{2}\.\d{2}$/;
const safePath=/^(?:drafts|examples)\/[a-zA-Z0-9_./-]+$/;
const withinSource=path=>typeof path==='string'&&safePath.test(path)&&!path.split('/').some(part=>part==='..'||part==='.'||part==='');
export function auditPrerequisites(lessons, metadata=[]) {
 const ids=new Set(lessons.map(x=>x.id)), errors=[], edges=new Map(lessons.map(x=>[x.id,new Set()]));
 let canonicalEdges=0,manuscriptEdges=0;
 function add(id,deps,origin){
  if(!ids.has(id)||!Array.isArray(deps)){errors.push(origin+': invalid prerequisite record '+id);return;}
  const seen=new Set();
  for(const dep of deps){
   if(typeof dep!=='string'||!ids.has(dep)||dep===id||seen.has(dep)){errors.push(origin+': invalid prerequisite '+id+' -> '+String(dep));continue;}
   seen.add(dep);edges.get(id).add(dep);
   if(origin==='canonical')canonicalEdges++;else manuscriptEdges++;
  }
 }
 for(const lesson of lessons)add(lesson.id,lesson.prerequisites,'canonical');
 for(const meta of metadata)if(meta.prerequisites!==undefined)add(meta.id,meta.prerequisites,'manuscript');
 const visited=new Set(),active=new Set();
 function visit(id){if(active.has(id)){errors.push('Prerequisite cycle at '+id);return;}if(visited.has(id))return;active.add(id);for(const dep of edges.get(id)??[])visit(dep);active.delete(id);visited.add(id);}
 for(const id of ids)visit(id);
 return {canonicalEdges,manuscriptEdges,topicsWithGuidance:[...edges.values()].filter(x=>x.size).length,errors,advisories:canonicalEdges===0?['Canonical prerequisite graph is empty; manuscript metadata is advisory and incomplete.']:[]};
}
export function auditManuscript(record, topic, parseReading, safeReference) {
 const issues=[], review=[], source=record.source;
 let blocks=[];
 try{blocks=parseReading(source);}catch{issues.push('Unreadable manuscript');}
 const headingCount=blocks.filter(x=>x.kind==='heading').length;
 const codeCount=blocks.filter(x=>x.kind==='code').length;
 const quizzes=blocks.filter(x=>x.kind==='quiz');
 if(!headingCount)issues.push('No readable headings');
 let fence=null;
 for(const line of source.split(/\r?\n/)){
  if(fence){if(new RegExp('^\\s*'+fence[0]+'{'+fence.length+',}\\s*$').test(line))fence=null;continue;}
  const open=/^\s*(`{3,}|~{3,})/.exec(line);if(open)fence=open[1];
 }
 if(fence)issues.push('Unclosed code fence');
 const text=blocks.filter(x=>x.kind!=='code').flatMap(x=>[x.text,x.title,...(x.items??[])]).filter(x=>typeof x==='string').join('\n');
 const links=[...text.matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/g)].map(x=>x[1]);
 if(links.some(url=>!safeReference(url)))review.push('Review unsupported or non-HTTPS manuscript links');
 if(!links.some(url=>safeReference(url)))review.push('No supported inline official link found');
 if(!quizzes.length&&!/knowledge check|assessment|reflection|reflect/i.test(text))review.push('Review assessment coverage');
 if(!/negative|reject|denied|fail|bug hunt/i.test(text))review.push('Review negative acceptance scenario');
 if(!/qualification|unverified|not published|staged|publication|draft/i.test(text))review.push('Review qualification boundary');
 const meta=record.meta;
 if(meta){
  if(meta.id!==record.id||meta.moduleId!==undefined&&meta.moduleId!==topic?.moduleId||meta.title!==undefined&&meta.title!==topic?.title)issues.push('Metadata identity mismatch');
  if(meta.readyToPublish===true||meta.publication===true)issues.push('Draft claims publication readiness');
 }
 if(!topic||!idPattern.test(record.id))issues.push('Unknown canonical topic');
 return {id:record.id,group:record.group,headings:headingCount,codeBlocks:codeCount,structuredQuizzes:quizzes.length,links:links.length,issues,review,sourceStatus:issues.length?'needs-repair':'source-inspected',runtime:'not-run',editorial:'not-reviewed',publicationApproved:false};
}
export function auditLabManifest({path,manifest}, topics, fileExists) {
 const issues=[];
 const dir=path.slice(0,path.lastIndexOf('/')+1);
 if(!topics.has(manifest.lessonId))issues.push('Unknown lab lesson ID');
 if(manifest.readyToPublish!==false)issues.push('Draft lab readiness must be false');
 for(const key of ['starter','solution']){
  const value=manifest[key];
  if(!withinSource(value)||!value.startsWith(dir)||!fileExists(value))issues.push('Missing or unsafe '+key);
 }
 if(manifest.starter===manifest.solution)issues.push('Starter and solution share a path');
 for(const key of ['fixture','acceptance','acceptanceDoc'])if(manifest[key]!==undefined&&(!withinSource(manifest[key])||!fileExists(manifest[key])))issues.push('Missing or unsafe '+key);
 return {path,lessonId:manifest.lessonId,issues,sourceStatus:issues.length?'needs-repair':'manifest-inspected',runtime:'not-run',publicationApproved:false};
}
export function auditCurriculum({catalog,publishedIds,records,manifests,parseReading,safeReference,fileExists}){
 const byId=new Map(catalog.lessons.map(x=>[x.id,x])), published=new Set(publishedIds),seen=new Set(),issues=[];
 if(byId.size!==catalog.lessons.length)issues.push('Duplicate canonical topic');
 for(const id of published)if(!byId.has(id))issues.push('Unknown published topic '+id);
 for(const r of records){if(seen.has(r.id))issues.push('Duplicate manuscript '+r.id);seen.add(r.id);if(!byId.has(r.id))issues.push('Unknown manuscript '+r.id);}
 const missing=catalog.lessons.filter(x=>!published.has(x.id)&&!seen.has(x.id)).map(x=>x.id);
 if(missing.length)issues.push('Missing manuscript coverage');
 const reading=records.filter(x=>!published.has(x.id));
 const articles=reading.map(x=>auditManuscript(x,byId.get(x.id),parseReading,safeReference));
 const labs=manifests.map(x=>auditLabManifest(x,byId,fileExists));
 const labById=new Map();
 for(const lab of labs){if(labById.has(lab.lessonId))issues.push('Duplicate lab manifest for '+lab.lessonId);labById.set(lab.lessonId,lab);}
 for(const r of reading)if(r.meta?.labSlug){
  const expected='drafts/'+r.group+'/labs/'+r.meta.labSlug+'/lab.json';
  if(labById.get(r.id)?.path!==expected)issues.push('Metadata/lab mapping mismatch '+r.id);
 }
 const prerequisites=auditPrerequisites(catalog.lessons,records.flatMap(x=>x.meta?[x.meta]:[]));
 const modules=catalog.modules.map(m=>{
  const rows=articles.filter(x=>byId.get(x.id)?.moduleId===m.id);
  return {id:m.id,pending:rows.length,sourceIssues:rows.filter(x=>x.issues.length).length,reviewFlags:rows.filter(x=>x.review.length).length,labManifests:rows.filter(x=>labById.has(x.id)).length,runtime:'not-run',publicationApproved:false};
 }).filter(x=>x.pending);
 return {schemaVersion:1,scope:'source-triage-only',totals:{canonical:byId.size,published:published.size,manuscripts:records.length,reading:reading.length,historical:records.length-reading.length,missing:missing.length,manifests:labs.length,articlesWithSourceIssues:articles.filter(x=>x.issues.length).length,articlesWithReviewFlags:articles.filter(x=>x.review.length).length,manifestIssues:labs.filter(x=>x.issues.length).length},missing,issues,prerequisites,modules,articles,labs,publicationApproved:false,runtime:'not-run',editorial:'not-reviewed'};
}
