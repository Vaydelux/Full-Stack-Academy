import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const modules=['19.01','19.02','19.03','19.04','20.01','20.02','20.03','20.04'];
const keys=['context','concept','exercise','positive','negative','reference','model','boundary'];
export function auditQualityTrack({catalog,specs,load,files,publishedIds=[]}){
 const errors=[],topics=catalog.lessons.filter(l=>modules.includes(l.moduleId)),ids=new Set(topics.map(l=>l.id)),contexts=new Set();
 if(topics.length!==64||ids.size!==64)errors.push('canonical-count');
 for(const m of modules)if(topics.filter(l=>l.moduleId===m).length!==8)errors.push('module-count:'+m);
 const expected=[...ids].sort().map(id=>id+'.mdx');
 if(JSON.stringify([...files].sort())!==JSON.stringify(expected))errors.push('manuscript-file-inventory');
 if(JSON.stringify(Object.keys(specs).sort())!==JSON.stringify([...ids].sort()))errors.push('spec-inventory');
 for(const topic of topics){
  const id=topic.id,s=specs[id];
  if(!s||keys.some(k=>typeof s[k]!=='string'||!s[k].trim())){errors.push('missing-spec:'+id);continue;}
  if(contexts.has(s.context))errors.push('duplicate-context:'+id);contexts.add(s.context);
  if(!/^https:\/\//.test(s.reference))errors.push('reference:'+id);
  if(publishedIds.includes(id))errors.push('premature-publication:'+id);
  let source;try{source=load(id);}catch{errors.push('missing-manuscript:'+id);continue;}
  const front=source.split(/\r?\n---\r?\n/,1)[0];
  for(const [key,value] of [['id',id],['title',topic.title],['module',topic.moduleId],['status','draft-unverified']])if(!front.split(/\r?\n/).includes(key+': '+JSON.stringify(value)))errors.push('frontmatter-'+key+':'+id);
  if(!front.split(/\r?\n/).includes('readyToPublish: false'))errors.push('publication-flag:'+id);
  for(const k of keys)if(!source.includes(s[k]))errors.push('spec-drift-'+k+':'+id);
  for(const heading of ['## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions'])if(!source.includes(heading))errors.push('section:'+id+':'+heading);
  const command='node --test --test-name-pattern="'+topic.moduleId.replaceAll('.','[.]')+'" examples/p6-quality/labs.test.mjs';
  if(!source.includes(command))errors.push('lab-command:'+id);
 }
 return {ok:errors.length===0,topics:topics.length,modules:modules.length,errors};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
 const root=resolve(dirname(self),'../..'),read=p=>readFileSync(resolve(root,p),'utf8'),dir='drafts/p6-quality/lessons/';
 const publishedIds=readdirSync(resolve(root,'src/content/lessons')).filter(f=>f.endsWith('.meta.json')).map(f=>JSON.parse(read('src/content/lessons/'+f)).id);
 const authored=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 if(!authored)throw Error('Cannot read interactive publication inventory');
 publishedIds.push(...[...authored[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
 const report=auditQualityTrack({catalog:JSON.parse(read('data/curriculum.json')),specs:JSON.parse(read('drafts/p6-quality/topics.json')),files:readdirSync(resolve(root,dir)).filter(f=>f.endsWith('.mdx')),publishedIds,load:id=>read(dir+id+'.mdx')});
 console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
}
