import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const field=(source,name)=>source.match(new RegExp('^'+name+':\\s*"([^"\\n]+)"\\s*$','m'))?.[1];
export function auditIntegrationTrack({catalog,specifications,load,publishedRegistry=''}) {
 const errors=[];
 const topics=(catalog?.lessons??[]).filter(topic=>topic.id.startsWith('18.'));
 const specs=specifications??{};
 const seen=new Set();const contexts=new Set();const counts={};
 if(topics.length!==32)errors.push(`Expected 32 canonical Track 18 topics; got ${topics.length}`);
 for(const topic of topics){
  if(seen.has(topic.id))errors.push('duplicate topic '+topic.id);seen.add(topic.id);
  counts[topic.moduleId]=(counts[topic.moduleId]??0)+1;
  const spec=specs[topic.id];
  if(!spec || !['context','failure','correction','positive','negative','caveat','reference'].every(key=>typeof spec[key]==='string'&&spec[key].length>18)){
   errors.push('missing or incomplete topic specification '+topic.id);continue;
  }
  if(contexts.has(spec.context))errors.push('repeated scenario '+topic.id);contexts.add(spec.context);
  let source;
  try{source=load(topic.id);}catch{errors.push('missing manuscript '+topic.id);continue;}
  for(const [key,value] of [['id',topic.id],['module',topic.moduleId],['title',topic.title],['status','draft-unverified']])
   if(field(source,key)!==value)errors.push('bad '+key+' '+topic.id);
  if(!/^readyToPublish:\s*false\s*$/m.test(source))errors.push('unsafe publication flag '+topic.id);
  for(const step of [1,2,3])if(!new RegExp('^## Step '+step+'\\b','m').test(source))errors.push('missing step '+step+' '+topic.id);
  for(const marker of ['## Learning outcomes','## Context','## Knowledge check','## References','## Publication conditions'])
   if(!source.includes(marker))errors.push('missing section '+marker+' '+topic.id);
  for(const key of ['context','failure','correction','positive','negative','caveat'])
   if(!source.includes(spec[key]))errors.push('spec drift '+key+' '+topic.id);
  if(!source.includes(spec.reference)||!spec.reference.startsWith('https://'))errors.push('missing official reference '+topic.id);
  if(!source.includes('node --test examples/p5-integrations/labs.test.mjs'))errors.push('missing runnable lab '+topic.id);
  if(/\b(?:TODO|TBD|lorem ipsum)\b/i.test(source))errors.push('placeholder '+topic.id);
  if(publishedRegistry.includes(topic.id+'.mdx')||publishedRegistry.includes(topic.id+'.meta.json'))errors.push('prematurely published '+topic.id);
 }
 for(const moduleId of ['18.01','18.02','18.03','18.04'])if(counts[moduleId]!==8)errors.push('incorrect module count '+moduleId);
 for(const id of Object.keys(specs))if(!seen.has(id))errors.push('orphan topic spec '+id);
 return {ok:errors.length===0,errors,topics:topics.length,counts};
}
const here=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===here){
 const root=resolve(dirname(here),'../..');
 const read=p=>readFileSync(resolve(root,p),'utf8');
 const report=auditIntegrationTrack({catalog:JSON.parse(read('data/curriculum.json')),
   specifications:JSON.parse(read('drafts/integrations/topics.json')),
   publishedRegistry:read('src/content/lesson-registry.tsx')+read('src/lib/academy/published.ts'),
   load:id=>read(`drafts/integrations/lessons/${id}.mdx`)});
 console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
}
