import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const MODULES = Object.freeze([
 ['12.01','postgresql-basics'], ['12.02','postgresql-modeling'], ['12.03','postgresql-transactions'],
 ['12.04','postgresql-performance'], ['12.05','postgresql-operations'],
 ['13.01','p4-prisma-setup'], ['13.02','p4-prisma-data'], ['13.03','p4-prisma-advanced'],
 ['13.04','p4-prisma-supabase-integration'], ['14.01','p4-supabase-architecture'],
 ['14.02','p4-supabase-auth'], ['14.03','p4-supabase-rls'], ['14.04','p4-supabase-storage-realtime'],
].map(Object.freeze));
const hash = value => createHash('sha256').update(value).digest('hex');
const slugPattern = /^[a-z][a-z0-9-]+$/;
const extensions = {ts:'ts',sql:'sql',bash:'sh',prisma:'prisma'};
export function qualificationKind(id, raw) {
 if (/^12\.0[12]$/.test(id)) { assert.ok(raw===undefined || raw==='sql-contract'); return 'sql-contract'; }
 if (id==='12.03') { assert.equal(raw,'single-session-sql-semantics'); return raw; }
 if (/^12\.0[45]$/.test(id)) { assert.ok(['sql-contract','manual-evidence'].includes(raw)); return raw; }
 const expected = {'13.01':'manual-toolchain','13.02':'manual-prisma-integration','13.03':'manual-prisma-integration','13.04':'manual-prisma-supabase-integration','14.01':'manual-supabase-local','14.02':'manual-supabase-auth','14.03':'manual-rls-positive-negative','14.04':'manual-storage-realtime-integration'}[id];
 assert.ok(expected && raw===expected,'Unexpected qualification kind for '+id); return raw;
}
export function isSqlContract(kind) { return ['sql-contract','single-session-sql-semantics'].includes(kind); }
export function validatePublicationBaseline(count,mdxIds,interactiveIds) {
 assert.ok(Number.isSafeInteger(count)&&count>=338&&count<=889,'Invalid published checkpoint');
 assert.ok(Array.isArray(mdxIds)&&new Set(mdxIds).size===mdxIds.length,'Duplicate published metadata IDs');
 assert.ok(Array.isArray(interactiveIds)&&new Set(interactiveIds).size===interactiveIds.length,'Duplicate interactive IDs');
 assert.equal(count,new Set([...mdxIds,...interactiveIds]).size,'Checkpoint and published inventory disagree');
 return count;
}
export function buildPersistencePlan(catalog,read) {
 const rows=[],seen=new Set();
 for(const [id,folder] of MODULES) {
  const manifestPath='examples/'+folder+'/module.json', manifestText=read(manifestPath), manifest=JSON.parse(manifestText);
  assert.equal(manifest.moduleId,id);assert.equal(manifest.readyToPublish,false);assert.equal(manifest.runtimeQualification,'not-run');
  const canonical=catalog.lessons.filter(x=>x.moduleId===id).sort((a,b)=>a.id.localeCompare(b.id));
  assert.equal(canonical.length,8);assert.equal(manifest.lessons.length,8);
  const pg=id.startsWith('12.'),base=pg?'drafts/postgresql':'drafts/p4';
  const shared={[manifestPath]:hash(manifestText)};
  if(pg){const fixture='examples/'+folder+'/fixture.sql';assert.equal(manifest.fixture,fixture);shared[fixture]=hash(read(fixture));}
  const topics=canonical.map((topic,i)=>{
   const row=manifest.lessons[i];assert.equal(row.id,topic.id);assert.equal(row.id,id+'.'+String(i+1).padStart(2,'0'));assert.equal(row.title,topic.title);
   assert.ok(slugPattern.test(row.slug)&&!seen.has(base+'/'+row.slug),'Duplicate/invalid lab slug');seen.add(base+'/'+row.slug);
   const kind=qualificationKind(id,row.qualificationKind),labDir=base+'/labs/'+row.slug,lesson=base+'/lessons/'+row.id;
   const ext=pg?'sql':extensions[row.language];assert.ok(ext&&(pg||row.extension===ext),'Unexpected exercise extension');
   const files=[lesson+'.mdx',lesson+'.meta.json',labDir+'/lab.json',labDir+'/starter.'+ext,labDir+'/solution.'+ext,labDir+'/'+(isSqlContract(kind)?'acceptance.sql':'acceptance.md')];
   const sources=Object.fromEntries(files.map(p=>[p,read(p)]));
   const meta=JSON.parse(sources[files[1]]),lab=JSON.parse(sources[files[2]]);
   assert.equal(meta.id,row.id);assert.equal(meta.title,row.title);assert.equal(meta.moduleId,id);assert.equal(meta.labSlug,row.slug);
   assert.equal(meta.sourceStatus,'draft-unverified');assert.equal(meta.runtimeQualification,'not-run');assert.equal(meta.reviewStatus,'unreviewed');
   assert.equal(lab.lessonId,row.id);assert.equal(lab.readyToPublish,false);assert.equal(lab.sourceStatus,'draft-unverified');
   assert.equal(qualificationKind(id,lab.qualificationKind),kind);assert.equal(lab.starter,files[3]);assert.equal(lab.solution,files[4]);
   assert.equal(isSqlContract(kind)?lab.acceptance:lab.acceptanceDoc,files[5]);
   if(pg) assert.equal(lab.fixture,'examples/'+folder+'/fixture.sql');
   if(id==='12.03') assert.equal(lab.requiresSeparateConcurrencyReview,true);
   if(id==='14.03'||id==='14.04') assert.equal(lab.requiresTwoAuthenticatedUsers,true);
   assert.ok(sources[files[3]].trim()&&sources[files[4]].trim()&&sources[files[3]]!==sources[files[4]],'Missing distinct red/green source');
   const language=pg?'sql':row.language, fence=String.fromCharCode(96).repeat(3);
   const matches=[...sources[files[0]].replaceAll('\r\n','\n').matchAll(new RegExp(fence+language+'\\n([\\s\\S]*?)\\n'+fence,'g'))].map(m=>m[1].trim());
   assert.deepEqual(matches,[sources[files[3]].replaceAll('\r\n','\n').trim(),sources[files[4]].replaceAll('\r\n','\n').trim()],'Code fence parity: '+row.id);
   assert.ok(isSqlContract(kind)?sources[files[5]].includes("RAISE EXCEPTION '"+row.id):sources[files[5]].trim().length>=300,'Missing acceptance contract: '+row.id);
   return {id:row.id,title:row.title,slug:row.slug,kind,requiresSeparateConcurrencyReview:id==='12.03',requiresTwoAuthenticatedUsers:lab.requiresTwoAuthenticatedUsers===true,
    bindings:Object.fromEntries(files.map(p=>[p,hash(sources[p])])),runtimeExecuted:false,publicationApproved:false};
  });
  const fingerprint=hash(JSON.stringify({id,shared,topics}));
  rows.push({id,folder,shared,fingerprint,topics,runtimeExecuted:false,publicationApproved:false});
 }
 const topics=rows.flatMap(r=>r.topics);assert.equal(topics.length,104);
 assert.equal(topics.filter(t=>isSqlContract(t.kind)).length,30);
 assert.equal(topics.filter(t=>!isSqlContract(t.kind)).length,74);
 return {modules:rows,topics:104,sqlContracts:30,manualContracts:74,separateConcurrencyReviews:8,runtimeExecuted:false,publicationApproved:false};
}
