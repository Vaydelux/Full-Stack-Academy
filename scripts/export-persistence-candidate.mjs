/** Export immutable source candidates to a fresh OS temporary directory. */
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {buildCandidatePack} from './persistence-candidate-pack.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const args=process.argv.slice(2);assert.ok(args.length===2&&['--plan','--export'].includes(args[0]),'Usage: --plan|--export MODULE_ID or all');
const plan=buildPersistencePlan(JSON.parse(read('data/curriculum.json')),read);
const modules=args[1]==='all'?plan.modules:plan.modules.filter(m=>m.id===args[1]);assert.ok(modules.length,'Unknown persistence module');
const packs=modules.map(m=>({id:m.id,...buildCandidatePack(m,read,read('scripts/persistence-sql-runner.mjs'))}));
let output=null;
if(args[0]==='--export'){
 output=mkdtempSync(path.join(tmpdir(),'academy-persistence-review-'));
 try{for(const p of packs)for(const [relative,text] of p.files){const target=path.join(output,p.id,relative);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,text,{flag:'wx'});}}catch(error){rmSync(output,{recursive:true,force:true});throw error;}
}
console.log(JSON.stringify({output,modules:packs.map(p=>({id:p.id,files:p.files.size,automated:p.automated,manual:p.manual})),runtimeExecuted:false,publicationApproved:false},null,2));
