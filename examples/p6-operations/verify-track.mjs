import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const modules=['21.01','21.02','21.03','22.01','22.02','22.03','23.01','23.02','23.03','23.04'];
const models=['safeLog','errorBudget','incidentDecision','webBudget','requestProfile','capacity','boundaryViolations','dependencyCycle','idempotentConsumer','retryDecision'];
const keys=['context','concept','exercise','positive','negative','reference','model','boundary'];
export function auditOperations({catalog,specs,files,load,publishedIds=[]}){
 const topics=catalog.lessons.filter(l=>modules.includes(l.moduleId)),ids=new Set(topics.map(l=>l.id)),errors=[],contexts=new Set();
 if(topics.length!==80||ids.size!==80)errors.push('canonical-count');
 for(const m of modules)if(topics.filter(l=>l.moduleId===m).length!==8)errors.push('module-count:'+m);
 if(JSON.stringify([...files].sort())!==JSON.stringify([...ids].sort().map(id=>id+'.mdx')))errors.push('manuscript-inventory');
 if(JSON.stringify(Object.keys(specs).sort())!==JSON.stringify([...ids].sort()))errors.push('spec-inventory');
 for(const l of topics){const id=l.id,s=specs[id];
  if(!s||keys.some(k=>typeof s[k]!=='string'||!s[k].trim())){errors.push('missing-spec:'+id);continue;}
  if(contexts.has(s.context))errors.push('duplicate-context:'+id);contexts.add(s.context);
  if(s.model!==models[modules.indexOf(l.moduleId)])errors.push('model:'+id);
  if(!s.reference.startsWith('https://'))errors.push('reference:'+id);
  if(publishedIds.includes(id))errors.push('premature-publication:'+id);
  let source;try{source=load(id);}catch{errors.push('missing:'+id);continue;}
  const front=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)?.[1]?.split(/\r?\n/)??[];
  for(const [key,value] of [['id',id],['title',l.title],['module',l.moduleId],['status','draft-unverified']])if(!front.includes(key+': '+JSON.stringify(value)))errors.push('frontmatter:'+id+':'+key);
  if(!front.includes('readyToPublish: false')||front.filter(x=>x.startsWith('readyToPublish:')).length!==1)errors.push('publication-flag:'+id);
  for(const k of keys)if(!source.includes(s[k]))errors.push('spec-drift:'+id+':'+k);
  for(const h of ['## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions'])if(!source.includes(h))errors.push('section:'+id+':'+h);
  if(!source.includes('node --test --test-name-pattern="'+l.moduleId.replaceAll('.','[.]')+'" examples/p6-operations/labs.test.mjs'))errors.push('command:'+id);
 }
 return {ok:!errors.length,topics:topics.length,modules:modules.length,errors};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
 const root=resolve(dirname(self),'../..'),read=p=>readFileSync(resolve(root,p),'utf8'),dir='drafts/p6-operations/lessons/';
 const publishedIds=readdirSync(resolve(root,'src/content/lessons')).filter(f=>f.endsWith('.meta.json')).map(f=>JSON.parse(read('src/content/lessons/'+f)).id);
 const authored=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 if(!authored)throw Error('Cannot read publication inventory');
 publishedIds.push(...[...authored[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
 const report=auditOperations({catalog:JSON.parse(read('data/curriculum.json')),specs:JSON.parse(read('drafts/p6-operations/topics.json')),files:readdirSync(resolve(root,dir)).filter(f=>f.endsWith('.mdx')),publishedIds,load:id=>read(dir+id+'.mdx')});
 console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
}
