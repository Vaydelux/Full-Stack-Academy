import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPersistencePlan,isSqlContract } from './persistence-release-plan.mjs';
import { readPersistencePublishedCount } from './persistence-publication-baseline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
assert.ok(args.length<=1&&args.every(a=>['--check','--json'].includes(a)),'Usage: --check or --json');
const read=p=>readFileSync(path.join(root,p),'utf8');
const report=buildPersistencePlan(JSON.parse(read('data/curriculum.json')),read);
const published=readPersistencePublishedCount(root);
if(args.includes('--json'))console.log(JSON.stringify({...report,published},null,2));
else{
 for(const m of report.modules)console.log(m.id+' '+m.topics.length+' source contracts; '+m.topics.filter(t=>isSqlContract(t.kind)).length+' SQL; '+m.topics.filter(t=>!isSqlContract(t.kind)).length+' manual; fingerprint '+m.fingerprint);
 console.log('Source plan: '+report.topics+' topics; '+report.sqlContracts+' SQL; '+report.manualContracts+' manual; '+report.separateConcurrencyReviews+' separate concurrency reviews; published '+published+'; runtime NOT executed; publication NOT approved.');
}
