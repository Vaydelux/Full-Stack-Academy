import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const LEGACY='15.02.04';
export const FAMILIES=Object.freeze({15:'security',16:'redis',17:'realtime',18:'integrations',19:'p6-quality',20:'p6-quality',21:'p6-operations',22:'p6-operations',23:'p6-operations',24:'p7-platforms',25:'p7-platforms',26:'p7-enterprise',27:'p7-enterprise'});
export const EXAMPLES=Object.freeze({security:'p5-security',redis:'p5-cache-jobs',realtime:'p5-realtime',integrations:'p5-integrations','p6-quality':'p6-quality','p6-operations':'p6-operations','p7-platforms':'p7-platforms','p7-enterprise':'p7-platforms'});
export const SOURCE_COMMANDS=Object.freeze({security:'test:p5-curriculum-source',redis:'test:p5-redis-source',realtime:'test:p5-realtime-source',integrations:'test:p5-integrations-source','p6-quality':'test:p6-quality-source','p6-operations':'test:p6-operations-source','p7-platforms':'test:p7-source','p7-enterprise':'test:p7-source'});
const sha=value=>createHash('sha256').update(value).digest('hex');
const canonicalId=/^\d{2}\.\d{2}\.\d{2}$/;
const digest=/^[a-f0-9]{64}$/;
const moduleId=/^\d{2}\.\d{2}$/;
export function manuscriptPath(id){assert.match(id,canonicalId);const family=FAMILIES[id.slice(0,2)];assert.ok(family,'Not a P5–P7 topic');return 'drafts/'+family+'/lessons/'+id+'.mdx';}
export function checkManuscript(topic,source){
 const text=source.replaceAll('\r\n','\n');
 const front=text.match(/^---\n([\s\S]*?)\n---\n/)?.[1]?.split('\n');assert.ok(front,'Missing frontmatter: '+topic.id);
 const exact=(key,value)=>{const lines=front.filter(l=>l.startsWith(key+':'));assert.deepEqual(lines,[key+': '+JSON.stringify(value)],'Invalid '+key+': '+topic.id);};
 for(const [k,v] of [['id',topic.id],['title',topic.title],['module',topic.moduleId],['status','draft-unverified']])exact(k,v);
 const flags=front.filter(l=>/^(publication|readyToPublish):/.test(l));assert.equal(flags.length,1,'Ambiguous publication flags: '+topic.id);assert.match(flags[0],/^(publication|readyToPublish): false$/);
 assert.ok(!/^publication:/.test(flags[0])||topic.id.startsWith('15.'),'Legacy flag outside security');
 for(const n of [1,2,3])assert.match(text,new RegExp('^## Step '+n+'\\b','m'),'Missing guided step: '+topic.id);
 assert.match(text,/^## Knowledge check\s*$/mi);assert.match(text,/^## Publication (?:conditions|readiness)\s*$/mi);assert.match(text,/https:\/\//);
 assert.doesNotMatch(text,/<LabGate\b|<script\b|dangerouslySetInnerHTML\s*=/i,'Unsafe or live draft markup: '+topic.id);
 return sha(text);
}
export function buildLatePlan({catalog,publishedIds,files,read,gates,scripts}){
 assert.ok(Array.isArray(publishedIds)&&new Set(publishedIds).size===publishedIds.length,'Duplicate publication IDs');
 const published=new Set(publishedIds),all=new Set(catalog.lessons.map(l=>l.id));assert.ok(published.has(LEGACY),'Missing historical published identity lesson');
 for(const id of published)assert.ok(all.has(id),'Unknown published ID '+id);
 const expected=catalog.lessons.filter(t=>Object.hasOwn(FAMILIES,t.trackId));assert.equal(expected.length,400);assert.equal(new Set(expected.map(t=>t.id)).size,400);
 const ids=[...new Set(expected.map(t=>t.moduleId))].sort();assert.equal(ids.length,50);assert.deepEqual(Object.keys(gates).sort(),ids,'Missing or extra module runtime gates');
 const fileSet=new Set(files);assert.equal(fileSet.size,files.length,'Duplicate source path');
 const families=[...new Set(Object.values(FAMILIES))];
 const articles=files.filter(p=>families.some(f=>p.startsWith('drafts/'+f+'/lessons/'))&&p.endsWith('.mdx'));
 assert.deepEqual(articles.sort(),expected.map(t=>manuscriptPath(t.id)).sort(),'Late manuscript inventory mismatch');
 const familyBindings={};
 for(const family of families){
  const prefix='examples/'+EXAMPLES[family]+'/',draftPrefix='drafts/'+family+'/';
  const shared=files.filter(p=>p.startsWith(prefix)||p.startsWith(draftPrefix)&&!p.startsWith(draftPrefix+'lessons/')).sort();
  assert.ok(shared.some(p=>p.startsWith(prefix)&&p.endsWith('.test.mjs')),'No related teaching tests: '+family);
  assert.ok(typeof scripts[SOURCE_COMMANDS[family]]==='string'&&scripts[SOURCE_COMMANDS[family]].trim(),'Missing source command '+family);
  familyBindings[family]=Object.fromEntries(shared.map(p=>[p,sha(read(p))]));
 }
 const modules=ids.map(id=>{
  assert.match(id,moduleId);const rows=expected.filter(t=>t.moduleId===id).sort((a,b)=>a.id.localeCompare(b.id));assert.equal(rows.length,8);
  const family=FAMILIES[id.slice(0,2)],runtime=gates[id];assert.ok(Array.isArray(runtime)&&runtime.length>=2&&runtime.every(x=>typeof x==='string'&&x.trim().length>=12),'Incomplete runtime gate '+id);
  const topics=rows.map((t,i)=>{assert.equal(t.id,id+'.'+String(i+1).padStart(2,'0'));assert.equal(FAMILIES[t.trackId],family);const path=manuscriptPath(t.id);return {id:t.id,title:t.title,path,sha256:checkManuscript(t,read(path)),historical:t.id===LEGACY,published:published.has(t.id)};});
  const candidates=topics.filter(t=>!t.historical),pending=candidates.filter(t=>!t.published);assert.ok(pending.length===0||pending.length===candidates.length,'Partial late module publication: '+id);
  const bindings=familyBindings[family],sourceScript=SOURCE_COMMANDS[family];
  return {id,phase:Number(id.slice(0,2))<=18?'P5':Number(id.slice(0,2))<=23?'P6':'P7',family,sourceScript,runtime,topics,remaining:pending.map(t=>t.id),fingerprint:sha(JSON.stringify({id,runtime,sourceScript,command:scripts[sourceScript],topics:topics.map(({published,...t})=>t),bindings})),qualification:'not-run',publicationApproved:false};
 });
 const phases=['P5','P6','P7'].map((id,i)=>{const rows=modules.filter(m=>m.phase===id),planned=rows.flatMap(m=>m.topics).filter(t=>!t.historical).length;assert.equal(planned,[119,144,136][i]);assert.equal(rows.length,[15,18,17][i]);return {id,modules:rows.length,planned,remaining:rows.reduce((n,m)=>n+m.remaining.length,0)};});
 return {canonical:400,historical:1,newCandidates:399,phases,modules,familyBindings,publicationApproved:false};
}
export function evidenceTemplate(module){return {schemaVersion:1,moduleId:module.id,sourceSha256:module.fingerprint,reviewer:'',date:'',environment:'',sourceChecksPassed:false,sourceReceiptSha256:'',lessons:module.topics.filter(t=>!t.historical).map(t=>({id:t.id,positive:'',negative:'',runtime:'',runtimeArtifactSha256:'',editorial:false,browser:false,keyboard:false,zoom200:false,screenReader:false,contrast:false,accessibilityNotes:''})),publicationApproved:false};}
const observed=s=>typeof s==='string'&&s.trim().length>=20&&!/^(?:not.run|pending|todo|n\/a|placeholder|example|none|unknown)\b/i.test(s.trim());
export function validateEvidence(module,e){
 assert.equal(e.schemaVersion,1);assert.equal(e.moduleId,module.id);assert.equal(e.sourceSha256,module.fingerprint,'Stale source fingerprint');assert.equal(e.publicationApproved,false,'Evidence cannot approve publication');
 assert.ok(typeof e.reviewer==='string'&&e.reviewer.trim().length>=3);assert.match(e.date,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(e.date).toISOString().slice(0,10),e.date,'Invalid review date');assert.ok(observed(e.environment));assert.equal(e.sourceChecksPassed,true);assert.match(e.sourceReceiptSha256,digest);
 const expected=module.topics.filter(t=>!t.historical).map(t=>t.id).sort();assert.ok(Array.isArray(e.lessons));assert.deepEqual(e.lessons.map(t=>t.id).sort(),expected,'Missing, duplicate, or historical lesson evidence');
 for(const t of e.lessons){for(const k of ['positive','negative','runtime','accessibilityNotes'])assert.ok(observed(t[k]),'Missing observation '+t.id+' '+k);assert.match(t.runtimeArtifactSha256,digest);for(const k of ['editorial','browser','keyboard','zoom200','screenReader','contrast'])assert.equal(t[k],true,'Incomplete review '+t.id+' '+k);}
 return {moduleId:module.id,structureValid:true,authenticityVerified:false,publicationApproved:false};
}
