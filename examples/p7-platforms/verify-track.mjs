import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as models from './labs.mjs';
const modelNames=['bridgeAllowed','applyOperation','desktopAllowed','resumeQueue','aggregateEvents','citedAnswer','validPoint','mediaAllowed','enterpriseAccess','entitlement','retentionDecision','adminAllowed','webAcceptance','apiAcceptance','workspaceAcceptance','productionAcceptance','defenseAcceptance'];
const modules=['24.01','24.02','24.03','24.04','25.01','25.02','25.03','25.04','26.01','26.02','26.03','26.04','27.01','27.02','27.03','27.04','27.05'];
const fields=['context','concept','exercise','positive','negative','reference','model','boundary'];
const family=id=>/^(24|25)\./.test(id)?'p7-platforms':'p7-enterprise';
export function auditP7({catalog,specs,files,load,publishedIds=[]}){
 const errors=[],topics=catalog.lessons.filter(l=>/^(24|25|26|27)\./.test(l.id)),ids=new Set(topics.map(l=>l.id)),contexts=new Set(),expected=topics.map(l=>family(l.id)+'/lessons/'+l.id+'.mdx').sort();
 if(topics.length!==136||ids.size!==136)errors.push('canonical-count');
 for(const mod of modules)if(topics.filter(l=>l.moduleId===mod).length!==8)errors.push('module-count:'+mod);
 if(JSON.stringify([...files].sort())!==JSON.stringify(expected))errors.push('file-inventory');
 if(JSON.stringify(Object.keys(specs).sort())!==JSON.stringify([...ids].sort()))errors.push('spec-inventory');
 for(const l of topics){const id=l.id,s=specs[id];
  if(!s||fields.some(k=>typeof s[k]!=='string'||!s[k].trim())){errors.push('missing-spec:'+id);continue;}
  if(contexts.has(s.context))errors.push('duplicate-context:'+id);contexts.add(s.context);
  if(s.model!==modelNames[modules.indexOf(l.moduleId)]||typeof models[s.model]!=='function')errors.push('model:'+id);
  if(!s.reference.startsWith('https://'))errors.push('reference:'+id);
  if(publishedIds.includes(id))errors.push('premature-publication:'+id);
  let source;try{source=load(id);}catch{errors.push('missing-manuscript:'+id);continue;}
  const front=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)?.[1]?.split(/\r?\n/)??[];
  for(const [key,value] of [['id',id],['title',l.title],['module',l.moduleId],['status','draft-unverified'],['readyToPublish',false]])if(!front.includes(key+': '+JSON.stringify(value))||front.filter(x=>x.startsWith(key+':')).length!==1)errors.push('frontmatter:'+id+':'+key);
  for(const k of fields)if(!source.includes(s[k]))errors.push('spec-drift:'+id+':'+k);
  for(const h of ['## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions'])if(!source.includes(h))errors.push('section:'+id+':'+h);
  if(!source.includes('node --test --test-name-pattern="'+l.moduleId.replaceAll('.','[.]')+'" examples/p7-platforms/labs.test.mjs'))errors.push('command:'+id);
 }
 return {ok:errors.length===0,topics:topics.length,modules:modules.length,errors};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
 const root=resolve(dirname(self),'../..'),read=p=>readFileSync(resolve(root,p),'utf8');
 const publishedIds=readdirSync(resolve(root,'src/content/lessons')).filter(f=>f.endsWith('.meta.json')).map(f=>JSON.parse(read('src/content/lessons/'+f)).id);
 const authored=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 if(!authored)throw Error('Cannot read publication inventory');
 publishedIds.push(...[...authored[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
 const families=['p7-platforms','p7-enterprise'],specs={},files=[];
 for(const f of families){const s=JSON.parse(read('drafts/'+f+'/topics.json'));for(const [id,value] of Object.entries(s)){if(Object.hasOwn(specs,id))throw Error('duplicate-spec:'+id);specs[id]=value;}files.push(...readdirSync(resolve(root,'drafts',f,'lessons')).filter(n=>n.endsWith('.mdx')).map(n=>f+'/lessons/'+n));}
 const report=auditP7({catalog:JSON.parse(read('data/curriculum.json')),specs,files,publishedIds,load:id=>read('drafts/'+family(id)+'/lessons/'+id+'.mdx')});
 console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
}
