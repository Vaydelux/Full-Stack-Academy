import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const field=(s,key)=>s.match(new RegExp('^'+key+':\\s*"([^"\\n]+)"\\s*$','m'))?.[1];
export function auditRealtimeTrack({catalog,load,publishedRegistry=''}) {
  const errors=[];
  const topics=(catalog?.lessons||[]).filter(x=>x.trackId==='17');
  if(topics.length!==24)errors.push('Expected 24 Track 17 lessons; found '+topics.length);
  const counts={},seen=new Set();
  for(const topic of topics){
    if(seen.has(topic.id))errors.push('Duplicate canonical ID '+topic.id);
    seen.add(topic.id);
    counts[topic.moduleId]=(counts[topic.moduleId]||0)+1;
    let manuscript;
    try{manuscript=load(topic.id);}catch{errors.push('Missing manuscript '+topic.id);continue;}
    for(const [key,value] of [['id',topic.id],['title',topic.title],['module',topic.moduleId],['status','draft-unverified']])
      if(field(manuscript,key)!==value)errors.push(topic.id+' incorrect '+key);
    if(!/^readyToPublish:\s*false\s*$/m.test(manuscript))errors.push(topic.id+' unsafe publication flag');
    for(const step of [1,2,3])if(!new RegExp('^## Step '+step+'\\b','m').test(manuscript))errors.push(topic.id+' missing step '+step);
    if(!/^## Knowledge check\b/m.test(manuscript))errors.push(topic.id+' missing knowledge check');
    if(!/https:\/\//.test(manuscript))errors.push(topic.id+' missing official URL');
    if(!/^## Publication conditions\b/m.test(manuscript))errors.push(topic.id+' missing publication gate');
    if(publishedRegistry.includes(topic.id+'.mdx')||publishedRegistry.includes(topic.id+'.meta.json'))errors.push(topic.id+' prematurely published');
  }
  for(const module of ['17.01','17.02','17.03'])if(counts[module]!==8)errors.push(module+' must contain exactly 8 topics');
  return {ok:errors.length===0,errors,topics:topics.length,counts};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
  const root=resolve(dirname(self),'../..');
  const catalog=JSON.parse(readFileSync(resolve(root,'data/curriculum.json'),'utf8'));
  const publishedRegistry=readFileSync(resolve(root,'src/content/lesson-registry.tsx'),'utf8')+readFileSync(resolve(root,'src/lib/academy/published.ts'),'utf8');
  const report=auditRealtimeTrack({catalog,publishedRegistry,load:id=>readFileSync(resolve(root,'drafts/realtime/lessons',id+'.mdx'),'utf8')});
  console.log(JSON.stringify(report,null,2));
  if(!report.ok)process.exitCode=1;
}
