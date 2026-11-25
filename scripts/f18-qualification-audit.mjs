import {readdirSync,readFileSync,lstatSync,existsSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {collectStagedManuscripts} from './staged-inventory.mjs';
import {parseReading,safeReference} from './reading-edition.mjs';
import {buildPublicationQueue} from './publication-queue.mjs';
import {auditCurriculum} from './f18-qualification-model.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.some(x=>!['--json','--check'].includes(x)))throw Error('Usage: npm run audit:f18 -- [--json] [--check]');
const file=path=>join(root,path);
const regular=path=>{try{let current=root;const parts=path.split('/');for(const [i,part] of parts.entries()){if(!part||part==='.'||part==='..')return false;current=join(current,part);const stat=lstatSync(current);if(stat.isSymbolicLink()||(i===parts.length-1?!stat.isFile():!stat.isDirectory()))return false;}return true;}catch{return false;}};
const read=path=>{if(!regular(path))throw Error('Missing or unsafe source: '+path);return readFileSync(file(path),'utf8');};
const json=path=>JSON.parse(read(path));
const catalog=json('data/curriculum.json');
const source=read('src/lib/academy/authored-content.ts');
const match=source.match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
if(!match)throw Error('Missing authored lesson registry');
const interactive=[...match[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
const live=readdirSync(file('src/content/lessons')).filter(x=>x.endsWith('.meta.json')).map(x=>json('src/content/lessons/'+x).id);
const publishedIds=[...new Set([...interactive,...live])];
const records=collectStagedManuscripts(root,catalog).map(x=>{
 const path='drafts/'+x.group+'/lessons/'+x.id+'.meta.json';
 return {...x,meta:existsSync(file(path))?json(path):undefined};
});
const manifests=[];
for(const group of [...new Set(records.map(x=>x.group))]){
 const dir='drafts/'+group+'/labs';
 if(!existsSync(file(dir)))continue;
 const stat=lstatSync(file(dir));if(!stat.isDirectory()||stat.isSymbolicLink())throw Error('Unsafe lab directory '+dir);
 for(const entry of readdirSync(file(dir),{withFileTypes:true})){
  if(entry.isSymbolicLink())throw Error('Unsafe lab entry '+entry.name);
  if(!entry.isDirectory())continue;
  const path=dir+'/'+entry.name+'/lab.json';
  if(existsSync(file(path)))manifests.push({path,manifest:json(path)});
 }
}
const report=auditCurriculum({catalog,publishedIds,records,manifests,parseReading,safeReference,fileExists:regular});
const queue=buildPublicationQueue(catalog,publishedIds,records.map(x=>x.id));
report.next=queue.next?{id:queue.next.id,phase:queue.next.phase,remaining:queue.next.remaining}:null;
report.queueIssues=queue.issues;
report.catalogSha256=createHash('sha256').update(read('data/curriculum.json')).digest('hex');
if(args.includes('--json'))console.log(JSON.stringify(report,null,2));
else {console.log(JSON.stringify({scope:report.scope,totals:report.totals,prerequisites:report.prerequisites,next:report.next,issues:report.issues,queueIssues:report.queueIssues,publicationApproved:false},null,2));console.log('Use --json for per-topic review flags, module and manifest details.');}
if(args.includes('--check')&&(report.issues.length||report.queueIssues.length||report.prerequisites.errors.length||report.totals.articlesWithSourceIssues||report.totals.manifestIssues))process.exitCode=1;
