import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const field=(source,key)=>source.match(new RegExp('^'+key+':\\s*"([^"\\n]+)"\\s*$','m'))?.[1];
export function auditRedisTrack({catalog,load,publishedRegistry=''}) {
  const errors=[];
  const topics=(catalog?.lessons||[]).filter(topic=>topic.trackId==='16');
  const seen=new Set(),counts={};
  if(topics.length!==32)errors.push(`Expected 32 Redis/BullMQ topics, got ${topics.length}`);
  for(const topic of topics){
    if(seen.has(topic.id))errors.push('Duplicate canonical ID '+topic.id);
    seen.add(topic.id);
    counts[topic.moduleId]=(counts[topic.moduleId]||0)+1;
    let article;
    try { article=load(topic.id); }
    catch { errors.push('Missing draft '+topic.id); continue; }
    for(const [key,value] of [['id',topic.id],['title',topic.title],['module',topic.moduleId],['status','draft-unverified']])
      if(field(article,key)!==value)errors.push(`${topic.id} incorrect ${key}`);
    if(!/^readyToPublish:\s*false\s*$/m.test(article))errors.push(topic.id+' publication flag unsafe');
    for(const n of [1,2,3])if(!new RegExp('^## Step '+n+'\\b','m').test(article))errors.push(topic.id+' missing step '+n);
    if(!/^## Knowledge check\b/m.test(article))errors.push(topic.id+' missing knowledge check');
    if(!/https:\/\//.test(article))errors.push(topic.id+' missing source URL');
    if(publishedRegistry.includes(topic.id+'.mdx')||publishedRegistry.includes(topic.id+'.meta.json'))errors.push(topic.id+' prematurely published');
  }
  for(const courseModule of ['16.01','16.02','16.03','16.04'])if(counts[courseModule]!==8)errors.push(courseModule+' should have 8 topics');
  return {ok:errors.length===0,errors,topics:topics.length,counts};
}
const file=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===file){
  const root=resolve(dirname(file),'../..');
  const catalog=JSON.parse(readFileSync(resolve(root,'data/curriculum.json'),'utf8'));
  const reg=readFileSync(resolve(root,'src/content/lesson-registry.tsx'),'utf8')+readFileSync(resolve(root,'src/lib/academy/published.ts'),'utf8');
  const result=auditRedisTrack({catalog,publishedRegistry:reg,load:id=>readFileSync(resolve(root,'drafts/redis/lessons',id+'.mdx'),'utf8')});
  console.log(JSON.stringify(result,null,2));
  if(!result.ok)process.exitCode=1;
}
