/** Candidate-only verification and explicit rebind. Never writes live lessons or grants approval. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { MODULES, buildCandidateModule, inspectCandidateModule } from './nest-candidate-inventory.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const [mode='--check',id,...extra]=process.argv.slice(2);
assert.ok(!extra.length&&['--check','--json','--refresh'].includes(mode)&&(!id||MODULES.includes(id)),'Usage: --check|--json|--refresh [11.01–11.04]');
const catalog=json('data/curriculum.json');
const selected=id?[id]:MODULES;
const manifest=m=>'release-candidates/nestjs/'+m+'/module.json';
let revision;
if(mode==='--refresh'){
 const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 assert.equal(git(['status','--porcelain']),'','Commit reviewed source fixes before rebinding candidate records');
 revision=git(['rev-parse','HEAD']);
}
const packs=selected.map(m=>mode==='--refresh'?buildCandidateModule(m,catalog,read,revision):json(manifest(m)));
const results=packs.map((pack,i)=>inspectCandidateModule(pack,selected[i],catalog,read));
const slugs=packs.flatMap(p=>p.candidates.map(c=>c.slug));
assert.equal(new Set(slugs).size,slugs.length,'Duplicate candidate lab slug');
const targets=packs.flatMap(p=>p.candidates.flatMap(c=>c.targetPaths));
assert.equal(new Set(targets).size,targets.length,'Duplicate publication target');
const pins=json('content/stack-versions.json');
assert.equal(pins.typescript,'5','Next root compiler pin changed');
assert.equal(pins.typescriptNestjs,'6','Isolated Nest compiler pin missing');
if(mode==='--refresh')for(let i=0;i<packs.length;i++)fs.writeFileSync(path.join(root,manifest(selected[i])),JSON.stringify(packs[i],null,2)+'\n');
console.log(JSON.stringify({mode,candidates:results.reduce((n,m)=>n+m.candidates,0),plannedArtifactPaths:targets.length,modules:results,runtimeExecuted:false,publicationApproved:false,note:'Source bindings and proposed metadata only. Actual article rendering, lab test wrappers, runtime, human review and atomic promotion remain required.'},null,2));
