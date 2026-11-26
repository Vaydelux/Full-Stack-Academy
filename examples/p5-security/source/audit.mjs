import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';

function field(article,key) {
  const found=article.match(new RegExp('^'+key+':\\s*["\']?(.+?)["\']?\\s*$', 'm'));
  return found?.[1];
}
export function audit({catalog,load,registry=''}) {
  const errors=[];
  const expected=catalog.lessons.filter(x=>/^15\.0[1-4]\.\d{2}$/.test(x.id));
  if(expected.length!==32)errors.push('expected 32 canonical security topics, got '+expected.length);
  const seen=new Set(), perModule={};
  for(const topic of expected){
    if(seen.has(topic.id))errors.push('duplicate ID '+topic.id);
    seen.add(topic.id);
    perModule[topic.moduleId]=(perModule[topic.moduleId]||0)+1;
    let article;
    try{article=load(topic.id);}catch(e){errors.push('missing '+topic.id);continue;}
    if(field(article,'id')!==topic.id)errors.push(topic.id+': incorrect frontmatter id');
    if(field(article,'title')!==topic.title)errors.push(topic.id+': title disagrees with catalog');
    if(field(article,'module')!==topic.moduleId)errors.push(topic.id+': incorrect module');
    if(field(article,'status')!=='draft-unverified')errors.push(topic.id+': not marked draft-unverified');
    if(/^readyToPublish:\s*true\s*$/m.test(article))errors.push(topic.id+': premature promotion flag');
    for(let step=1;step<=3;step++)if(!new RegExp('^## Step '+step+'\\b','m').test(article))errors.push(topic.id+': missing guided step '+step);
    if(!/^## Knowledge check\s*$/mi.test(article))errors.push(topic.id+': missing knowledge check');
    if(!/https:\/\//.test(article))errors.push(topic.id+': missing reference URL');
    if(registry.includes(topic.id+'.mdx')||registry.includes(topic.id+'.meta.json'))errors.push(topic.id+': found in published registry');
  }
  for(const courseModule of ['15.01','15.02','15.03','15.04'])if(perModule[courseModule]!==8)errors.push(courseModule+': expected eight topics');
  return {ok:errors.length===0,errors,topics:expected.length,perModule};
}
const current=fileURLToPath(import.meta.url);
if(process.argv[1] && resolve(process.argv[1])===current){
  const root=resolve(dirname(current),'../../..');
  const curriculum=JSON.parse(readFileSync(resolve(root,'data/curriculum.json'),'utf8'));
  const registry=readFileSync(resolve(root,'src/content/lesson-registry.tsx'),'utf8')+readFileSync(resolve(root,'src/lib/academy/published.ts'),'utf8');
  const result=audit({catalog:curriculum,registry,load:id=>readFileSync(resolve(root,'drafts/security/lessons',id+'.mdx'),'utf8')});
  console.log(JSON.stringify(result,null,2));
  if(!result.ok)process.exitCode=1;
}
