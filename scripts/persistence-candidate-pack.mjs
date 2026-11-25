/** Materialize a source-bound candidate into an isolated review directory, never a live registry. */
import assert from 'node:assert/strict';
import {sha256} from './persistence-sql-runner.mjs';
const json=o=>JSON.stringify(o,null,2)+'\n';
const sqlKinds=new Set(['sql-contract','single-session-sql-semantics']);
export function buildCandidatePack(module,read,runnerSource){
 assert.match(module.id,/^(12\.0[1-5]|1[34]\.0[1-4])$/);assert.equal(module.topics.length,8);assert.equal(module.publicationApproved,false);
 const files=new Map(),records=[];
 function bind(path,digest,target){const content=read(path);assert.equal(sha256(content),digest,'Source changed: '+path);assert.ok(!files.has(target),'Duplicate target '+target);files.set(target,content);return sha256(content);}
 for(const [path,digest] of Object.entries(module.shared)){
  const name=path.endsWith('/fixture.sql')?'fixture.sql':path.endsWith('/module.json')?'source-module.json':null;assert.ok(name,'Unknown shared source');bind(path,digest,name);
 }
 for(const [i,t] of module.topics.entries()){
  assert.equal(t.id,module.id+'.0'+(i+1));assert.match(t.slug,/^[a-z][a-z0-9-]+$/);assert.equal(t.publicationApproved,false);assert.equal(Object.keys(t.bindings).length,6);
  const pg=module.id.startsWith('12.'),draft=pg?'drafts/postgresql':'drafts/p4',dir='topics/'+t.id,sourceDir=draft+'/labs/'+t.slug+'/',lesson=draft+'/lessons/'+t.id;
  const refs={};
  for(const [path,digest] of Object.entries(t.bindings)){
   let name;if(path===lesson+'.mdx')name='lesson.mdx';else if(path===lesson+'.meta.json')name='source-meta.json';else if(path.startsWith(sourceDir)){name=path.slice(sourceDir.length);assert.match(name,/^(lab\.json|(?:starter|solution)\.(?:sql|ts|sh|prisma)|acceptance\.(?:sql|md))$/);}else throw Error('Unexpected binding '+path);
   refs[name]=bind(path,digest,dir+'/'+name);
  }
  for(const name of ['lesson.mdx','source-meta.json','lab.json'])assert.ok(refs[name],'Missing '+name);
  const sql=sqlKinds.has(t.kind);const starter=Object.keys(refs).filter(x=>x.startsWith('starter.')),solution=Object.keys(refs).filter(x=>x.startsWith('solution.'));
  assert.equal(starter.length,1);assert.equal(solution.length,1);assert.equal(starter[0].slice(8),solution[0].slice(9));assert.ok(refs[sql?'acceptance.sql':'acceptance.md']);
  if(sql)assert.ok(pg&&files.has('fixture.sql')&&refs['starter.sql']&&refs['solution.sql']);
  const commands=sql?['node run-sql.mjs '+t.id]:[];
  const record={id:t.id,title:t.title,kind:t.kind,sourceFiles:refs,commands,manualRuntimeRequired:!sql,concurrencyReviewRequired:t.requiresSeparateConcurrencyReview===true,twoUserReviewRequired:t.requiresTwoAuthenticatedUsers===true,runtimeExecuted:false,publicationApproved:false};records.push(record);
  files.set(dir+'/review.json',json({id:t.id,positiveObservation:'',negativeObservation:'',runtimeArtifact:'',editorialReviewed:false,browserReviewed:false,keyboardReviewed:false,screenReaderReviewed:false,zoom200Reviewed:false,contrastReviewed:false,publicationApproved:false}));
  files.set(dir+'/README.md','# '+t.title+'\n\nUNPUBLISHED REVIEW CANDIDATE. Do not run against production.\n\n'+(sql?'Run from package root: `'+commands[0]+'` after configuring a disposable PostgreSQL 17+ test database. This proves only single-session semantics.':'Use acceptance.md to build and execute an isolated real runtime exercise. No executable acceptance wrapper is claimed for this topic.')+'\n\nNo runtime or publication approval is implied.\n');
 }
 if(records.some(r=>r.commands.length)){
  files.set('persistence-sql-runner.mjs',runnerSource);
  files.set('run-sql.mjs',"import { readFileSync } from 'node:fs';\nimport { runSqlPair, sha256 } from './persistence-sql-runner.mjs';\nimport assert from 'node:assert/strict';\nconst read=p=>readFileSync(new URL(p,import.meta.url),'utf8');\nconst pack=JSON.parse(read('pack.json'));\nconst [id,...rest]=process.argv.slice(2);\nassert.ok(!rest.length&&/^12\\.0[1-5]\\.0[1-8]$/.test(id),'Specify one SQL topic ID');\nconst row=pack.topics.find(t=>t.id===id);\nassert.ok(row&&['sql-contract','single-session-sql-semantics'].includes(row.kind),'Not an automated SQL contract');\nconst checked=(p,hash)=>{const s=read(p);assert.equal(sha256(s),hash,'Source mismatch '+p);return s;};\nconst source=name=>checked('topics/'+id+'/'+name,row.sourceFiles[name]);\nconsole.log(JSON.stringify(runSqlPair({id,fixture:checked('fixture.sql',pack.fixtureSha256),starter:source('starter.sql'),solution:source('solution.sql'),acceptance:source('acceptance.sql')}),null,2));\n");
 }
 files.set('pack.json',json({moduleId:module.id,sourceFingerprint:module.fingerprint,fixtureSha256:files.has('fixture.sql')?sha256(files.get('fixture.sql')):null,topics:records,runtimeExecuted:false,publicationApproved:false}));
 return {files,records,automated:records.filter(r=>r.commands.length).length,manual:records.filter(r=>r.manualRuntimeRequired).length};
}
